---
title: 来到一个新环境总会有些新收获
date: 2017-01-01
tags: software engineer
---

第一周,学到的东西也很多.

### Gradle
一直使用Maven来进行Java项目搭建和管理、构建，如今切换技术栈到Gradle上，在此了解了一些它的优势和区别。
1.相同点:依赖管理
区别:
- Maven是xml文档编写,语法较为复杂;Gradle语法更加精简
- Maven和Gradle对依赖项的scope有所不同,在Maven世界中,一个依赖项有6种scope,分别是complie(默认)、provided、runtime、test、system、import.而grade将其简化为了4种,compile、runtime、testCompile、testRuntime.
- Gradle支持动态的版本依赖.在版本号后面使用+号的方式可以实现动态的版本管理
- 依赖冲突处理

2.相同点:多模块构建
区别:
- 在Maven中需要定义个parent POM作为一组module的聚合POM, 而Gradle也支持多模块构建。而在parent的build.gradle中可以使用allprojects和subprojects代码块来分别定义里面的配置是应用于所有项目还是子项目。对于子模块的定义是放置在setttings.gradle文件中的。在gradle的设计当中，每个模块都是Project的对象实例。而在parent build.gradle中通过allprojects或subprojects可以对这些对象进行各种操作。这无疑比Maven要灵活的多

3.相同点:一致的项目结构

4.相同点:插件机制,在创建自定义插件方面，Maven和Gradle的机制都差不多，都是继承自插件基类，然后实现要求的方法

5:相同点:一致的构建模型
区别:
在Gradle世界里可以轻松创建一个task，并随时通过depends语法建立与已有task的依赖关系。甚至对于Java项目的构建来说，Gradle是通过名为java的插件来包含了一个对Java项目的构建周期，这等于Gradle本身直接与项目构建周期是解耦的

其它:gradlew这个组件很好用，简化了很多步骤，可默认build出可执行文件

### Jenkins Jobs
通过job，作为第三方系统的调用的插件平台
可使用shell,python，perl等脚本语言编写
可将从Git仓库拉取代码，执行job任务

### Python VirtualEnv
python虚拟环境是python的一个第三方package，用于给每个应用部署一套python环境，这样一来，每个应用可依赖相同第三方包的不同版本，并不会造成版本冲突

### Java8
对于新技术的使用要快准狠,为了更多的使用新技术带来的便捷,同事推荐下买了java8 in action;)

参考文章:
[Maven和Gradle对比](http://www.importnew.com/18008.html)
