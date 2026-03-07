---
title: 三月番外篇 - 你真的知道多线程在后端服务(SpringX)是如何被处理的吗?
date: 2026-03-02
tags: [java]
categories: [工程实践, 技术开发, 云与架构]
---

你也许听过一个问题, 用户在浏览器点击一个按钮, 都会发生什么?  
其实就是在问 HTTP 请求的全链路 Nginx + Tomcat/Jetty + Spring + MySQL/PostgreSQL. 作为一名后端工程师，当我们写好一个 Spring Boot 应用并部署到生产环境时，它背后承担着非常复杂的并发与状态管理机制。  
这篇文章我会结合多线程机制, 解释每一步是如何并发处理请求并保证线程之间不会互相干扰。

## 1. 浏览器发起 HTTP/HTTPS 请求
浏览器首先构建一个标准 HTTP/HTTPS 请求，这一路径包括： 
* DNS 解析域名
* 建立 TCP 连接（三次握手）
* 若是 HTTPS，还要 SSL/TLS 握手
* 发送 HTTP 请求
这一切在操作系统内核和浏览器内部完成，并不是我们的应用逻辑。  

**多线程/多路复用相关：**  
* 浏览器通过复用 TCP 连接（持久连接/Keep-Alive）和限制对同一域名的并发连接数（通常 6-8 个）来优化性能。这种机制减少了 TCP 三次握手带来的延迟，避免了服务器过载，在 HTTP/1.1 中通过顺序请求实现，而在 HTTP/2 中则实现了真正的多路复用:
  * HTTP/1.1 局限性：虽然可以复用，但 HTTP/1.1 在单个 TCP 连接上同一时刻只能处理一个请求（FIFO 队列），必须等待前一个响应返回才能发送下一个请求。
  * HTTP/2 多路复用：HTTP/2 引入了二进制分帧，在一个 TCP 连接上可以同时发送多个 HTTP 请求和接收多个响应，真正实现了高并发处理，极大提升了加载速度。
* TCP 层通过 socket 并发管理多个连接，内核负责复用/调度。
* HTTP Keep-Alive 允许多个请求复用一个连接。

请求在这一阶段并不会落入你应用代码，而是操作系统 + 浏览器管理的网络层。  
TCP 多路复用是由内核 + 浏览器层协作实现的，也不属于后端逻辑设计。
## 2. Nginx 作为反向代理（事件驱动 & 非阻塞）
大多数企业会选择在生产环境的 Spring Boot 应用之前部署一个 Nginx 反向代理，用于：
* 处理静态资源
* SSL/TLS 终止
* 负载均衡
* 请求缓存
* 限流等

Nginx 并不是线程池模型，而是事件驱动 + 非阻塞 IO 模式：它能在一个或少数几个线程/进程中保持成千上万的并发 socket 连接而不用为每个连接创建一个线程。核心依赖 Linux 的 epoll/kqueue 等机制。  

**多线程/多路复用相关**

| 层级     | 并发处理模型                       |
| -------- | ---------------------------------- |
| 浏览器   | 多个 TCP 连接，多路复用 Keep-Alive |
| Nginx    | Reactor 式事件循环 + 非阻塞 IO     |
| 网络内核 | epoll/kqueue 内核机制              |

因此，Nginx并不为每个请求创建线程，而是用一个事件循环去 demultiplex（判断哪个 socket 可读写）。这种模式适合 IO 密集场景，非常高效。Nginx 会将请求转发到后端（比如监听 8080 的 Tomcat），然后继续监听其它 socket。

**线程什么时候关闭？**
Nginx Worker 线程/进程常驻；

## 3. Web 容器（Tomcat/Jetty）
### Connection Accepting 接收请求
Tomcat/Jetty 在启动时会创建一个监听 socket，类似：
```java
ServerSocket.listen(port=8080)
```
这时候的连接队列（accept queue）会记录操作系统内核已经完成三次握手但未 accept 的连接。
Tomcat 的 Connector 逻辑会：  
1. 从 accept queue 中拉取新连接；
2. 检查有无空闲线程；
3. 分配对应线程处理请求。

Tomcat 并不是每次请求都创建一个线程，而是使用内部线程池（默认 ~200 个线程可配置）。  
线程池管理的好处是：避免频繁创建/销毁线程的高开销。  
### Tomcat Thread Pool：一个请求被分配给一个线程
当请求发送到 Tomcat 监听端口：  
1. Connector 接受 socket；  
2. 查看线程池：  
  * 有空闲线程 → 分配线程
  * 无空闲线程 → 放入 accept 队列/挂起
3. 线程开始执行这个请求
这个线程生命周期大致如下：
```text
 idle thread -> assigned to request -> invoke filter/servlet -> service(request) -> return to pool
```
Tomcat 默认线程池配置示例：  
```properties
server.tomcat.max-threads=200
server.tomcat.accept-count=100
```
当请求数 > 200 时：  
* 多余的请求会进入 accept 队列等待；
* 达到 max queue 时，Tomcat 返回 503（服务不可用）对客户端。

**注意**：线程负责处理整个请求直到响应，并在完成后归还线程池；不会为每个请求创建新线程。这是典型的线程复用机制。
**Tomcat 线程池配置**
你可以根据负载调整：  
```properties
server.tomcat.max-threads=500
server.tomcat.accept-count=200
```
这可以让 Tomcat 支持更多并发请求。在高并发下请求的线程数由线程池控制，而不是无限增长。  
**线程什么时候关闭？**  
Tomcat 线程池在服务器关闭时统一销毁  
**如何区分请求？**  
每个请求在 Tomcat 层都会被分配一个线程（从线程池中取出）。线程名类似：
```text
http-nio-8080-exec-1
http-nio-8080-exec-2
```
这是线程池内的不同线程对象，每次调度可以复用。你无需区分它们，只需关注代码是否线程安全。

## 4. Spring DispatcherServlet & Controller（单例 + 多线程）
Spring MVC 的请求执行流程如下：  
```text
Tomcat Thread -> DispatcherServlet -> HandlerMapping -> Controller -> Service/Repo -> Response
```
**多线程在 Spring 层是如何体现？**

| Spring 组件             | 是否线程安全                         |
| ----------------------- | ------------------------------------ |
| Spring Bean（默认单例） | 线程共享                             |
| Controller              | 默认单例，需要自己避免状态被线程污染 |
| Service                 | 默认单例，同上                       |
| Repository              | 默认无状态，可以安全调用             |
| RequestScope Bean       | 每线程独立                           |

默认情况下，Spring Bean 是单例（singleton）: 只有一个 Bean 实例驻留在容器中。但这并不是说 Spring 会为每个请求复制 Bean。多个请求会共享同一个 Controller/Service Bean 的实例。

**如何保证线程安全？**
单例 Bean 的状态通常不包含请求级数据，而是：
* 接收参数通过方法参数传输；
* 不存储可变共享状态；
* 若需要线程隔离，则可以用：
  * ThreadLocal
  * synchronized
  * 并发安全集合
  * RequestScope Bean

Spring 不会自动将你的单例 Bean 变成线程隔离副本；这是由你在编码时保证的。如果你在单例 Bean 中持有可变字段并对其进行修改，则多个线程同时访问会导致竞态条件。

**线程什么时候关闭？**
Thread 池线程并不会因每个请求而退出；反而复用更能节省资源。

## 5. 与 PostgreSQL 交互（连接池 + 多线程）
在 Spring Boot 应用中访问数据库通常不会直接建立新的连接，而是使用连接池（如 HikariCP）：  
```java
spring.datasource.hikari.maximum-pool-size=10
```
这样：  
* 每个并发线程执行查询时，都从连接池获取一个 DB 连接；
* 使用完毕后归还连接池；
* 连接池控制最大并发 DB 连接数。

这种模式解决了传统每次操作都创建一个连接的性能瓶颈。如果请求线程多于连接池数量，则它们会等待连接可用。数据库层处理锁、事务等机制保证数据一致性。

**线程安全与数据库事务**
数据库数据不会互相影响，是由：
* 每个请求由独立线程执行
* 通过提交/回滚事务管理并发修改
* 数据库锁机制 + ACID 保障一致性

Spring 通过 `@Transactional` 管理事务：  
* 所有对 DB 的更改要在事务隔离下执行
* 锁和隔离级别保证并发安全

**数据库连接池配置**
```properties
spring.datasource.hikari.maximum-pool-size=20
```
如果一个请求线程无法获得连接，它就会阻塞直至连接可用。

## 多线程协作（逐层）
```text
Browser (多个 TCP connections)
    |
    | nginx (事件驱动、非阻塞)
    V
Tomcat Connector (监听 socket + accept queue) 
    |
    | ThreadPool (work threads)
    V
Spring DispatcherServlet (Controller/Service singleton beans)
    |
    | Connection Pool → PostgreSQL
    V
DB Query Execution
```

## 结论

| 层级       | 并发机制                      | 线程模型           |
| ---------- | ----------------------------- | ------------------ |
| 浏览器     | 浏览器并发连接 + TCP 多路复用 | 内核/浏览器        |
| Nginx      | Reactor 式事件 + 非阻塞       | 少量事件循环线程   |
| Tomcat     | 线程池（Worker Threads）      | 线程池隔离每个请求 |
| Spring     | 单例 Beans + 多线程调用       | 线程安全由业务保证 |
| PostgreSQL | 连接池 + 事务隔离             | 连接复用 + 锁      |


