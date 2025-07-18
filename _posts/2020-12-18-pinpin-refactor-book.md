---
title: "[读书笔记] 品品《重构》这本书嗷"
layout: post
categories: 读书笔记
date: "2020-12-18"
guid: urn:uuid:a93dc7db-0ac2-40c2-9980-af9d142cd8c3
tags:
  - tech
---

书里首先介绍了重构这种行为朴素的优点：  

> 重构行为可以使责任的分配更为合理，使代码的维护更加轻松。 重构之后风格会迥异与过程化风格-后者也许是某些人习惯的风格。
  
接着又朴素的强调了测试的重要性，它是重构的前提。 因为测试可以帮助我们来方便的验证重构行为对功能没有产生不好的效果。
  
> 重构的节奏一般是测试，小修改，测试，小修改，测试，小修改..  

接着作者对重构进行了定义，~~太严谨了~~ 重构可以根据上下文的不同分为两种定义：  
* 名次形式： 对软件内部结构的一种调整，目的是在不改变软件可观察行为的前提下，提高其可理解性，降低其修改成本。
* 动词形式： 使用一系列重构手法，在不改变软件可观察行为的前提下，调整其结构。

重构和对程序进行性能优化是两个独立的概念，有相似性和区别:
* 相似性：他们都只会改变其内部结构。 然而对软件可观察的外部行为只造成很小变化，或甚至不造成变化（性能优化使执行速度变快）
* 区别：
  * 重构的目的是使软件更容易被理解和修改。
  * 性能优化往往使代码较难理解，但为了得到所需的性能你不得不那么做。

当你使用重构技术开发软件时，你会把自己的时间分配给两种截然不同的行为：添加新功能，以及重构。 这就是所谓的 "两顶帽子" 比喻：  
当你带上了添加新功能的 🎩，那么你就不应该修改既有代码，只管添加新功能。通过测试    
当你带上了重构的🎩， 那么你就不应该再进行和新功能有关的开发工作，只管改进程序结构  

那句话又来了  
> 重构不是所谓的"银弹" -- 然而是一把"银钳子"

如果没有重构，程序的设计会逐渐腐败变质。 当人们只为短期目的或是在完全理解整体设计之前就贸然修改代码，程序将逐渐失去自己的结构。代码结构的流失是累积性的。          
这句话让我想起来看过的一本书，图解逻辑思维什么的。 大概意思是说很多人~~理工科的~~很容易陷入局部思考而忽略整体。想了想大部分人会为了重构而重构 -- 那么就是忽视了整体设计而专注于个别变量，方法，类。 那么这样我觉得也算不上保护了设计。      

> 我不是个伟大的程序员，我只是个有着一些优秀习惯的好程序员 - [Kent Beck](https://en.wikipedia.org/wiki/Kent_Beck)  

> 计算机科学是这样一门科学： 它相信所有问题都可以通过增加一个间接层来解决 - Dennis DeBruler

这样看来我确实不会对大多数重构都为程序引入了更多间接层而惊讶。 重构往往把大型对象拆成多个小型对象，把大型函数拆成多个小型函数。 然而那句话又来了，间接层是一把双刃剑。书中列举了它的若干价值：
* 允许逻辑共享
* 分开解释意图和实现
* 隔离变化
* 封装条件逻辑

![2021-02-19-toOmV5-IQV85C](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-19-toOmV5-IQV85C.png)

在这本书的第三章作者描述了多达 22 种代码坏味道。 不得不说我打算看这本的初衷是我被一种坏味道的名字吸引了😂。 在这些每一个坏味道的子内容里，作者还给出了怎么做, 简直不要更贴心。  

![2021-02-19-SVmMSb-40escF](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-19-SVmMSb-40escF.png)

当我看到第四章节的时候我停下来了。 第四章讲的是构筑测试体系。  

> 如果认真观察程序员把最多的时间耗在哪里，你会发现。 编写代码其实只是非常小的一部分。
> 有些时间是在决定下一步干什么
> 另一些时间花在设计上
> 最多的时间则是用来调试。

回想起来，竟然默默的点了点头。 修复错误通常比较快， 找出错误却是一场噩梦。  
一套测试就是一个强大的 bug 侦测器， 能够大大缩减查找 bug 所需要的时间。 然而说服别人编写测试并不容易。 不仅意味着写超多的额外代码，还需要学习怎么写测试程序。    

频繁进行测试是极限编程的重要一环。 极限编程者都是十分专注的测试者。  
作者遵循的测试风格是观察类该做的事情然后针对任何一项功能的任何一项可能失败的情况进行测试，而不是"测试所有的 public 函数"。 测试是一种风险驱动的行为，目的是希望找出现在或未来可能出现的错误。  
所以不会去测试那些仅读/写一个字段的访问函数，因为太简单而不大可能出错。  
测试的要诀是： 测试你最担心出错的部分。  
接着作者提到了一点： 测试代码和产品代码有个区别，你可以放心地复制编辑测试代码，处理多种组合情况。  

![2021-02-19-Rh7Fd6-HvOkpm](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-19-Rh7Fd6-HvOkpm.png)

在第五章节的时候作者又严谨的提到书中讲的重构手法有一个前提那便是"单进程软件"。 因为对于并发和分布式的程序来说重构手法应该是不同的。举例来说，单进程软件对于函数调用的成本很低，所以你永远
不必操心多么频繁的调用函数。但在分布式程序中，函数的调用必须被减到最低限度。  
另外，关于设计模式和重构的关系作者也有提到：  
* 许多重构手法都涉及向系统引入设计模式
* "设计模式为重构提供了目标" - GoF
* 重构和模式有一种与生俱来的关系。 模式是你希望达到的目标，重构是到达之路  

![2021-02-19-RqlBXI-ZfKXaz](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-19-RqlBXI-ZfKXaz.png)

第六章 =》 《重新组织函数》  
> 我的大部分重构手法，很大一部分是对函数进行整理，使之更恰当的包装代码。几乎所有时刻，问题都源于过长函数。  

简短而命名良好的函数的优点:  
1. 每个函数粒度变小，那么可复用的机会会变大
2. 使高层函数读起来像读注释一般容易
3. 函数都是细粒度，覆写会更加容易  

大部分时候要想做到命名良好是比让函数保持简短更难的事。 命名是一件从仔细揣摩到~~草草了事~~过程的写照之一【狗头保命.  
命名的难度作者用了一句话很好的诠释了精髓： 关键在于函数本体和函数名称之间语义的距离。  

作者有提到一个偏好  
> 如果返回结果的变量不止一个，该怎么办？  

有几个选择。最好的选择通常是：挑选另一块代码来提炼。作者比较喜欢让每个函数只返回一个值， 所以会安排多个函数，用以返回多个值。 如果我们使用的语言支持 "output parameter", 可以使
它返回多个值。但这里还是建议选择单一返回值。  

作者在这一章节提到了将复杂的临时变量到底是抽离成表达式比较好，还是抽离成一个 private 函数比较好？ 他给出了个人的建议，那便是大部分情况下抽离成函数比较好。临时变量确实是重构
中特别棘手的问题。 它提醒到我了，前一阵子古典文学少女就遇到了一个测试的问题，当我们识别出测试难写是因为实现中有个函数内部的临时变量在搞怪的时候，确实很难找出一个解决办法。但
其实书里这里讲到了，那个临时变量是可以抽离成一个函数的，并且这个函数在我们的上下文里是可以成为一个 public static 函数的。  

在这一章节里面作者还有一个非常好的观点，那便是  
> 移除对参数的赋值  

意思就是如果你把一个 `foo` 对象作为参数传给某个函数，对参数赋值意味着改变 `foo`, 使它引用另一个对象。 如果你在该对象上做一些操作不在讨论范围内。  
首先对参数赋值的操作  
* 降低了代码的清晰度
* 混用了按值传递和按引用传递的两种参数传递方式（`Java` 只采用按值传递的函数调用方式）  

在 `Java` 中，不要对参数赋值。然而面对使用"出参数"的语言你不必遵循该规则。  

![2021-02-19-Al5lrN-3MrmqK](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-19-Al5lrN-3MrmqK.png)

终于读到了第七章 🥁🥁🥁 !!! 《在对象之间搬移特性》  
> 在对象的设计过程中， "决定把责任放在哪里"即便不是最重要的事，也是最重要的事之一。  

这句话我第一反应就是 DDD(Domain-drive Design 领域驱动设计) 会在实现的阶段，倾向于把责任从统一的业务处理层挪到具体的领域模型上，来描绘出一个健康的对象宝宝 👶 (使
领域对象既不会变成贫血模型，也不会变成充血模型)  

* 如果类因为承担过多责任变得臃肿不堪，这种情况我们会使用 `Extract Class` 将一部分责任分离出去
* 如果一个类变得太"不负责任"，我们会使用 `Inline Class` 将它融入另一个类  
* 如果一个类引用了另一个类，运用 `Hide Delegate` 将关系隐藏通常是有帮助的
* 如果隐藏委托类会导致拥有者的接口经常变化，此时需要 `Remove Middle Man`
* 当我们不能访问某个类的源码，却又想把其他责任移进这个不可修改类时，可以使用 `Introduce Foreign Method` / `Introduce Local Extension`
  * 如果我只是想要加入一两个函数，可以使用 `Introduce Foreign Method`
  * 如果函数超过了两个，使用 `Introduce Local Extension`

单单品品这一章节的 Agenda 我已经按耐不住想要继续阅读的渴望了 🌝

如果在你的程序里，有个函数和另外一个类进行着更多的调用/被调用这样的交流，这个更多是相对于这个函数与它所处的类的交流。那么我们可能需要"搬移函数"来将该函数彻底移动到交流更亲密的类里。  
作者有提到，"搬移函数"是重构理论的重要支柱：
> 如果一个类有太多行为，或如果一个类与另一个类有太多合作而形成高度耦合，我就会搬移函数。通过这种手段，可以使系统中的类更简单，这些类最终也将更干净利落地实现系统交付的任务。

"搬移字段"也和👆讲的有异曲同工之处，也是只字段和另外一个类有更加"亲密"的交流，那么我们可以进行字段的搬移  

在第七章节的第三部分，作者提到了一个有趣的事情： 如果一个类做了应该由两个类做的事情那么我们也需要进行重构了。 这就不得不让我联想到那拥有着丰富逻辑处理的 `Service` 层， 和几乎
什么都不处理的 `Controller` 层。 真是令人迷惘。这里作者提到了一个教诲：  
> 一个类应该是一个清楚的抽象，处理一些明确的责任。

但是在实际工作中，类会不断的成长扩展。 给某个类添加一项新的责任的时候，你会觉得不值得为这个责任分离出一个单独的类。于是随着责任的不断增加，这个类会变得过分复杂，甚至成为一团乱麻。qvq  
另一个信号是类的子类化方式。 如果你发现子类化只影响类的部分特性，或如果你发现某些特性需要以一种方式来子类化，某些特性需要以另一个方式子类化，这就意味这你需要分解原来的类。 看到这里我
突然意识到在实现继承的后期，往往会创建出有独特特性的子类，然而这些子类的变化非常小，可能是一个方法的重载。 或者说给父类添加了新方法来给某些子类使用，都是我干过的事。 却没有过多思考
类是不是还清楚的拥有一些明确的责任。 我做的事情就像让一个纯种暹罗慢慢慢慢杂交成了一个长毛，阴阳眼，脸蛋也不黑糊糊了的一个小崽子。  

在隐藏"委托关系"的部分里作者强调了"封装"："封装"即使不是对象的最关键特征，也是最关键特征之一。 "封装"意味着每个对象都应该尽可能少的了解系统的其他部分。如此一来，一旦发生变化，需要
了解这个变化的对象就会比较少-这会使变化比较容易进行。  

![2021-02-02-OB7st5-6Qdhz1](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-02-OB7st5-6Qdhz1.png)  

第八章是很有趣的一章，作者主要讨论值对象和引用对象之间的转换，即在重构的路上，你可能会将创建的值对象转变为引用对象，而随着业务的成长，因为某些原因你可能又会将其改回为值对象。 
接着有一天业务的变化，使这个对象会被多个对象实例持有，那么你就可能会再次将其改回为引用对象。  
我想起了那句话 🍕  
 
> "唯物主义认为，事物的发展是呈螺旋式上升的"

在"字段访问方式"这个问题上一般有两派： 一派认为，在变量定义的类里可以自由访问它；另一派认为，即使是在这个类里你也应该通过访问函数间接访问。归根结底，  

_间接访问变量的好处_：    
* 子类可以通过覆写一个函数而改变获取数据的途径
* 它还支持更灵活的数据管理方式，例如延迟初始化（意思是只有在用到时将它初始化）  

_直接访问变量的好处_：  
* 代码容易阅读。 不需要在读到这个变量的时候看到的是一个取值函数  

<script src="https://gist.github.com/sddtc/25cf4829dcd0206a5bc2e3b43b22ebca.js"></script>

书里提到了一个点，当我们使用间接访问变量的赋值函数时，要小心处理在"构造函数中使用赋值函数"的情况。 因为一般而言，赋值函数被认为应该在对象创建之后才使用的，所以初始化过程中
的行为有可能与赋值函数的行为不同。 在这种情况下，作者或者会选择在构造函数中直接赋值的方式，或者是单独创建另一个初始化函数, 例如 `initialize`。  

那么这种"封装字段"的做法有什么好处呢？ 一旦你拥有了一个子类，这些动作的价值就会体现出来：  

<script src="https://gist.github.com/sddtc/752346c6cc1e1c8088fa60b954acd3f3.js"></script>  

我们在 `CappedRange` 子类中覆写了 `getHigh`, 加入了对 "范围上限" 的考虑，而不必修改 `IntRange` 的任何行为。  

在第八章中, 书里介绍了几种编码的进化场景:
1. 以对象取代数据值
2. 将值对象改为引用对象
3. 将引用对象改为值对象
4. 以对象取代数组

就不一一细说了, ~~其实是最近忙的没时间看书好好记笔记~~  
