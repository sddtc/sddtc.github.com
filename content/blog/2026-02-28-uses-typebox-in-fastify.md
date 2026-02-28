---
title: Fastify + TypeScript 中的 typebox
date: 2026-02-28
tags: [Fastify, Typescript, ESM, typebox]
---

## @sinclair/typebox
`@sinclair/typebox`（也常简称为 `TypeBox`）是一个用于构建 JSON Schema 的库，同时能将这些 Schema 映射成 TypeScript 类型。这意味着你可以利用同一套定义既做静态类型检查，又做运行时验证（与 AJV 等库配合统一类型与 schema)。 
它在 Fastify 社区非常流行，Fastify 使用 JSON Schema 来验证请求/响应，而 TypeBox 能把该 Schema 与 TS 类型无缝融合。

它的官方文档: [TypeBox Docs](https://sinclairzx81.github.io/typebox/#/docs)

## 我们为什么用 TypeBox？
传统 TS 类型只在编译阶段有效，而运行时 JS 不存在类型；而 JSON Schema 可用于运行时验证，但编写起来啰嗦、难维护。TypeBox 解决了这个矛盾：  
* 支持定义类型并导出 JSON Schema
* TypeScript 能从 Schema 自动推断类型
* 与 Fastify 等框架无缝集成

所以, TypeBox 特别适合在：  
* 使用 Fastify 做 API 服务，需要声明请求/响应 schema
* 想要统一 schema 和 TypeScript 的类型
* 使用 AJV 等验证器做运行时校验

## TypeBox 的主要用法
TypeBox最核心的两个导出要属`Type`和`Static`了：

```ts
import { Type, Static } from '@sinclair/typebox'
```

### Type: Schema 构造器

TypeBox 通过 `Type` 命名空间提供大量方法来构建 JSON Schema。每个方法都对应一个 TypeScript 类型。

**基本类型**:  
```ts
const A = Type.String()   // json schema: { type: 'string' }
const B = Type.Number()   // json schema: { type: 'number' }
const C = Type.Boolean()  // json schema: { type: 'boolean' }
```
这些定义不仅是 schema，还能在 TS 中映射真实类型。

### Static: 推断 TypeScript 类型

虽然 `Type.String()` 等返回的是 JSON Schema，但要拿到 TS 类型需要：

```ts
type T = Static<typeof A>  // 等价于: string
```

这样你用一个 Schema 定义，同时得到了运行时 Schema + 编译时TS类型。😉

### 常用方法
#### Type.Object: 定义对象结构
这是最常用的组织结构类型：  
```ts
const UserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' })
})

type User = Static<typeof UserSchema>
// => { name: string; email: string }
```

这种在 Fastify 中经常用于请求/响应 body schema
#### Type.Array: 定义数组
```ts
const NumList = Type.Array(Type.Number())
type List = Static<typeof NumList>  // number[]
```
#### 定义枚举 (Enum)
TypeBox 支持将 TypeScript 枚举纳入 schema：
```ts
enum Color {
  Red = 'red',
  Blue = 'blue'
}

const ColorSchema = Type.Enum(Color)
type C = Static<typeof ColorSchema> // "red" | "blue"
```
注：生成的 JSON Schema 只允许枚举值，不保留枚举键名。
#### Optional
```ts
const Person = Type.Object({
  name: Type.String(),
  age: Type.Optional(Type.Number())
})

type P = Static<typeof Person> // {name: string; age?: number}
```
#### Type.Literal：定义具体的常量值类型
`Type.Literal(value)` 用于定义一个字面量类型，即这个类型的值只能是某一个固定的具体值。
在 TS 里：  
```ts
type A = 'open'   // 只能是字面值 'open'
```
在 TypeBox 里用：  
```ts
const A = Type.Literal('open')
type TA = Static<typeof A>   // 等价于 TS: 'open'
```

对应生成的 JSON Schema 会是一个带有 `enum` 的 schema（只有这个值允许）。
#### Type.Union：构造多个类型的联合
`Type.Union([schema1, schema2, ...])` 表示一个值可以是这些 schema 中**任意一个**，等效于 TypeScript 中的联合类型（`|`）。  
在 TS 里：  
```ts
type AorB = 'a' | 'b'
```

在 TypeBox 里写法：  
```ts
const AorB = Type.Union([Type.Literal('a'), Type.Literal('b')])
type TAorB = Static<typeof AorB>  // 等价于 'a' | 'b'
```
联合不只是字面值，还可以是不同对象结构的联合。

#### Type.Union + Type.Literal 的常见组合模式
**简单联合（枚举值）**  
```ts
const Method = Type.Union([
  Type.Literal('GET'),
  Type.Literal('POST'),
  Type.Literal('PUT'),
  Type.Literal('DELETE'),
])

type HttpMethod = Static<typeof Method>  
// => 'GET' | 'POST' | 'PUT' | 'DELETE'
```
**对象联合**
假设我们想建一个用户角色类型：

```ts
const Admin = Type.Object({
  role: Type.Literal('admin'),
  level: Type.Number(),
})

const Guest = Type.Object({
  role: Type.Literal('guest'),
  visitorId: Type.String()
})

const UserType = Type.Union([Admin, Guest])

type UserTypeTS = Static<typeof UserType>
// => { role: 'admin'; level: number } | { role: 'guest'; visitorId: string }
```
这种方式的使用非常适合做API Body 的多种模式校验。

## 具体示例
在 Fastify 中，你可以把 TypeBox 定义的 schema 用到路由里：

```ts
import Fastify from 'fastify'
import { Type, Static } from '@sinclair/typebox'

const User = Type.Object({
  name: Type.String(),
  age: Type.Number()
})

type UserType = Static<typeof User>

const app = Fastify()

app.post<{Body: UserType}>('/user', {
  schema: {
    body: User
  }
}, (req, rep) => {
  const user = req.body
  rep.send(user)
})

app.listen({port: 3000})
```
其中:  
* `User` 是 JSON Schema
* `UserType` 是 TS 类型
* Fastify 用 schema 做验证输出类型安全。

## 与 TypeScript 的映射关系
在 TypeScript 中，我们通常写：
```ts
type X = { id: string; age?: number }
```
而在 TypeBox 里我们写：
```ts
const X = Type.Object({
  id: Type.String(),
  age: Type.Optional(Type.Number())
})

type XType = Static<typeof X>
```

映射逻辑是：  

| TypeBox 方法       | TypeScript 对应 |
| ------------------ | --------------- |
| Type.String()      | string          |
| Type.Number()      | number          |
| Type.Boolean()     | boolean         |
| Type.Object({...}) | 对象结构        |
| Type.Enum(...)     | 枚举值联合类型  |

这为 JSON Schema + TS 类型之间建立了一套可互相推导的桥梁。

以上