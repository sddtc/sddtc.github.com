---
title: Fundamentals 是基本原理的意思
tags: mobile
date: 2020-12-01
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

#### Activities

Activity 是和用户交互的入口。 它可以用一个单一的 app  屏幕来提供用户交互。 例如， 一个邮件 app 可以有一个 Activity 用来展示用户的新邮件列表，有一个 Activity 用来写邮件，再有一个 Activity 用来读取邮件。 尽管这些活动可以共同协作以在电子邮件 app 中形成极具凝聚力的用户体验，但是每个 Activity 都是彼此独立的。 例如，如果该邮件 app 支持其它 app 打开它，那么它可以选择打开这三种 Activity 的其中之一。 例如，一个拍照 app 可以允许用户分享照片：以邮件的内容的形式分享。 一个 Activity 促进了系统和 app 之间的以下关键交互:

* 持续的跟踪用户当前关心的内容（屏幕上显示的内容），以确保系统继续运行该进程
* 可以知道先前使用的进程有哪些 （包含用户可能会返回的 app Activity（生命周期已经是停止状态），因此可以更加优先地保留这些进程
* 帮助 app 处理其进程，使用户可以恢复到先前状态的活动
* 为 app 提供一种在彼此之间实现用户 flow 的方式，并为系统提供一种协调这些 flow 的方式（最经典的例子是共享）

#### Services

Service 是一个出于通用原因的入口，用于保持 app 在后台运行。 它以组件的形式在后台运行以执行需要长时间的操作，或为远程进程执行工作。 Service 不提供用户交互。 例如，当用户的手机打开其它 app 时， Service 可以仍然在后台为用户播放音乐， 或从远端请求数据。 另一个组件（例如 Activity）可以启动 Service，并使其运行或绑定到该 Service，以便与其进行交互。 实际上，有两个截然不同的语义 Services 告诉系统如何管理 app：启动的 Services 告诉系统使它们保持运行状态直到工作完成。 这可能是为了在后台同步某些数据，或者甚至在用户离开应用程序后播放音乐。在后台同步数据或播放音乐也代表两种不同类型的已启动 Services，这些服务会修改系统处理它们的方式：

* 音乐播放是用户知道的事情，因此 app 可以主动发通知给用户来表明希望自己能一直在系统中保持活跃状态。 在这种情况下，系统知道应该尽力保持该 Service 的进程运行，因为如果服务终止用户会不满意。
* 常规的后台 Service 并不是用户能直接知道的正在运行的服务，因此系统在管理其进程方面具有更大的自由度。 如果它需要 RAM 来处理用户更直接关心的事情则可以终止它（然后在以后的某个时间重新启动该 Service）

绑定的那些服务之所以都在运行状态，是因为其他某个 app（或系统）已经表示要使用该服务。一般情况是 service 向另一个进程提 API 服务。因此系统知道这些进程之间存在依赖性。 如果进程 A 绑定进程 B 中的 Service，则它知道它需要使进程 B （及其 Service）保持为 A 运行。此外，如果进程 A 是某种用户关心的事，那么它也知道将进程 B 同样视为用户关心的事。 由于 Services 的这些灵活性（无论好坏），对于所有更高级别的系统概念而言，Service 已成为非常有用的构建块： 动态壁纸，通知监听器，屏幕保护程序，输入法，可访问性服务以及许多其他核心系统功能都是作为 app 实现的 Services 构建的，系统在应该运行他们的时候绑定这些服务。

#### Broadcast receivers

Broadcast receiver 是使系统能够将事件传递到 app 的组件，该事件不受用户 flow 的限制，从而使 app 能够响应系统范围的广播公告。 由于 Broadcast receiver 是 app 中另一个定义明确的入口，因此系统甚至可以将广播传送到当前未运行的应用程序。 例如，app 可以定义警报并以通知的形式发布，以通知用户即将发生的事件... 并通过将该警报传递给 app 的 Broadcast receiver，所以在 app 收到该报警前没有必要一直保持运行状态。
许多 Broadcast receiver 都来自系统本身。例如，通知屏幕即将关闭，电池电量不足或拍摄了图片。 app 还可以初始化广播，例如，让其他 app 知道某些数据已下载到设备上，可供他们使用。
尽管 Broadcast receiver 也没有用户交互界面，但它们可以在发生广播事件时通过创建状态栏通知来提醒用户。 然而更常见的是，Broadcast receiver 只是通向其他组件的 _gateway_ - 旨在做很少的工作。 例如，它可以安排事件 JobService 来根据 JobScheduler 事件执行一些工作。

#### Content providers

Content provider 用于管理一系列的可共享的 app 数据。 你可以将其存储在文件系统，SQLite数据库，存储在 Web 端或 app 可访问到的任何其他持久性存储位置中。 通过 Content provider 其它 apps 可以查询/更新相关数据。 例如，Android 系统提供了一个 Content provider，用于管理用户的通讯录。 那么具有相关权限的任何 app 都可以通过 Content provider 查询通讯录数据，例如**ContactsContract.Data**，以读取和写入有关特定人员的信息。
将 Content provider 视为数据库的抽象是很聪明的想法，因为它通常内置了许多 API 和相关的支持。 然而从系统设计的角度来看它具有另一个重要的目的： 对于系统而言，Content provider 是 app 的入口点，用于发布由 URI 标识的数据项。 因此 app 可以决定如何将其包含的数据映射到 URI 命名空间，并将这些 URI 分发给其他实体，这些实体又可以使用它们来访问数据。这使系统可以在管理 app 中做一些特殊的事情：

* 分配 URI 并不需要 app 保持运行状态，因此 URI 可以在其持有 URI 的 app 退出后继续存在。 系统仅需确保该 app 必须从相应的 URI 检索 app 的数据时仍在运行即可。
* 这些 URI 还提供了重要的细粒度的安全模型。 例如，一个  app 可以将其具有的图像的 URI 放置在剪贴板上，但是将其 Content provider 锁定为锁定状态以便其他 app 无法自由访问该 URI。 当第二个 app 尝试访问剪贴板上的该 URI 时，系统可以允许该 app 通过临时 URI 权限授予来访问数据，以便仅允许该 URI 后面的数据访问，而依然不会拥有其他任何访问权限。

Content provider 对于读取和写入关于你的 app 的私有未共享的数据同样也很有用。

Android 系统设计的一个独特方面你应该在上面的文章中了解到了， 它允许任何 app 都可以启动另一个 app 的组件。例如，如果您希望用户使用设备相机拍摄照片，则可能有另一个应用程序可以执行此操作，而您的 app 可以使用它来代替自己去开发一个 Activity 来用于拍摄照片。你无需侵入甚至链接到相机 app 中的代码中。你只需在捕获照片的相机 app 中启动 相应的 Activity 即可。完成后，拍摄好的照片会呈现在你的 app 中以便你使用。对于用户来说相机拍摄功能“似乎”实际上是你自己的 app 的一部分。

当系统启动一个组件时，如果该组件相关的代码还未实例化/未初始化/并不是运行状态，则会首先启动该 app 的进程，并实例化该组件所需的类。 例如，如果你的 app 在捕获照片的相机 app 中启动 Activity，则该 Activity 将在属于相机 app 的进程中运行，而不是在你的 app 的进程中运行。 因此与大多数其他系统上的 app 不同，Android app 没有单一的入口点（没有 **main()** 函数）。

由于每个 app 运行在系统中独立的每个进程里，并且文件权限限制了对其他 app 的访问，因此你的 app 无法直接从另一个 app 激活组件。 然而 Android 系统可以做到。 所以若要激活另一个 app 中的组件，请向系统发送一条消息，指定你启动特定组件的意图。 这样，系统会为你激活相应的组件。

#### Activating components

在上面介绍的四大组件中，有三个 (`activities, services, and broadcast receivers`) 的激活方式是通过 `intent` 这种异步消息来激活。 `Intents` 在运行时将各种独立的组件进行绑定。你可以将它们想象为请求其他组件执行操作的 `messengers`，无论该组件属于你的 app 还是其他 app。

用 `Intent` 对象创建一个 `intent`，该对象定义了一条消息以激活特定组件(_explicit intent_)或特定类型的组件(_implicit intent_).

对于 Activities 和 Services，`intent` 定义了要执行的动作（例如，查看/发送内容），并且可以指定要执行操作的数据的 URI，其中还可包括正在启动的组件可能需要了解的其他内容。例如，一个 `intent` 可能传递一个活动请求以显示图像或打开网页。在一些情况下，你可以启动 Activity 来接收结果，在该情况下，活动还会以 `Intent` 返回结果。例如，您可以发布 `intent` 让用户选择个人联系人并将其返回给你。返回 `intent` 包括指向所选联系人的 URI。

对于 broadcast receivers，此 `intent` 仅定义正在广播的公告。例如，指示设备电池电量低的广播仅包括指示电池电量低的已知操作字符串。

与 _Activities, Services, and Broadcast receivers_ 不同, _Content providers_ 不会被 `intent` 激活。它们被 ContentResolver 的请求作为目标时激活。 _content resolver handlers_ 与 _Content providers_ 的所有直接交互，通过调用 ContentResolver 对象上的方法。这就在 _Content providers_ 和请求信息的组件之间保留了一层抽象（出于安全性考虑）。
















原文: [Application Fundamentals](https://developer.android.com/guide/components/fundamentals)








