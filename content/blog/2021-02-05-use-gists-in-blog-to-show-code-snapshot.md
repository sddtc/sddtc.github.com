---
title: 运用 Gists 来进行嵌套代码块管理
tags: 软件工程
date: 2021-02-05
---

最近一直在更新重构的读书笔记，而后发现其中的一些代码片段非常适合结合内容一起展示出来。以前写文章的时候，遇到代码片段都会直接写出来，例如：

![2021-02-05-Hf61Ob-XNbBls](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-05-Hf61Ob-XNbBls.png)

优点：
* 操作容易。 包括展示内容，修改内容我只需要直接更新文章相关内容

缺点：
* 代码片段不可复用。 例如,我想将这段代码应用在另一篇文章里或者分享给其它人，目前我只能重复再写一遍或者截图
* 为了代码高亮我需要安装相关的代码片段高亮插件。

为了可复用的目的我开始寻找替代方式，大概有三种方式：

### 将代码片段合成图片来展示
把代码制作成图片，我拒绝这种方式的主要原因是 1. 不利于选中相关的内容 2. 不利于有复制粘贴需求的用户

### 使用代码嵌套+运行的平台
![2021-02-05-wgrHpT-i6Y4gx](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-05-wgrHpT-i6Y4gx.png)

这种我在 Stackoverflow 的答案里见过，网上也有很多例如 [codepen.io](https://codepen.io/) 或者 [jsfiddle.net](https://jsfiddle.net/) 的运行平台
这种运用在博客里稍微有点大材小用了，我倾向于写较为复杂且可以执行演示的例子时，可以使用它们

### github gists
我知道 gists 好用，但是莫得想到它这么好用我直接扣哎扣. [创建](https://gist.github.com/)你的代码片段:

<script src="https://gist.github.com/sddtc/25cf4829dcd0206a5bc2e3b43b22ebca.js"></script>

就它了嗷！
