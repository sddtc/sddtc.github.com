---
title: "Github - JavaScript Game Engines 使用指南"
layout: post
categories: sddtc tech
date: "2021-02-10"
guid: urn:uuid:df392dbf-8069-4721-8bdf-5e5603124241
tags:
  - js
  - tech
---

最近想了解(~~因为要写点啥你懂的~~)一些用 js 写的绘制 2D 动画的库。于是窝找到了 [javascript-game-engines](https://github.com/collections/javascript-game-engines)

#### 排行🥇 PixiJS — The HTML5 Creation Engine [-> go](https://github.com/pixijs/pixi.js)
![2021-02-10-220qqJ-QTqJO7](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-10-220qqJ-QTqJO7.png)

目标是适应于所有设备，是快而轻量的 2D 库。  
PixiJS 是一个渲染库，可以让我们创建丰富的交互式图形，跨平台的应用程序和游戏。 无需深入研究 WebGL API 或处理浏览器和设备的兼容性。  
PixiJS 具有完备的 WebGL 支持，并在需要时可以无缝回退到 HTML5 的 Canvas。  
如果我们想相对快速的创建优美而精致的应用，而又不想过于深入的研究代码本身，同时还想要避免遇见兼容性问题，那么就尝试使用 PixiJS 的样子。  

#### 第 2⃣️ 名 Phaser - HTML5 Game Framework  [-> go](https://github.com/photonstorm/phaser)
![2021-02-10-QUOw4z-2j9Elq](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-10-QUOw4z-2j9Elq.png)

一个快而有趣的 HTML5 游戏框架引擎。可以在台式机，移动 Web 浏览器提供 WebGL 和 Canvas 渲染。 可以使用第三方工具将你开发的游戏代码编译为支持 iOS/Android 系统的应用。
我们可以使用 JS 或者 TS 语言开发。

### 第 3⃣️ 名 melonJS [-> go](https://github.com/melonjs/melonJS)  
![2021-02-11-AQyWfw-7VVFPh](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-11-AQyWfw-7VVFPh.png)

一款轻量级的 HTML5 游戏框架引擎。功能介绍的非常详细：  
* 清新轻巧的 2D sprite-based 引擎
* 一个独立的库（除了支持HTML5的浏览器外，不依赖其他任何库）
* 与所有主流浏览器（Chrome，Safari，Firefox，Opera，Edge）和移动设备兼容
* 适用于台式机和移动设备的快速 WebGL 渲染器，具有 Canvas 渲染的 fallback 功能
* 高 DPI 分辨率和 Canvas 高级自动缩放
* Web 音频支持，可 fallback 到多通道 HTML5 音频
* 轻巧的物理实现可确保较低的 cpu 要求  

等等...  

### 第 4⃣️ 名 Kiwi.js [-> go](https://github.com/gamelab/kiwi.js)
![2021-02-11-3PE8ba-orGJG2](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-11-3PE8ba-orGJG2.png)

Kiwi.js 号称是世界上最简单的基于 HTML5 的游戏框架。可以制作移动端或桌面端的游戏。我们着重于提供快速的 WebGL 渲染和补充工具，以制作出专业品质的游戏。  
Kiwi.js 使用 CocoonJS 发行游戏和创建应用程序。

### 第 5⃣️ 名 Crafty JS [-> go](https://github.com/craftyjs/Crafty)
![2021-02-11-eJ5w5q-j6LFM0](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-11-eJ5w5q-j6LFM0.png)

Crafty 是一个 JavaScript 游戏库，可以帮助我们以结构化的方式创建游戏...  
#### 主要特点：
* 定义了各种实体和组件 - 这是用一种干净且分离的方式来组织游戏元素。 无需继承！
* 事件绑定 - 用于自定义事件的事件系统，可以随时随地触发并轻松绑定。
* 不需要 dom 操作或自定义绘图。

#### 其他特点：
* 蓬勃发展的社区 - 论坛中随时提供帮助。
* 社区贡献各种开源的模块 - 我们可以使用他们  
* 纯 JavaScript - 在所有主流浏览器中均可使用，并且可以与您喜欢的 js 库结合使用。  

### 第 6⃣️ 名 matter-js [-> go](https://github.com/liabru/matter-js)
![2021-02-11-4RUcv3-FN12W0](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-11-4RUcv3-FN12W0.png)

Matter.js 是一个用于 Web 的 JavaScript 2D 物理引擎框架。  
功能介绍的也非常详细：  
* 各种物理体态，包括物理性质（质量，面积，密度等），恢复原状（弹性和非弹性碰撞），碰撞（宽相，中相和窄相）
* 视图（翻译，缩放）
* 碰撞查询（光线投射，区域测试）
* 时间缩放（慢动作，加速）
* 画布渲染器（支持矢量和纹理）
* 用于创建，测试和调试世界的 MatterTools
* 世界状态序列化（需要 resurrect.js ）
* 跨浏览器和 Node.js 支持（Chrome，Firefox，Safari，IE8 +）
* 兼容移动设备（触摸式，响应式）
* 原始的 JavaScript 物理实现（不是端口）  

### 第 7⃣️ 名 stage.js [-> go](https://github.com/shakiba/stage.js)
![2021-02-11-iM1jzX-V3Ov28](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-11-iM1jzX-V3Ov28.png)

Stage.js 是一个 2D 的 HTML5 Javascript 库，用于跨平台游戏开发，它轻量，快速，且开源。  

在列表的后面还有相当多的优秀的开源库，就我自己选型而言以上的这些已经够用了。 一方面是因为其他的很多都是与 3D 相关的和我的需求不符，一方面因为文档描述的相对而言过于简单了。  
就酱！  
除夕快乐！！ 🧨🧨🧨  
