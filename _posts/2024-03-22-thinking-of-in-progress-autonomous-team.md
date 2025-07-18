---
title: "中型项目组织的自治团队模式思考"
layout: post
categories: 软件工程
date: "2024-03-22"
guid: urn:uuid:f357efba-de1a-4159-a8c3-573e5d386c4b
tags:
  - team culture
  - architecture
---

“人在江湖, 身不由己” 常常指的是在有限的环境里面被迫适应, 因而无可奈何的改变自己的自嘲的话罢了.  
去年有幸加入了一个中等规模的项目, 里面有很不错的工程文化, 给我的感受便是每个团队有很高的话语权, 团队自治, 自己去实现各种功能服务. 自己去和上下游
服务打交道. 自己做技术方案, 自己做持续交付. 但是渐渐的感觉到很多事情并不是那么简单:    
* 我觉得可以中心化的东西因为一些声音开始去中心化  
* 一开始就可以去中心化的实践却先中心化的实现再计划“推翻” 而违背精益思想
* 跨团队建模这个事情推行困难, 大量重复的模型、逻辑, 以及还没有被挖掘出价值的数据. 也因为团队的高度自治各自为王甚至很难找到机会一起思考, 讨论. 更别说落地了.  
* 没有提供极好 API 文档化的实践土壤, 在 API 和 events 共存的情况下边界不清  
* 微服务架构的发展还在业务领域苦苦挣扎, 甚至衍生不出类似于中台的东西.

也读过一些书, 知道软件开发都是在各种各样的约束之下才是现实世界本来的样子, 很多问题也是能找到一些合理的现实因素, 那是做为软件开发过程中理所当然的妥协. 但是哪些该妥协哪些不该妥协一直是让我有些痛苦的.  
也曾想过为什么一个运行了很久的项目竟是这样, 也见过快速发展不断扩张的部门的样子, 也见过已经进入大气层的样子. 所以也会安尝试自我安慰, 这种成长中的项目, 大概应该再多等等, 多看看, 多试试.  
但是留给我的时间好像不多了, 日常繁杂都是尘埃. 所有的困惑、痛苦的出口, 那才是星辰大海.
