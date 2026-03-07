---
title: 当你做技术选型时需要考虑的
date: 2025-06-16
categories: [工程实践]
---

软件工程是手段,不是目的. 不论是做企业软件开发, 做产品验证 POC 还是个人产品开发, 你总会在不同的时刻考虑技术框架, 亦或是不用框架; 考虑使用某个工具 A 而非工具 B, 使用云平台 C 还是读取文件使用缓存策略, 都是基于现阶段, 以及未来(短期)可能会出现的可能性的考虑. 毕竟有句很火的话
> 先做一个垃圾出来

并不是说你做出来的东西是“垃圾”, 而是说简单/粗糙是开始的好起点.

最近使用 `mui+vite+vitest+supabase+vercel` 快速搭建了一个站点, 借此来记录一些经验.
首先确定开发工具, 写前端首选 `vscode`, 对于 `js` 语法高亮的支持好
其次选择前端框架, 测试框架, 这次选择了 [vite](https://vite.dev/) + React + [vitest](https://vitest.dev/). 用 `Material UI+React` 搭建了简单的页面, 本地调试了样式与功能.
在选择云部署平台的时候参照了目前网络上[推荐的免费云平台](https://gist.github.com/imba-tjd/d73258f0817255dbe77d64d40d985e76), 各有各的优劣, 主要考虑的方面有:
1. 免费额度: 如果是 POC, 那么使用免费的云平台是为了降低成本, 快速验证
2. 域名污染: 指的是很多平台会绑定固定的域名, 例如 [vercel](https://vercel.com/home)
3. 安全性: 如果你选择是无后端服务或者其他BaaS, 那么后期要考虑支持 `client credentials` 服务
4. 语言支持
5. 易用性

最终选择了 [vercel](https://vercel.com/home), 合适的免费配额, 快速的部署流程, 和 `github repo` 的集成简单, 再加上本人有年包的域名服务, vercel 也能方便的进行配置.
将本地的项目进行远端部署就需要一个构建工具, [vite](https://vite.dev/) 引起了我的注意, 因为初始化项目时并没有使用 CRA(create-react-app脚手架), 我并不是一个热衷于通过简单的却未知的命令来启动项目的人, 因为丰富的依赖和配置让我并不能立刻意识到它们都是做什么的, 也让本身简单的事情复杂化. 毕竟新增容易, 但是删除的成本是巨大的. 在没有搞清楚之前, 为什么要埋下一颗小小的炸弹呢😄, btw: 今年2月14日的文章[Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)也意味着 CRA 不再被官方推荐使用.
目前 vite.config.js 的内容仅有:

```js
import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        ...configDefaults.exclude,
        'src/index.jsx'
      ]
    }
  }
})
```
其中 `globals: true` 是为了解决跑一个测试文件的多个单元测试时, 避免 `render` 重复的元素, 保证每次的 dom 挂载时全局时是被其它单测可见的. `environment: 'jsdom'` 和 `'./vitest-setup.js'` 是为了 components 测试模拟真实的浏览器html dom树. 项目在本地跑单测时, 而非用户真实的使用场景(浏览器内部), 而是在 js 的运行时环境(node), 于是使用 `jsdom` 是为了保证组件的渲染和行为能够模拟用户的使用场景. 见[testing-library: add vitest-setup.js](https://testing-library.com/docs/svelte-testing-library/setup/#vitest).
最后 `coverage` 的配置是为了理直气壮的不为 `src/index.jsx` 写测试😉.
[supabase](https://supabase.com/) 是众多免费开源数据库平台, 通过jwt token(client level, service level) 来提供读写服务, 其中可以配置 row level policy 来保证用户对于数据的权限验证. 选择它也是因为它的使用性简单, 但是访问速度在此打出一个小问号吧.

在考虑测试框架和测试金字塔时选择 `vitest` + (组件单测+业务逻辑单测)+页面集成测试+UI测试.
其中 `vitest` 基本上可以平替 `jest`: 提供 `describe, it, expect, vi, beforeEach` 等方法. 其中在 `mock` 的使用上有小小差别. 例如 `vitest` 需要使用 `vi.hoisted` 方法来进行 mock 函数的声明.
而在测试 react 组件时依然使用 `@testing-library/react` 的 `render, screen, fireEvent` 等方法.
写下这些的时候突然想起之前为一个产品设计测试金字塔, 其实最难的并不是设计, 而是让他人理解, 在大家提起 “为什么要写测试”, “如果写了 xx 是不是就不用写 yy", "zz 这么难写有什么意义" 之类的困惑. 我想, 首先测试的编写是用自动化的程序简化人工验证的繁琐, 其次编写测试程序是促使开发人员切换产品的角度思考问题; 最后对于测试类型的抉择和删减的讨论, 我想说, 如果测试能解决问题, 存在就是合理的.

最后的最后再配置下自己的 eslint, 一整个项目就完备了 🎉
以上.

文后话:
挂载VPN时 docker 下载镜像一直报错
> Error response from daemon: Get "https://registry-1.docker.io/v2/": context deadline exceeded (Client.Timeout exceeded while awaiting headers)

本机使用 colima 启动 docker, 查了半天也没找到解决方案, 放弃使用 colima, 下载 docker desktop 解决了问题. 真是柳暗花明又一村 😎
