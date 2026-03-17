---
title: Fastify 模块化项目实战(三) — 使用 prisma
date: 2026-03-04
tags: [Fastify, Typescript, ESM, 数据库]
categories: [技术开发, 工程实践]
---

在搭建模块的时候, 与数据库进行交互是很常见的场景; 因为如果你的模块是与业务相关, 那么存储用户数据是重要的一环; 虽然openclaw的memory策略很聪明, 用md文件进行存储; 然而大部分的系统, 关系型数据库依然是非常趁手的工具;  
对于使用TypeScript的项目来说，Prisma已经成为最受欢迎的ORM方案之一:
* 在 npm 上下载量位居 ORM 之首（社区广泛采纳）
* 被现代全栈框架与平台作为默认或推荐的数据层工具（生态认可）
* 在开发者调查中具有高认知与高留存率（实际使用率高）
* 与 TypeScript 有深度契合，提供真正的类型安全（开发体验显著提高
  
所以当我需要和 Fastify 这样的高性能 HTTP 框架搭配使用时, 果然抛弃了supabase平台, 转战了prisma。当然抛弃supabase的更重要的原因是模块已经是后端系统, 不再特别依赖BaaS平台的产品了; 这篇文章主要介绍Prisma的相关特性;  

## 什么是 Prisma ORM
[Prisma](https://www.prisma.io/docs) 是一个现代ORM(对象关系映射)工具集，它通过一个声明式的 schema 文件和自动生成客户端的方式来与数据库交互。Prisma支持PostgreSQL、MySQL、SQLite、SQL Server 等主流关系数据库。它生成的客户端是完全类型安全的TypeScript API，不需要你手写类型定义。
Prisma 的核心组件包括：  
* Prisma Schema：一个声明式 DSL，用于定义数据模型
* Prisma Client：自动生成的类型安全查询客户端
* Prisma Migrate：数据库迁移工具
* Prisma Studio：可视化数据库浏览器

### Prisma 的显著优势
#### 类型安全（首要优势）  
Prisma 的最大亮点是它与 TypeScript 的深度集成。无论是查询参数还是返回数据类型，都由生成的 Prisma Client 自动推断，无需手动写接口或类型定义。  
```ts
const user = await prismaClient.user.findUnique({ where: { email: 'tui@lower-fat.io' } })
// user 类型是 { id: bigint, email: string, ... }
```
#### 声明式数据建模  
通过 `schema.prisma` 文件定义模型可以一眼看出数据库结构：
```ts
model User {
  id              BigInt   @id
  email           String   @unique
  name            String
  hashed_password String
  status          String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```
Prisma 会自动根据schema定义的model生成对应的SQL语句, 例如以下是自动生成的语句:  

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```
#### 自动迁移与版本控制  
Prisma Migrate 可以根据 schema 变化自动生成 SQL 迁移脚本，并将它们纳入版本控制，减少手动维护成本, 这就像使用类似flyway等工具, 能将数据库表的每一次改动都能够记录起来, 像 git commits管理代码历史一般, prisma migrate管理sql的变化历史;
#### 与 Fastify / Node.js 深度集成  
Prisma Client 可以无缝用于 Fastify 路由处理器中查询数据库，无需手动映射任何类型或装饰器。但你希望用插件管理也完成可以, 目前fastify的项目还没有官方的fastify-prisma库, 不过有一些开源的第三方库;

## Prisma 与 Fastify 集成的常用命令
官方文档写的非常详细: [官网](https://www.prisma.io/docs/prisma-postgres/quickstart/prisma-orm)
### 安装依赖  
来自上面的官网:  
```bash
npm install prisma @types/node --save-dev
npm install @prisma/client @prisma/adapter-pg dotenv
```

### 初始化 Prisma
来自上面的官网:  
```bash
npx prisma init --db
```
这会创建：
* `prisma/schema.prisma`
* `.env` (包含`DATABASE_URL`)
* 生成的代码 (/generated/prisma)
* 会把`/generated/prisma`放入.gitignore
### 修改 Prisma Schema
`prisma/schema.prisma` 示例：

```ts
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js",
  output   = "../src/modules/user/generated/prisma"
}

model Post {
  id      Int    @id
  title   String
  content String
}
```
注: Prisma 7.x 及以上版本已经不会再把URL定义到`datasource db`里面了, 网上的例子基本上全都是有url的, 但是如果你的prisma版本是7.x, 记得不要添加了

另外, output的路径是可以修改的, 如果你的项目有多个不同的模块, 它们彼此独立, 那么可以创建多个prisma client, 类似:  
```ts
generator userClient {
  provider = "prisma-client"
  output   = "../src/modules/user/generated/prisma"
}

generator postClient {
  provider = "prisma-client"
  output   = "../src/modules/post/generated/prisma"
}
```
记得都把它们加到.gitignore里面, 这是官方建议的, 接着在workflow里通过prisma generate自动生成, 这样的优点是跨平台
### 生成 Prisma Client

```bash
npx prisma generate
```
每次 schema 改动后都要运行此命令更新客户端。执行完之后会生成以下代码:  
![prisma-generated-outputs](generated-code-from-prisma-generated.png)

### 运行数据库迁移
```bash
npx prisma migrate dev --name init
```
一般这是你初始化migrations文件夹的第一步, 这会创建并执行 SQL 迁移。 执行完之后的效果如下:  

```text
prisma/
├── migration_lock.toml
└── migrations/
    └── 20260302093302_init/
        └── migration.sql
```

更多命令请见[官网的介绍](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#connections-created-per-cli-command). 
![official-image](official-cli-image.png)

### 在 Fastify 插件中管理 Prisma 实例
优雅管理 Prisma 生命周期：  
```ts
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client'

declare module 'fastify' {
  interface FastifyInstance {
    prismaClient: PrismaClient
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const connectionString = `${fastify.config.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({
    adapter,
    log: ['error']
  })

  fastify.decorate('prismaClient', prisma)
  fastify.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
}, {
  name: 'prisma-client'
})
```
这允许你在所有路由中通过 `fastify.prismaClient` 访问数据库。

### 在 package.json 的scripts中配置 DATABASE_URL
一般情况下官网推荐你通过npx执行prisma的命令, 好处是本地不需要安装prisma, 不过一般容易让人忽视的问题是指定DATABSE_URL, 如果你连接的是本地的数据库, 那么可以使用:  
```js
DATABASE_URL="postgresql://{your-db-user-name}:{your-db-password}@localhost:5432/{your-db-name}?schema=public" npx prisma db seed
```
类似上面的命令, 否则会默认连接到远端的host: `db.prisma.io:5432`. 
你也可以在package.json的scripts加入:  
```json
"migrate:dev": "cross-env POSTGRES_HOST=localhost prisma migrate dev --skip-seed",
"migrate:prod": "prisma generate && prisma migrate deploy",
"migrate:reset": "cross-env POSTGRES_HOST=localhost prisma migrate reset --skip-seed",
"studio": "cross-env POSTGRES_HOST=localhost prisma studio",
"seed:dev": "cross-env POSTGRES_HOST=localhost prisma db seed -- --environment development",
"seed:prod": "prisma db seed -- --environment production",
```

## 常见问题与解决思路
Prisma 即便强大，在实际开发中也会碰到一些问题。

### Schema 大时类型生成缓慢或编辑器卡顿  
随着模型数量增多，Prisma 生成的客户端类型可能非常庞大，导致 IDE 自动补全和 TypeScript server 卡顿。

**思路：**
* 分模块提升开发体验
* 限制导入范围，避免单文件过大

同时注意性能基准在某些情况下显示 ORM 性能不如其他库，但优势仍然是类型安全和开发体验。
### 在 Serverless（Lambda）环境下连接问题
在 serverless 环境中 Prisma 会对连接数管理不太友好，可能导致连接泄漏。  
**思路：**  
* 在全局作用域缓存 PrismaClient
* 使用连接池中间件如 PgBouncer
### 复杂联表查询难以优化
Prisma 支持的查询方式和关系包括 `include` 和 `select`，但对某些复杂 JOIN 的表达不如 SQL 自由。  
**思路：**
* 对复杂查询使用 `prisma.$queryRaw` 编写原生 SQL
* 对性能敏感的查询进行手动优化
### 连接超时或数据库错误
Prisma 的数据库连接出错时可能抛出如 P1001 类错误。
**思路：**
* 确保 `DATABASE_URL` 设置正确
* 调整数据库连接池配置
* 使用错误重试机制

## 小结
在 Fastify + TypeScript 技术栈中使用 Prisma 有以下明显好处：  
* 完全类型安全：Prisma Client 自动生成类型，让开发体验一流。
* 简洁且强大的数据建模：无需手写接口与类型定义，schema 与代码同步。
* 自动迁移：Prisma Migrate 自动化管理数据库版本。
* 与 Fastify 无缝集成：可通过插件模式管理生命周期。

当然，Prisma 并非在所有场景都完美，有时候对于极其复杂查询或 serverless 用例需要额外优化或 fallback 原生 SQL。但总体而言，它极大提升了TypeScript开发体验与安全性，是构建高质量 Node.js API 服务的不错选择。
