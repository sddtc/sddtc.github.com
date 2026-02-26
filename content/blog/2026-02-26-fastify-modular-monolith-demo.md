---
title: Fastify 模块化项目实战(二)
date: 2026-02-26
tags: [Fastify, Typescript, ESM]
---

## 开始搭建 Fastify 项目
Fastify最吸引我的特性有两个, 一个是高性能, 另一个就是“一切接插件”的理念, 插件的特点就是可拔插, 可快速替换, 快速集成等. 所以这篇文章会简单介绍如何利用这一特性来快速启动一个modular monolith项目.  
首先我们心里大概构思出项目结构, 如下所示:  

```txt
src/
├────── modules/
│       ├── module-a
│       │   ├──plugins
│       │   ├──routes
│       │   └──index.ts
│       ├── module-b
│       │   ├──plugins
│       │   ├──routes
│       ├── └──index.ts
|       │...other modules
├────── plugins      
├────── routes
└────── app.ts
```

其中:  
* module-a 可以是用户模块, 提供类似于 `/user/api/v1/profile`, `/user/api/v1/links` 等能力
* module-b 可以是支付模块, 提供类似于 `/payment/api/v1/wechat`, `/payment/api/alipay` 等能力
* plugins 是服务本身需要的插件, 可以来自于Fastify生态, 例如`cookies`, `swaggerui`, `rate-limit` 等, 也可以是自定义的utility插件和app插件等
* routes可以是服务暴露的基础api, 也可以作为aggregate存在来整合模块内部的api来提供能力
* app.ts专注于启动服务

关键点是模块需要以插件的方式封装并暴露出来.  

### 创建 app 并监听端口  
```ts
import Fastify from 'fastify'

const app = Fastify({
    logger: true
})

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`Server listening at ${address}`)
})
```

### 创建模块a  
#### 创建第一个api(`api-a.ts`):  

```ts
async function routes(fastify, options) {
    fastify.get('/hello-first', async (request, reply) => {
        return { hello: 'from a' }
    })
}

export default routes
```

#### 创建第二个api(`api-b.ts`):  

```ts
async function routes(fastify, options) {
    fastify.get('/hello-second', async (request, reply) => {
        return { hello: 'from another api in a' }
    })
}

export default routes
```

#### 整合多个API到index.ts中(可选)
如果创建多个职责单一的api, 并把它们放在一个文件夹下, 那么可以创建一个`index.ts`文件来整合模块下的所有api:  

```ts
import apiA from './api-a'
import apiASecond from './api-b'

async function routes(fastify, options) {
    fastify.register(apiA)
    fastify.register(apiASecond)
}

export default routes
```

### 注册到 app
```ts
import Fastify from 'fastify'
// import api-a and api-b from index file
import routes from './modules/a/routes/index'

const app = Fastify({
    logger: true
})

app.get('/', async (request, reply) => {
    return { hello: 'world' }
})

// register routes and add prefix with module name
app.register(routes, { prefix: '/a' })

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`Server listening at ${address}`)
})
```

`app.register` 可以注册模块暴露的路由, 并可以设置URL前缀, 以上配置完成之后, 你可以通过:  
* GET `localhost:3000/a/hello-first`
* GET `localhost:3000/a/hello-second`

来访问模块a的API, 其中localhost:3000是本地的默认配置, 你可以替换端口号为你自己指定的端口号.

### 使用 `@fastify/autoload` 并搭配 `prefix`  
如果你使用了`@fastify/autoload`, 那么以上示例代码中的`prefix`恐怕无法如你预期那样生效, 因为一些参数使用方式的不同:  

```ts
import path from 'node:path'
import fastifyAutoload from '@fastify/autoload'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

fastify.register(fastifyAutoload, {
  dir: path.join(import.meta.dirname, 'routes'),
  options: { ...opts, prefix: '/a' }
})
```

其中`routes`文件夹下放着所有的api接口文件, 在 app.ts 中注册模块如下所示:  

```ts
import Fastify from 'fastify'
import fp from 'fastify-plugin'

import moduleARoutes from './modules/a/index.js'

// ...
app.register(fp(moduleARoutes))

// ...
```

可以看到一旦模块化, 项目将具有很强的可扩展性, 能够展现出高内聚性和低耦合性, 对于模块的测试也更加的可控, 拥有清晰的边界.