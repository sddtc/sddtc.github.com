---
title: "[读书笔记] 品品《重构》这本书嗷 - 中"
layout: post
categories: 读书笔记
date: "2021-03-13"
guid: urn:uuid:2071efe8-d27e-488c-b7a8-f5c2652831ff
tags:
  - tech
---

![2021-02-02-OB7st5-6Qdhz1](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-02-OB7st5-6Qdhz1.png)

一个分层良好的系统, 应该将处理用户界面和处理业务逻辑的代码分开. 之所以决定把读书笔记分出来写是因为最近写 `Android` 发现分层真的很难良好. `viewmodel` 的责任太容易越线了.  
首先作者提出为什么把界面和业务逻辑分开是好的实践:  
* 你可能需要使用不同的用户界面来表现相同的业务逻辑, 如果同时承担两种责任, 用户界面会变得过分复杂  
* 与 GUI 隔离之后, 领域对象的维护和演化都会更容易, 你甚至可以让不同的开发者负责不能部分的开发  

如果你遇到的代码是以两层方式开发, 业务逻辑被内嵌到用户界面中, 你就有必要将行为分离出来.  
其中主要工作是函数的分解和搬移. 数据与之不同: 你不能仅仅搬移数据, 比如要将他复制到新的对象中并提供相应的同步机制.  

书里的做法: 修改展现类, 使其成为领域类的 `Observer`. OMG 这大概就是 `LiveData` 的诞生的原因. 有时间研究一哈子 🎢

![2021-03-13-I9yqCE-Utzaue](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-03-13-I9yqCE-Utzaue.png)


#### Reference
[[读书笔记] 品品《重构》这本书嗷](https://www.sddtc.florist/posts/2020/12/18/pinpin-refactor-book.html)
