---
title: "API 设计实践"
layout: post
categories: 软件工程
date: "2022-02-02"
guid: urn:uuid:67ab0267-0906-4f8e-aea9-4e15c296d213
tags:
  - api
---
  
给系统设计一套 API 不是一件简单的事情。 原则是否能被所有人真正理解， 是否能准确通过 API 来表达对资源的正确处理都是学习的目的。 

### 设计 API 的简单原则
* 一致性  
* 显而易见性  
* 可组合性  
* 自解释  
* 可进化性

#### 一致性
在 API 中使用一致的术语。 例如， 统一使用驼峰， 或者统一使用蛇形命名  

#### 显而易见性
* 为空值仍然返回 JSON 的 key，而不是从 payload 中直接移除 key
* 对于创建(create)和删除(delete)操作， 在请求结果仍然显示相关的资源信息，以便开发人员可以在创建和删除后仍能看到完整的资源
* 在分页的情况下，发送 `totalCount`、`nextPage`、`previousPage`

#### 可组合性
* API 不应绑定到任何特定的 workflow
* 故事是由 API 驱动， 而非由 workflow 驱动
* 将 workflow 保留在用户旅程中而不是 API 中
* API 不应该是数据库表结构的特定映射

#### 自解释
* API 应该可以在没有编写 API 的团队干预的情况下使用
* 规范和文档是 first-class 的实体，任何想要使用 API 的人都应该可以访问。 它们应该在发布之前进行测试（或至少手动验证）

#### 可进化性
* 规格变更应受监管
* 应该能够添加新字段（关闭严格反序列化）
* 尽可能设计通用的 URI 和响应格式（例如，代替 `homePhoneNumber`，使用 `phoneNumber: { type=”home” }`）

### 资源的命名
#### 集合：使用复数名词， 不包含唯一标识符
*  GET: 用于过滤、搜索、排序和分页。 对多个结果使用查询参数  
例如： 查询字符串 - 用于非资源属性 - `?sort=name?page=1?format=json`  
*  POST: 用于创建集合的新成员  
*  PUT 和 DELETE: 很少用于处理集合。 通常用于更新集合而非更新集合中的个体  

#### 单一资源：使用标识符（* 不要使用主键/递增数值）
*  GET:返回指定的资源    
*  PUT: 更新指定的资源。 并发控制以避免同时更新  
*  PATCH: 使用更改更新资源  
*  DELETE: 删除指定的资源  

_Notes:_  
使用唯一标识符 - 不必是主键。 保证它们独特且可读即可  

#### 嵌套资源
* 在父单一资源下可单独寻址的资源。 例如：用户的订单 - `users/1/orders`  
* 尽量避免嵌套超过 2 层（可组合性）
* 嵌套资源既作为嵌套集合存在，也作为嵌套单一资源存在

#### 具化的资源
具体化是将抽象概念具体化的行为（关注意图，而不是实体）， 这有时在 `RESTful` 建模中很有用。  
与简单的 CRUD 操作相反，具体化的资源通常代表更改的意图。 因此，他们倾向于避免使用 PUT 来支持对某些用户操作进行建模的不可变资源。  

#### 非资源的 endpoints
可能有一些考虑迫使我们设计一个非资源性的 endpoint。 例如，您可能决定支持将信用卡搜索作为 POST 而不是 GET， 因为我们希望将信用卡号从 URL 中移除。  
在这种情况下，我们显然是有意打破了 REST 的统一接口架构约束。  
为了清楚地表明这是有意的，我们应该在路径上放置一个动词，将其标记为 RPC 而不是 RESTful  

| Name     | Example              |
| -------- | -------------------- |
| 集合     | /orders              |
| 单一资源 | /orders/1            |
| 嵌套资源 | /orders/1/product    |
| 具化资源 | /registrationRequest |
| 非资源型 | /creditCards/search  |

### 其它
* 避免使用动词。 REST 已经为您提供了动词。
* GET、 PUT 和 DELETE 应该是幂等的。 任何与输入请求有关的具有不确定结果的操作都应建模为 POST。 例如; PUT 应该总是返回，好像有什么改变了。 不应返回“未检测到更改”
* 此外，GET 被定义为“安全”的，这意味着它不应影响服务器的状态。 GET 请求应该是可缓存的。
* 如果不保证幂等性的 POST 操作需要幂等性，客户端可以传递带有客户端生成的 guid 的 Idempotency-Key 标头。 服务器可以确保只处理一条消息。
* 不要让你的 API 变得啰嗦（细粒度与粗粒度）。 例如：单独的 POST 以添加喜欢、评论、标签等

### API 版本化
* `/api/v1/`  
_pros:_  
在 api URL 中清晰地进行版本控制  
_cons:_   
每次版本更改时，client 都需要更改 URL  

* `?v=1.0`  
_pros:_  
可选择是否使用包含版本控制的 API（可以使用默认版本）  
_cons:_  
client 太容易错过需要该版本  

* In headers: `X-Version: 1.0`  
_pros:_   
将版本控制与 API 的其余部分分开  
_cons:_
维护 headers  

* Accept Header: `Accept: version=1.0`  
_pros:_   
无需创建自己的自定义标题  
_cons:_   
比 `query` 更不容易被发现  

* 使用 `Content Type` 进行版本控制: `content-type: application/<custom content type>`  
_pros:_  
version payload 和 API 本身一样具有意义  
_cons:_  
需要更多的开发人员成熟度  

虽然 API 设计的最终目标是无版本化，但在日常开发中仍然要有计划的使用版本:  
* 将版本放在 URL 中: 允许您在浏览器中打开它, 通过电子邮件发送它, 添加书签。 在日志中也能清晰可见
* 仅使用主要版本: API 使用者应该只关心重大更改。
* 使用数字类型的版本号：不是像日期这样对消费者来说不重要的其他信息
* 版本是必选项：否则为了向后兼容还必须支持未版本化的 URL。

### API 认证
* Cookies  
  * 简单， 不是很安全  

* Basic Auth
  * 易于实施
  * 除非使用 SSL，否则不安全
  * 在每个请求中发送凭据

* Token Based Auth
  * 简单安全
  * 行业标准令牌 - 5 到 20 分钟后到期
  * 通常使用 JWT（JSON Web Tokens）

* OAuth
  * 第三方认证
  * 使用请求令牌和访问令牌

### API 网关
* 尽量减少内置的冗余功能， 例如 API 生命周期管理
* 当有跨越团队边界时， 通过网关进行 service-to-service call

| 能力                | 一般倾向于我们是否应该使用 api 网关执行此操作 ? |
| ------------------- | ----------------------------------------------- |
| 截流 & 定量         | 是                                              |
| 跟踪记录 API 活跃度 | 是                                              |
| API 生命周期管理    | 是                                              |
| 认证                | 也许                                            |
| 缓存                | 也许                                            |
| 公布 API 文档       | 也许                                            |
| 负载均衡            | 也许                                            |
| 服务发现            | 也许                                            |
| service mocks       | 也许                                            |
| API 编写            | 否                                              |
| 数据转化            | 否                                              |
| 细粒度权限          | 否                                              |

### API 管理
* 最佳实践  
  * 规范驱动开发允许消费者在完全开发之前开始试验 API
  * 通过测试平台使用 API 规范，例如提供 API 调用存根实现的托管 OpenAPI 文件

* 如何提供 API 规范
  * 单独的规范文件
  * 内联规范

* 工具
  * OpenAPI
  * API 蓝图
  * RAML

### API 文档
* 根据规范自动生成文档
* 包括示例请求/响应
* 支持多个版本
* 支持自定义
* 支持 stub 响应
* 安全访问（文档和 API）
* 使文档保持最新（将文档作为部署管道的一部分发布 - Dredd 工具）
* 在文档旁边包含 SLO（服务水平目标）

### 工具
* Gelato (closely tied to Kong)
* Readme.io -Generates API documentation by parsing a hosted Swagger file
* Stoplight - handles integration with Auth0
* Swagger Hub
* Swagger-UI
* Apiary - Provides easy configuration of server mocks to prototype APIs
* API portal (Mulesoft)
* SmartDocs
* Swagger Editor
* API Studio

### API Mocks
* 规范驱动开发
* 先暴露 mock endpoints
* 消费者驱动契约测试
* 使用 mountebank 等工具针对不提供 mock endpoints 的 API 进行测试
* 工具
  * mountebank
  * sandbox

### 其它
* 分页
  * 在 API URL 中使用 page number 和 page limit
* 使用 `E-Tags` 进行缓存
  * 并发
  * 使用标头 If-Match 和 If-No-Match
  * 在请求中发送 If-Match 中的 E-Tag。 如果服务器上的标签匹配，则将进行更改。 否则，将返回错误代码
* Functional API - （非 RESTful 的 Operational API）
  * 例如：重启机器，重新计算总价，计算税务
  * 不是构建 RPC API 的理由
  * 文档化
  * 可以使用其他 REST 动词，例如 OPTIONS、HEAD、LINK
* 异步 API
  * 非 REST 解决方案很有用 - Comet、gRPC、SignalR、Firebase、Socket.IO 等。

