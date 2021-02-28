---
title: "[NodeJS] 浅淡 ETIMEDOUT & ESOCKETTIMEDOUT & Socket hang up"
layout: post
categories: nodejs
date: "2019-08-21"
guid: urn:uuid:5446ab04-a3bb-4435-9ca6-845b3b807c25
tags:
  - nodejs
---

### 背景
当线上服务正常运行了一段时间, 应用的请求量的呈线性增长姿势的时候, 我们发现日志里多了三种错误日志. 类型分别为 `ETIMEDOUT`, `ESOCKETTIMEDOUT` 和 `Socket hang up`, 由于我个人对于这三种错误的认知极其有限，于是想要借此机会整理思绪.

### 错误事例
**ETIMEDOUT**
```javascript
RequestError: Error: ETIMEDOUT
    at new RequestError (/var/task/node_modules/request-promise-core/lib/errors.js:14:15)
    at Request.plumbing.callback (/var/task/node_modules/request-promise-core/lib/plumbing.js:87:29)
    at Request.RP$callback [as _callback] (/var/task/node_modules/request-promise-core/lib/plumbing.js:46:31)
    at self.callback (/var/task/node_modules/request/request.js:185:22)
    at Request.emit (events.js:198:13)
    at Request.EventEmitter.emit (domain.js:448:20)
    at Timeout.<anonymous> (/var/task/node_modules/request/request.js:852:16)
    at Timeout._onTimeout (/var/task/node_modules/async-listener/glue.js:188:31)
    at ontimeout (timers.js:436:11)
    at tryOnTimeout (timers.js:300:5)
    at listOnTimeout (timers.js:263:5)
    at Timer.processTimers (timers.js:223:10)
``` 
**ESOCKETTIMEDOUT**
```javascript
RequestError: Error: ESOCKETTIMEDOUT
    at new RequestError (/var/task/node_modules/request-promise-core/lib/errors.js:14:15)
    at Request.plumbing.callback (/var/task/node_modules/request-promise-core/lib/plumbing.js:87:29)
    at Request.RP$callback [as _callback] (/var/task/node_modules/request-promise-core/lib/plumbing.js:46:31)
    at self.callback (/var/task/node_modules/request/request.js:185:22)
    at Request.emit (events.js:198:13)
    at Request.EventEmitter.emit (domain.js:448:20)
    at ClientRequest.<anonymous> (/var/task/node_modules/request/request.js:819:16)
    at Object.onceWrapper (events.js:286:20)
    at ClientRequest.emit (events.js:198:13)
    at ClientRequest.EventEmitter.emit (domain.js:448:20)
    at TLSSocket.emitRequestTimeout (_http_client.js:662:40)
    at Object.onceWrapper (events.js:286:20)
    at TLSSocket.emit (events.js:198:13)
    at TLSSocket.EventEmitter.emit (domain.js:448:20)
    at TLSSocket.Socket._onTimeout (net.js:442:8)
    at ontimeout (timers.js:436:11)
    at tryOnTimeout (timers.js:300:5)
    at listOnTimeout (timers.js:263:5)
    at Timer.processTimers (timers.js:223:10)
```
**Socket hang up**
```javascript
RequestError: Error: socket hang up
    at new RequestError (/var/task/node_modules/request-promise-core/lib/errors.js:14:15)
    at Request.plumbing.callback (/var/task/node_modules/request-promise-core/lib/plumbing.js:87:29)
    at Request.RP$callback [as _callback] (/var/task/node_modules/request-promise-core/lib/plumbing.js:46:31)
    at self.callback (/var/task/node_modules/request/request.js:185:22)
    at Request.emit (events.js:198:13)
    at Request.EventEmitter.emit (domain.js:448:20)
    at Request.onRequestError (/var/task/node_modules/request/request.js:881:8)
    at ClientRequest.emit (events.js:203:15)
    at ClientRequest.EventEmitter.emit (domain.js:448:20)
    at TLSSocket.socketCloseListener (_http_client.js:364:11)
    at TLSSocket.emit (events.js:203:15)
    at TLSSocket.EventEmitter.emit (domain.js:448:20)
    at _handle.close (net.js:606:12)
    at TCP.done (_tls_wrap.js:388:7)
```

### 概念
其实这三种错误信息均来源于 Node.js, Node.js 底层使用了 [glibc库](http://www.gnu.org/software/libc/), ETIMEDOUT 错误是 glibc 库在 socket 连接时使用的 connect 函数中定义的错误类型. V8 引擎在 glibc 库时还会加入自定义的错误类型， 许多错误情况还是和 glibc 中的定义保持了一致.

connect 函数的定义为：int connect(int socket, struct sockaddr addr, socklen_t length)  
connect 函数会使用文件描述符 (file descripto). socket 表示 socket 发起连接，sockaddr 通过 addr 和 length 这两个参数来指定. (这个 socket 一般是其他机器的 socket，而且必须已经配置成了服务器)  
一般情况下, connect 函数会等待服务器响应请求才返回. 当然也可以将 socket 设置为非阻塞模式来不等待响应就快速返回 (可参考 nginx 是怎么使用 socket).  

connect 最初是作为多线程程序的取消点定义的, 因此开发者需要确保线程取消后释放了占用的资源 (例如内存、文件描述符、semaphore) 等.

关于 ETIMEDOUT 是连接尝试超时.
关于 ESOCKETTIMEDOUT 我的理解为, 如果服务器段的 socket 都处在忙碌状态, 无法分配出新的 socket, 请求新 socket 会一直处在 pending 状态, 于是会造成 timeout.  
关于 Socket hang up 错误, 当客户端等待请求的 response, 然而连接断开了. 于是会抛出该错误.


### Tips
### 错误类型
connect 函数正常的返回值为 0, 在有错误时会返回 -1. 函数中定义了如下错误条件:  

1. EBADF: sockt 不是有效的文件描述符 (file descriptor)
2. ENOTSOCK: 文件描述符 socket 不是 socket
3. EADDRNOTAVAIL: 指定的地址在远程机器上不可用
4. EAFNOSUPPORT: socket 不支持 addr 的命名空间
5. EISCONN: socket 已经连接
6. ETIMEDOUT: 连接尝试超时
7. ECONNREFUSED: 服务器主动拒绝建立连接
8. ENETUNREACH: 从本机到给定 addr 的网络不通
9. EADDRINUSE: 给定 addr 的 socket 地址已经在使用 (这种错误最常见, 我们有时候本地已经启动了一个 Node.js 程序, 再次启动会看到这个错误, 也就是端口号已经被占用了)
10. EINPROGRESS: socket 是非阻塞的, 连接不能立即建立. 可以使用 select 来确定连接完全建立的时间. 参考等待 I/O . 在连接完全建立前如果在相同的 socket 上调用 connect, 会以 EALREADY 失败.
11. EALREADY:: socket 是非阻塞的而且有一个挂起的连接 (参考上面的 EINPROGRESS)




