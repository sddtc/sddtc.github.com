---
title: Fastify 模块化项目实战 - 你真的懂 tsconfig.json 吗?
date: 2026-03-16
tags: [Fastify, Typescript]
categories: [工程实践, 技术开发]
---

## tsconfig.json：TypeScript 项目的核心配置文件
在使用 TypeScript 开发 JavaScript 项目时，几乎所有项目都会有一个非常重要的文件：
```
tsconfig.json
```
TypeScript 官方文档也说明：  
> 这个文件用于定义编译目标、模块系统、类型检查规则、输入文件范围等行为。 ([typescriptlang.org][1])

它决定了 TypeScript 编译器如何理解、检查和编译你的代码。如果说 TypeScript 编译器 `tsc` 是引擎，那么 tsconfig.json 就是控制引擎运行方式的配置中心。  
一个最简单的例子：
```json
{
  "compilerOptions": {
    "target": "ES2023"
  }
}
```
当 TypeScript 编译器运行时：  
```shell
tsc
```
它会自动读取当前目录的 `tsconfig.json` 并按照配置执行编译。  

## 为什么需要 tsconfig.json ?
如果没有 `tsconfig.json`，TypeScript 仍然可以编译： 
```shell
tsc index.ts
```
但在真实项目中会出现很多问题：  
### 统一编译规则
不同开发者机器必须使用相同规则，例如：  
```json
target: ES2023
strict: true
module: ESNext
```
否则编译结果可能不同。 
### 控制代码兼容性. 
例如：  
```json
target: ES2017
```
意味着 TypeScript 不会输出 ES2023 的语法。  
这样可以保证代码在旧环境中运行。 ([typescriptdocs.com][2])
### 控制 TypeScript 类型检查
例如：  
```json
strict: true
```
开启严格类型检查。
### 控制项目结构
例如`src → 编译 → dist`:  
```json
{
  "rootDir": "src",
  "outDir": "dist"
}
```

由此可见, `tsconfig.json` 解决了编译规则统一、类型检查策略、项目结构管理三个核心问题。
## tsconfig.json 的基本结构
一个典型的 `tsconfig.json`：  
```json
{
  "compilerOptions": {},
  "include": [],
  "exclude": [],
  "extends": ""
}
```
最核心的部分是 compilerOptions
## compilerOptions 是什么? 
compilerOptions 是 TypeScript 编译器选项集合，决定了：  
* 编译输出
* 模块系统
* 语言版本
* 类型检查规则
* 项目结构

例如：  
```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```
### target
```json
target: "ES2023"
```
控制编译后的 JavaScript 版本。例如 TypeScript → JavaScript:  
如果：  
```json
target: ES5
```
箭头函数会被转换:  
```js
const fn = () => {}
```
变成：  
```js
var fn = function() {}
```

官方建议：  
> target 应设置为你支持的最低 JavaScript 版本。 ([typescriptdocs.com][2]). 

常见值：  
```
ES2017
ES2020
ES2022
ESNext
```
### module
```json
module: "ESNext"
```
控制模块系统。例如 import/export 最终编译为：  
* ES Modules
* CommonJS
* AMD

常见值：  
* CommonJS
* ESNext
* NodeNext
* ES2020

现代前端和 Node 项目通常使用 ESNext
### moduleResolution
```json
moduleResolution: "bundler"
```
控制模块查找规则。例如：  
```js
import foo from "./foo"
```
控制 TypeScript 如何找到 foo。官方定义：  
* bundler
* node16
* nodenext
* classic

bundler 表示：  
> 让 bundler（Vite / Webpack / esbuild）负责解析模块路径。 ([typescriptlang.org][3])

特点：  
* 不强制写 `.js` 扩展名
* 支持 package.json exports
* 更适合前端项目

### strict
```json
strict: true
```
开启严格模式。这是 TypeScript 最重要的配置之一。它实际上包含多个规则：  
* noImplicitAny
* strictNullChecks
* strictFunctionTypes
* strictBindCallApply

作用：  
* 避免隐式 any
* 避免 null 错误
* 提高类型安全

官方建议：  
> 始终开启 strict。 ([TypeScript TV][4])

### esModuleInterop
```json
esModuleInterop: true
```
用于解决 CommonJS 和 ES Module 互操作问题。例如：  
```ts
import express from "express"
```
而 express 实际是：  
```js
module.exports = express
```
没有这个配置就必须写：
```js
import * as express from "express"
```
开启后 default import 也可以使用。

### 其他重要 compilerOptions
以下也是常见配置：  
#### rootDir
```json
rootDir: "src"
```
源码目录。 
#### outDir
```json
outDir: "dist"
```
编译输出目录。
#### sourceMap
```json
sourceMap: true
```
生成 source map，方便调试。  
#### skipLibCheck
```json
skipLibCheck: true
```
跳过 node_modules 类型检查。大型项目非常常见。  
#### resolveJsonModule
允许：  
```js
import config from "./config.json"
```
#### forceConsistentCasingInFileNames
避免：  
* import User
* import user

在不同系统出现问题。
#### noEmit
```json
noEmit: true
```
让 TypeScript 只做类型检查。实际编译由：  
* Vite
* Webpack
* esbuild

完成。  
#### paths
大型项目常使用:  
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
这样可以写：  
```js
import userService from "@/services/user"
```
而不是：  
```js
import userService from "../../../services/user"
```
## include / exclude 是什么 ?
TypeScript 需要知道哪些文件需要编译
### include
```json
{
  "include": ["src/**/*"]
}
```
表示 src 目录下所有 ts 文件
### exclude
```json
{
  "exclude": ["node_modules", "dist"]
}
```
排除目录。

## extends 是什么?
extends 用于继承配置文件。例如：  
* tsconfig.base.json
* tsconfig.json

```json
{
  "extends": "./tsconfig.base.json"
}
```
这样可以：  
* monorepo 共享配置
* library / app 复用配置

很多项目都会这样：  
* tsconfig.base.json
* tsconfig.build.json
* tsconfig.test.json
## 常见的 tsconfig 示例
```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "rootDir": "src",
    "outDir": "dist",
    "skipLibCheck": true,
    "sourceMap": true,
    "resolveJsonModule": true
  },
  "include": [
      "@types",
      "src/**/*.ts"
  ]
}
```

那么, 最后的最后, 在哪里查看全部 tsconfig 选项呢? TypeScript 所有配置都在官方文档：

👉 [https://www.typescriptlang.org/tsconfig](https://www.typescriptlang.org/tsconfig)

一个好的 `tsconfig.json` 能让：  
* 项目类型更安全
* 编译行为更一致
* 工程结构更清晰

以上。

[1]: https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html?utm_source=chatgpt.com "TypeScript: Documentation - Modules - Choosing Compiler Options"
[2]: https://typescriptdocs.com/modules-reference/guides/choosing-compiler-options.html?utm_source=chatgpt.com "Modules - Choosing Compiler Options | Typescript Docs"
[3]: https://www.typescriptlang.org/tsconfig/moduleResolution.html?utm_source=chatgpt.com "TypeScript: TSConfig Option: moduleResolution"
[4]: https://typescript.tv/new-features/the-4-must-know-typescript-compiler-configs?utm_source=chatgpt.com "The 4 Must-Know TypeScript Compiler Configs"


