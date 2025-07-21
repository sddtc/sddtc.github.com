---
title: 关于 Scala 这门语言的理解和它的测试框架
date: 2017-11-08
tags: 测试
---

### 背景

事情大概要从那个让我花费了足足3天写了一个功能和功能的单元测试开始..
自我感觉非常良好的写了一个自以为完美的集成测试, 和同事争论到了下班- -
有一个晚上看了关于 `trait` 的 `test` 资料, 却并没有太多可以实际使用的技能
然而感谢我的pairer, 我们一起完成了所有单元测试, 使我进一步体会到了这个语言的一些东西

于是今天收集了一些关于 `Scala` 的[资料](https://www.zhihu.com/question/19748408):

### 哲学

"Scala is going nowhere, it is a gateway drug to Haskell"

### Scala的定位

1.Scala不把程序员当傻子, Scala相信程序员的聪明才, 让程序员自行选择合适的结构, 以针对变化万千的任务需求
2.相较于Java而言, 则是相信程序员的优化能力. 马丁·奥德斯基说:"很多程序员会告诉我，他们一般会重构他们的Scala代码两三次，甚至三四次."
3.Scala作为一个社区而言, 是非常追求运行速度的. 为了追求速度, Scala社区是绝对不会管所谓的"简单"或者是"好玩", 怎样有效率就怎样弄.
4.另一个Scala的很大优势就是所谓的Macro-多样化
5.作为编程语言方面的教授, 马丁·奥德斯基不断的将最前沿的学术界成果转移到Scala这个语言中, 还让他的博士学生发展出新的, 让语言运行得更快的方法, 这些都是其他语言, 尤其是Python、Ruby、甚至是Go都没有的优势.

### ScalaTest vs Scala Specs

"Both are BDD (Behavior Driven Development) capable unit test frameworks for Scala"

关于这两个框架的比较, stackoverflow有一篇不错的讨论[What’s the difference between ScalaTest and Scala Specs unit test frameworks?
](https://stackoverflow.com/questions/2220815/what-s-the-difference-between-scalatest-and-scala-specs-unit-test-frameworks)

据我了解, 我们项目使用了 `specs2`, 即便如此, 最近打算学习下[ScalaTest](https://github.com/scalatest/scalatest), 写出漂亮的测试






