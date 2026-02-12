---
title: Fastify 模块化项目实战(一)
date: 2026-02-12
tags: [Fastify, Typescript, ESM]
---

## 为什么选择 Fastify 而非 NestJS, ExpressJS, Koa?
按照我的个人经验, 之前使用 ExpressJS 来搭建项目, 项目结构基本如下所示:

```txt
src/
└───── infrastructures/
    │   ├── db.js
    │   └── server.js
    │
    ├── middlewares/
    │   └── authMiddleware.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   └── messageRoutes.js
    │
    └── services/
        ├── messagesService.js
        ├── userService.js
        └── authService.js
```
这次在构思模块化项目的时候, 想尝试一些新东西, 能够满足我的封装性高的需求, 首先对比了 NestJS 和 ExpressJS

| 对比项              | **NestJS**                                    | **ExpressJS**                    |
| ------------------- | --------------------------------------------- | -------------------------------- |
| **定位**            | 进阶型全栈后端框架                            | 轻量级 Web 框架                  |
| **架构风格**        | 强制 MVC + 模块化 + DI（受 Angular 启发）     | 无架构规范，自由度高             |
| **学习成本**        | 🟠 中等偏高（需要理解装饰器/依赖注入）         | 🟢 低（API 简洁易用）             |
| **TypeScript 支持** | 原生支持，强类型优先                          | 需要手动配置 TS                  |
| **依赖注入（DI）**  | 内置支持                                      | 无（通常用单例/全局或自定义 DI） |
| **路由定义**        | 注解式控制                                    | 手动配置路由                     |
| **扩展性**          | ⭐⭐⭐⭐                                          | ⭐⭐                               |
| **生态和插件**      | 模块化（Auth、Cache、Swagger、GraphQL、Jobs） | 需要自行组合中间件               |
| **适合场景**        | 企业级复杂业务、大团队合作                    | 小项目、快速原型、灵活业务流程   |
| **性能**            | 接近 Express                                  | 基于 Express / Fastify，性能优秀 |
| **社区 & 文档**     | 成熟活跃                                      | 经典稳定                         |

在这之后又了解了 Fastify 和 Koa 框架:  
**Fastify**
* 性能比 Express 更高
* 插件机制
* 原生支持超快 JSON 序列化
* 适合高性能 API 服务
* 学习成本略高于 Express

**Koa**
* 由 Express 核心团队打造
* Promise + async/await 原生支持
* 更现代、更轻量
* 中间件采用新版洋葱模型

然而 Fastify 的高性能以及插件机制吸引了我, 于是我打算基于 Fastify 开始搭建项目

## 开始搭建 Fastify 项目之前需要考虑的三件事
### 选择JS还是TS?
| 维度             | JS     | TS         |
| ---------------- | ------ | ---------- |
| 学习成本         | 低     | 中         |
| 开发速度（短期） | 快     | 稍慢       |
| 维护成本（长期） | 高     | 低         |
| 重构安全性       | 低     | 高         |
| 模块扩展能力     | 中     | 高         |
| 工程化能力       | 中     | 极高       |
| 架构演进能力     | 弱     | 强         |
| 模板复用价值     | 低     | 高         |
| 项目规模适配     | 小项目 | 中大型项目 |
| 技术资产价值     | 低     | 高         |

对于复用价值来说, 选择TS是必须的

### 选择Common JS 还是 ES Module?
我们都知道JS有两种模块系统
> ES Modules (ESM) 是 ECMAScript 标准化的现代 JavaScript 模块系统，使用 import/export，支持静态分析、异步加载和单例模式，适用于浏览器和新版 Node.js。CommonJS (CJS) 是 Node.js 传统的默认系统，使用 require/module.exports，同步加载模块，主要用于服务器端。 

所以它们之间的本质区别是底层机制的差异:
CSJ是运行时加载
```txt
require() 是函数
→ 运行到这行才加载
→ 动态加载
→ 无法静态分析依赖关系
```
而ESJ（编译期静态分析）
```txt
import 是语法
→ 编译期分析依赖
→ 构建依赖图
→ 支持 Tree-shaking
→ 支持模块优化
```

在语法层面:  
CommonJS:  
```js
// 导入
const fs = require('fs')

// 导出
module.exports = {
  test() {}
}
```
ES Module:  
```js
// 导入
import fs from 'fs'

// 导出
export function test() {}
export default {}
```

于是我选择了ESM来搭建项目模块, 这也是当下的工程趋势

### 选择Node原生测试框架还是其它?
谈到JS测试框架, 立马能想到 Jest, Vitest, Mocha, Chai, 在JS生态里, 一般在前端会测试组件渲染, 在后端是一些简单的断言, 例如测试 Rest API 的请求, 工具库的单元测试等, 接触了 Fastify 我了解到了 Node 原生测试方法.  

| 能力     | Jest           | Vitest   | node:test |
| -------- | -------------- | -------- | --------- |
| Runner   | ✅              | ✅        | ✅         |
| Mock     | ✅ 强           | ✅ 强     | ⚠️ 基础    |
| 覆盖率   | ✅              | ✅        | ⚠️ 外接    |
| Watch    | ✅              | ✅        | ❌         |
| 快照测试 | ✅              | ✅        | ❌         |
| 并发执行 | ⚠️              | ✅        | ✅         |
| ESM 支持 | ⚠️ 配置复杂     | ✅ 原生   | ✅ 原生    |
| TS 支持  | ⚠️ 依赖 ts-jest | ✅ 原生   | ⚠️ 手动    |
| 生态插件 | ✅ 非常成熟     | 🟡 成长中 | ❌ 几乎无  |

举几个简单的例子吧, 在 vitest 里:  
前端的测试:  
```js
// 使用 vitest 的方法
import { describe, expect, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import App from "../../src/components/App"

// 通过 vi.hoisted 来 mock 方法
const { mockGetNotes, mockDeleteNote, mockPutNote } = vi.hoisted(() => {
  return { mockGetNotes: vi.fn(), mockDeleteNote: vi.fn(), mockPutNote: vi.fn() }
})

// 使用上面的mock方法来替换后端的具体方法
vi.mock('../../src/services/notesService', () => {
  return {
    default: { getNotes: mockGetNotes, deleteNote: mockDeleteNote, putNote: mockPutNote }
  }
})

describe("render app", () => {
  it("should show notes successfully", async () => {
    //mock实现
    mockGetNotes.mockResolvedValue(["fake note1"])
    render(<App />)
    await waitFor(() => screen.getByText("fake note1"))

    expect(screen.getByText("fake note1")).toBeInTheDocument()
  })

  it("should delete note successfully when click delete note button", async () => {
    mockGetNotes.mockResolvedValue(["fake note1"])
    render(<App />)
    await waitFor(() => screen.getByText("fake note1"))

    const deleteNoteBtn = screen.getByTestId("delete-note")
    fireEvent.click(deleteNoteBtn)

    expect(mockDeleteNote).toHaveBeenCalled(1)
  })
})
```
后端的测试例子:  
```js
// vitest 的方法
import { beforeEach, describe, it, vi, expect } from "vitest"
import notesService from "../../src/services/notesService"

const mockSelect = vi.fn()
const mockInsert = vi.fn()
const mockDelete = vi.fn()
const mockEq = vi.fn()

// mock 基础设施(DB)的 client 的相关方法
const { supabaseMockClient } = vi.hoisted(() => {
  return {
    supabaseMockClient: {
      from: vi.fn(() => ({
        select: mockSelect,
        insert: mockInsert,
        delete: vi.fn(() => ({
          eq: mockEq
        })),
      }))
    }
  }
})

// 替换外部依赖的具体方法为mock方法
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => supabaseMockClient),
}))

describe("notes service layer tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return notes array", async () => {
    mockSelect.mockResolvedValue({ data: [{ note: 'note1' }, { note: 'note2' }], error: null })

    const result = await notesService.getNotes()

    expect(supabaseMockClient.from).toHaveBeenCalledWith('notes-online')
    expect(supabaseMockClient.from().select).toHaveBeenCalledWith('note')
    expect(result).toEqual(['note1', 'note2'])
  })

  it("should return empty array when return error", async () => {
    mockSelect.mockResolvedValue({ data: null, error: "some errors" })

    const result = await notesService.getNotes()

    expect(result).toEqual([])
  })

  it("should save note successfully", async () => {
    mockInsert.mockResolvedValue()

    await notesService.putNote("new fake note")

    expect(supabaseMockClient.from).toHaveBeenCalledWith('notes-online')
    expect(supabaseMockClient.from().insert).toHaveBeenCalledWith({ note: "new fake note", creator: "anonymous" }, { returning: 'minimal' })
  })

  it("should delete note successfully", async () => {
    mockDelete.mockResolvedValue()
    mockEq.mockResolvedValue()

    await notesService.deleteNote("fake note")

    expect(supabaseMockClient.from().delete().eq).toHaveBeenCalledWith('note', 'fake note')
  })
})
```

而最近使用了 node:test, 例如:  
```ts
import { describe, it } from 'node:test'
import assert from 'node:assert'
import { build, expectValidationError } from '../../../../helper.js'

describe('Security api', () => {
  describe('POST /api/v1/auth/login', () => {
    it('Transaction should rollback on error', async (t) => {
      const app = await build(t)

      const { mock: mockCompare } = t.mock.method(app.passwordManager, 'compare')
      mockCompare.mockImplementationOnce((value: string, hash: string) => {
        throw new Error('Kaboom!')
      })

      const { mock: mockLogError } = t.mock.method(app.log, 'error')

      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/login',
        payload: {
          email: 'basic@example.com',
          password: 'Password123$'
        }
      })

      assert.strictEqual(mockCompare.callCount(), 1)

      const arg = mockLogError.calls[0].arguments[0] as unknown as {
        err: Error;
      }

      assert.strictEqual(res.statusCode, 500)
      assert.deepStrictEqual(arg.err.message, 'Kaboom!')
    })
})
```
使用之后也很顺手, 一个是没有外部依赖, 另外也能满足需求, 所以目前我也并未使用其它测试框架.

## 开始搭建Fastify项目
TBC