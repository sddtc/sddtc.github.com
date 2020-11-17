---
title: "[kotlin]由 java.lang.NoSuchMethodError 引发的思考之二进制兼容性"
layout: post
categories: sddtc
date: "2020-11-16"
guid: urn:uuid:ad11cae4-3a09-4a83-8e9c-32513fed5c32
tags:
  - kotlin
---

#### 故事背景

当我写后端的时候，时不时的让程序抛出几个 5XX 的错误不在话下。当我写前端的时候，时不时的在浏览器的 dev tool 看到几个 js 错误堆栈也是基操基操。直到最近开始自己的 mobile 生涯，用 kotlin 写 Android。你或许想象不到，带给我最震撼的不是一个个精致好看体验极佳的手机应用，而是因为简单的错误直接造成的 crash 异常。crash 给人的感觉就是大脑嗡嗡的体验。最近遇见过几起小事件，抽个时间一一记录一下 ：）  

由于我们尝试使用 MFE(Micro-Front-End) 的思想来改进应用程序的扩展性和灵活性，所以在开发工程中我们有一个母应用 A，有一个子应用 B。集成方式是 B 作为 `library` 集成在 A 内。  
A 和 B 分别依赖了一个第三方库，使用库中的相同方法。 在第三库进行了升级之后，B 应用没有升级对应的新版本而 A 应用对该第三方库进行了版本的升级。 造成的结果是用户在试图进入 B 应用页面的时候造成了 crash。  

已知的前提： 这个第三方库不是所谓的 `break changes` 式升级。  
之后在回顾的时候我学到了一个词： `Binary Compatibility`  

#### 什么是 Binary Compatibility?

用维基百科的话来说，有个词是 `Binary-code compatibility`. 二进制代码的兼容性是计算机系统的属性，意味着他们可以运行相同的可执行代码，通常是指机器代码。œ另外还有一个概念叫做源代码兼容性(`Source-code compatibility`)，这次我不会做过多了解。  
对于一般操作系统上的已编译程序，二进制兼容性通常意味着不仅两台计算机的 CPU 指令集是二进制兼容的，还意味着操作系统和 API 的接口和行为以及与之相对应的 ABI 足够相等，即"兼容"。  

在看到维基这部分的解释，我对产生 crash 的原因产生了疑惑，我不知道这种抽象的概念是如何和语言层次产生出某种关联性的，于是我看到了一些文章，更贴近于 kotlin 的特点。  

#### Kotlin 的兼容性说明

[英文文档链接](https://mirrors.segmentfault.com/kotlin/compatibility.html)  
兼容性意味着回答这个问题：  
对于给定的两个版本的 Kotlin(例如，1.2 和 1.1.5)，为一个版本编写的代码可以与另一个版本一起使用吗？  
`OV` means `Old version`. `NV` means `Newer version`  

* C - 完全兼容
  * 语言
    * 无语法改动
    * 有新增/删除的警告/提示
  * API(`kotlin-stdlib-*`、 `kotlin-reflect-*`)
    * 无 API 改动
    * 可能添加/删除带有警告级的弃用项
  * 二进制(ABI)
    * 运行时：二进制代码通用
    * 编译：二进制代码通用

* BCLA - 语言和 API 向后兼容
  * 语言
    * 可能会在 NV 中删除 OV 中已弃用的语法
    * 除此之外，OV 中可编译的所有代码都可以在 NV 中编译(除去 bug*)
    * 可能在 NV 中添加新语法
    * 在 NV 中可以提升 OV 的一些限制
    * 可能添加/删除新的警告/提示
  * API(`kotlin-stdlib-*`、 `kotlin-reflect-*`)
    * 可能添加新的 API
    * 可能添加/删除带有警告级的弃用项
    * 警告项级的弃用项可能在 NV 中提升到 ERROR 级或者 HIDDEN 级

* BCB — 二进制向后兼容
  * 二进制(ABI)
    * 运行时：NV 的二进制代码可以在 OV 的二进制代码工作的任何地方使用
    * NV 编译器：针对 OV 二进制编译的代码可针对 NV 二进制编译
    * OV 编译器可能不接受 NV 二进制(例如，展示较新语言特性或 API 的二进制)

* BC — 完全向后兼容
    * BC = BCLA & BCB

* EXP — 实验性的功能
  * 例如 协程，不受兼容性限制，这类功能需要选择开启才能使用，而无需编译器警告。 实验性功能至少向后兼容补丁程序版本更新，但是不保证次要版本更新程序具有任何兼容性。

* NO —无兼容性保证
  * 我们会尽力提供顺利的迁移，但不能给出任何保证为每个不兼容的子系统单独规划迁移

不得不说第一次发现语言的更新的兼容性这么讲究。 也许一门快速成长的语言都有类似的特性，而我以前一直使用 java 却没有注意过。 使用 Typescript 也一直在看它又又又又拥有了哪些新的语法糖。  
直到开始写 Android, 而且是作为 MFE 的组件的位置，使用了一些依赖， 依赖总和母应用/其它 MFEs 产生冲突。 冲突使程序 crash, 这种感觉才愈发的强烈。    

那么很明显我们的问题是第三方应用的兼容性出现了问题，和 Kotlin 这门语言的兼容性没有强依赖关系，只是关于二进制兼容性这个词有了更清晰的理解而已。  

#### 第三方库的版本升级详解
第三方库 sddtcLibraryV1.0 有如下功能:  

```kotlin
data class SddtcData(val name: String, val id: String = "1111-2222-3333-4444")
```

编译后的二进制代码:  

```kotlin
// $FF: synthetic method
public SddtcClass(String var1, String var2, int var3, DefaultConstructorMarker var4)

//where var1 and var2 represent the paremeters name and Id, 
//var3 is the mask for default values and we can ignore var4
```

第三方库 sddtcLibraryV1.1 更新了功能:

```kotlin
data class SddtcData(val name: String, val id: String = "1111-2222-3333-4444", val email: String = "changhbaga@gmail.com")
```

编译后的二进制代码:  

```kotlin
// $FF: synthetic method
public TestClass(String var1, String var2, String var3, int var4, DefaultConstructorMarker var5)

//where var1 ,var2, var3 represent the paremeters name,Id and state, 
//var4 is the mask for default values and we can ignore var5
```

那么当我们使用时:  

```kotlin
val result = SddtcClass(name="sddtc")
```

For v1.0:  

```kotlin
new SddtcClass("sddtc", (String)null, 2, (DefaultConstructorMarker)null);
```

For v1.1:  

```kotlin
new SddtcClass("sddtc", (String)null, (String)null, 6, (DefaultConstructorMarker)null);
```

需要注意这两个版本都来自于解析这段 Kotlin 代码: `val result = SddtcClass(name="sddtc")`

**情景一:**  
  
母应用A/子应用B都依赖 `sddtcLibraryV1.0` 时， 当依赖更新为 `sddtcLibraryV1.1` A和B在重新编译后均不会出现任何问题。  

**情景二:**  

母应用 A 依赖 `sddtcLibraryV1.1`  
子应用 B 依赖 `sddtcLibraryV1.0`  

在编译时, 编译为不同版本的机器码  
在依赖冲突解决时，由于我们使用 gradle 并且在遇到两个不同版本的依赖时最终会将高版本的依赖打进 apk 中，其它依赖会被删除因此最终的包只有 `sddtcLibraryV1.1`  
在运行时，子应用会寻找要解析的 `sddtcLibraryV1.0` 签名而签名并不存在，因此抛出 `NoSuchMethodError: init<>` 错误。

#### 那么这种情况该怎么解决？
不得不说这是一个开放性问题，还没有绝对答案。 也有人遇到了类似的问题还没有答案 [Binary compatibility for constructors with default values
](https://discuss.kotlinlang.org/t/binary-compatibility-for-constructors-with-default-values/11385)  

想法一：  
既然运行时只有一个依赖版本存在，那么我们应该在编译时也强制只能有一个版本的依赖存在，提前暴露问题。  

想法二：  
舍弃默认构造参数的语法糖， 显示的实现满足所有参数排列的构造方法。

未完待续...
