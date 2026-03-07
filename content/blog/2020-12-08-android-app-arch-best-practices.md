---
title: 最佳实践什么的 可太有魅力了
date: 2020-12-08
tags: [mobile]
categories: [工程实践]
---


> Programming is a creative field, and building Android apps isn't an exception.

👏 编程是一个极具创造性的领域，构建 Android 应用程序也不例外呢。


## Mobile 的用户体验
在大多数情况下，桌面应用程序都只有一个单一的入口点来进入桌面应用程序，而后作为整体的进程运行。 相对而言 Android 应用程序要复杂得多。 典型的 Android 应用程序会包含多个应用程序组件：Activities, Fragments, Services, Content Providers 和 Broadcast Receivers 有关他们的概念请见[这里](https://www.sddtc.florist/sddtc/2020/12/01/android-core-applications-fundamentals.html)。

你可以在应用程序的 app manifest 中声明这些组件， 之后 Android 系统使用 manifest 文件来决定如何将您的应用程序集成到安卓设备的整体用户体验中。 一个能正常工作的 Android 应用程序往往包含多个组件，而且用户经常在短时间内与多个应用程序进行交互，因此应用程序需要适应/处理不同类型的用户驱动的交互行为和任务。

举例来说，当你在自己喜欢的一款社交网络应用里分享一张照片，那么都会发生什么呢？ ：）

1.  该应用试图访问手机的照相机功能。这时，Android 系统会启动相机应用程序来处理该请求。 与此同时，用户其实已经离开了社交网络应用，但是这种切换体验仍然是无缝的。
2. 相机应用在被使用的过程中，用户可能还会触发其它的功能，例如启动文件选择器，这可能会启动另一个应用（文件管理应用）。
3. 最终照片拍摄/从相册中选取完毕之后，用户会返回到社交网络应用并分享出一张自己满意的照片。

在整个过程中，用户都可能被电话或各种应用的通知所打扰。在这些中断操作后，用户仍希望能返回到社交应用中并恢复分享照片的用户旅程里。 总而言之，这种应用程序跳跃行为在移动设备上是很常见的，因此您的应用程序必须能够正确处理这些情景。
然而需要记住的是，移动设备也会受到资源（例如内存）的限制，因此操作系统可能会随时终止某些应用程序进程，以便为新进程腾出空间。
于是在这种环境下，您的应用程序组件可能会有个别无序的启动方式，而操作系统或用户可以随时销毁它们。由于这些事件不受你的控制，因此你不应在应用程序组件中存储任何应用程序的数据或状态，并且应用程序组件之间也不应该相互依赖。

## 通用的两个设计原则
那么你也许会有一个疑问 🤔️， 如果不应该使用应用程序组件来存储应用程序数据和状态，那么该如何设计应用程序？

### 关注点分离
遵循的最重要原则是关注点分离([SoC](https://en.wikipedia.org/wiki/Separation_of_concerns))。
将所有代码都实现在一个 Activity 或 Fragment 中是一个常见的错误。这些基于 UI 的类应仅包含处理 UI 和操作系统交互的逻辑。通过使这些类尽可能精简，可以避免许多与生命周期相关的问题。
⚠️请记住，你不应该尝试拥有任何有关 Activity 和 Fragment 的实现；相反的，他们只是一些 Android 操作系统与你的应用之间协同的粘合类。操作系统可以根据用户交互或由于内存不足等系统状况而随时销毁它们。为了提供令人满意的用户体验和更可管理的应用程序维护体验，最好最大程度地减少对它们的依赖。

### 从模型驱动 UI
另一个重要原则是，你应该从模型（最好是持久性模型）驱动 UI。模型是负责处理应用程序数据的组件。它们独立于应用程序中的 View 对象和应用程序组件，因此不受应用程序生命周期和相关问题的影响。

Persistence 是一个理想的状态，原因如下：
* 如果 Android 操作系统销毁了你的应用以释放资源，你的用户并不会丢失数据。
* 如果网络连接不稳定或不可用，你的应用程序仍将继续运行。

通过将你的应用基于模型类承担明确定义的数据管理职责，你的应用将更具可测试性和一致性。

## 最佳实践

### Avoid designating your app's entry points—such as activities, services, and broadcast receivers—as sources of data.
> 避免将应用程序的入口 (Activities, Services 和 Broadcast receiver) 指定为数据源

相反的，它们仅应与其他组件协调工作，来获取与该程序入口所需要的相关的数据子集。 每个应用程序组件的寿命都很短： 他们取决于用户的操作，和基于 Android 系统的当前的运行情况。

### Create well-defined boundaries of responsibility between various modules of your app.
> 在应用程序的各个模块之间创建明确定义的职责范围。

举例来讲，尽量避免在代码中的多个类/包中均定义从网络请求中加载数据的逻辑片段。 同样，不要在同一个类中定义多个无关的职责，例如数据缓存和数据绑定。

### Expose as little as possible from each module.
> 尽可能少的暴露每个模块。

不要轻易暴露一个模块的内部实现细节，哪怕你认为自己只会这样做一次/只有这一个。 你确实可能会在短期内获得一些好处，但是随着代码的发展，你将不得不同样收获一些技术债。

### Consider how to make each module testable in isolation.
> 考虑如何使每个模块独立地可测试。

举例来说，拥有定义明确的可从网络请求中获取数据的 API，可以使将数据持久化在本地数据库中的模块的测试变得更加轻松。 相反，如果您将来自这两个模块的逻辑混合写在一起，或者将网络请求逻辑代码分布在整个代码库中，则使得测试会变得更加困难，甚至不具有可测试性。

### Focus on the unique core of your app so it stands out from other apps.
> 专注于您应用程序的独特核心，使其在其他应用程序中脱颖而出。

不要一次又一次地写相同的样板代码来重新发明轮子。 相反，将时间和精力集中在使您的应用与众不同的方面，让 Android Architecture Components 和其他推荐的库来辅助你处理功能重复的部分。

### Persist as much relevant and fresh data as possible.
> 尽可能多的展示足够新鲜的数据。

如果坚持这个实践，即使用户的设备处于离线模式，用户也可以正常享受你的应用程序所提供的功能。 请记住，并非所有用户的网络都永远是稳定并且快速的。

### Assign one data source to be the single source of truth.
> 持有一个单一数据源， 坚持 single source of truth.

每当您的应用程序需要访问这些数据时，它都应始终源自这一单一的数据源。


本文译自 [jetpack-best-practices](https://developer.android.com/jetpack/guide#best-practices)
