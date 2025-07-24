---
title: 搭建基于websocket的在线多人聊天室
date: 2025-07-24
tags: [js, websocket]
---

不论是chatGPT还是DeepSeek, 目前用户的交互界面仍然是以聊天框的形式出现, 其背后都离不开WebSocket技术.  
> WebSocket 是一种在客户端和服务器之间提供全双工通信的协议，允许实时、双向的数据传输。它通过持久连接而不是传统的请求-响应模式，减少了延迟和网络流量，适用于需要实时交互的应用，如在线游戏和聊天应用.  

我所喜欢的很多网页游戏也都是用了它, 比如[多人在线弹钢琴](https://multiplayerpiano.com/). 突然发现书签里"useless-but-fun"文件夹的好多链接如今也无法访问了, 我猜测归根到底一些平台改变了收费模式, 作者如今还没有更新它们.  
最近也是完成了一个在线聊天室, 撒花🎉
> [sddtc's chat room](https://chat.sddtc.florist/).  

其中前后端分离两个仓库, 前端部署在[Vercel平台](https://vercel.com/home), 后端部署在[Render](https://www.render.com/), 数据存储部分用了 MongoDB Atlas.  
一开始没有拆分项目, 然而Vercel平台的免费版本并不支持长链接, 它提供的后端平台是以 serverless 函数的形式出现. 也就意味着每次请求的处理都需要是无状态的. 所以思索之下拆分了前后端, 也初次尝试了Render这个平台. 目前体验还不错. 另外一个注意的点便是跨域的安全问题. 前后端部署在不同的域名之下, 如果使用cookie等安全规范严格的技术, 是要处理该问题的, 其中一个办法便是将它们放在统一的域名下. 所以有自己的域名还是有很多方便之处的.

**前端项目使用:**  
* React + Vite, 这个组合部署在Vercel非常顺畅. 见[当你做技术选型时需要考虑的](./2025-06-16-technology-selection.md)
* [zustand](https://github.com/pmndrs/zustand), 使用了一个React状态库来处理组件刷新行为
* socket.io-client 在和ws库对比之后使用了socket.io的客户端, 文档很不错
* [tailwindcss](https://tailwindcss.com/) + [daisyui-Tailwind CSS plugin](https://daisyui.com/) 新学习了这一套样式组合, 搭建出来的网站更好看了.  

**后端项目使用:**  
* socket.io  
* express  nodeJS的web框架
* [mongoose](https://mongoosejs.com/)  管理mongoDB的ODM库
* MongoDB Atlas.  聊天记录和简单的用户管理用了下mongoDB的cloud平台存储  

整个下来的感受还是很开心的, 因为从0到1是勇气的开始, 而1到100便是日积月累的循规蹈矩. 2个项目打算在测试完善之后开源, 基于WebSocket技术的应用还是很有趣的.  
以上.
