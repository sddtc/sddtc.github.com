---
title: "[Android Core] Fundamentals 是基本原理的意思."
layout: post
categories: sddtc
date: "2020-12-01"
guid: urn:uuid:ea14c80c-353c-4c7c-81bf-d750eeba1cb9
tags:
  - android
---

### 概要

Android 应用可是使用 Kotlin, Java, C++ 这些语言来构建. Android SDK tools 会将你的代码和数据, 资源文件一起编译成 APK 包. 一个 APK 包文件包含了所有和应用相关的资源文件, 并可以安装在支持 Android 系统的设备上。  
每一个 Android app 拥有属于它自己的安全沙盒, 主要的安全特性有以下几点:  
* Android 操作系统是一个多用户的 Linux 系统. 每一个应用是一个不同的用户.
* 默认情况下, Android 系统会给每个 app 分配一个唯一的用户 ID(这个 ID 对 app 是"透明"的). Android 系统会根据该用户 ID 去分配操作权限, 权限作用于app 内的所有资源文件.  
* 每一个进程拥有自己的 VM(virtual machine). app 们之间天然隔离.
* 默认情况下, 当 app 的组件执行时 Android 系统会启动一个 Linux 进程. 当系统需要分配内存给其它应用, 或该应用不再需要运行时, 该进程会被终止.  

Android 系统遵循的是最小权限原则(_the principle of least privilege._). 也就是说, 默认情况下, 每个应用程序只能访问执行其工作所需的组件, 而不能访问其他组件. 这将创建一个非常安全的环境, 在该环境中, 应用程序无法访问未获得其权限的系统部分.  
然而还是有一些方式可以在 app 间共享数据文件, 或者访问系统服务:    
* 可以安排两个应用程序共享相同的 Linux 用户 ID，在这种情况下，它们可以访问彼此的文件。 为了节省系统资源，具有相同用户 ID 的应用程序还可以安排在相同的 Linux 进程中运行并共享相同的 VM。 当然, 这些应用程序还必须使用相同的证书签名。  
*  app 可以向用户直接请求能否获取关于位置信息，照相机，蓝牙连接的权限

### App 组件

应用程序组件是 Android app 的基本组成部分。 每个组件都是系统或用户可以通过其进入您的应用程序的入口点。 有些组件依赖于其他组件。Google 的文档将组件分为了 4 大类, 每种类型都有不同的用途，并且具有不同的生命周期，该生命周期定义了如何创建和销毁组件: 

* Activities
* Services
* Broadcast receivers
* Content providers



  

 














原文: [Application Fundamentals](https://developer.android.com/guide/components/fundamentals)




 



