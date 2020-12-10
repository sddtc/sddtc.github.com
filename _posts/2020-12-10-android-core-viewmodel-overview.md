---
title: "[Android Core] 再谈 ViewModel"
layout: post
categories: sddtc tech
date: "2020-12-10"
guid: urn:uuid:4b5d1b0f-7ffe-48b6-9947-b763ab21cedb
tags:
  - android
---


#### 背景知识

设计 [ViewModel](https://developer.android.com/reference/androidx/lifecycle/ViewModel) 类的目的是为了以生命周期的方式来存储和管理 Android 应用中和 UI 相关的数据的。它帮助应用程序可以在屏幕旋转的时候仍然持有相关的数据， 换句话说， 想象一下你的应用程序可以显示出一个计数器并且可以点击一个按钮使它的值可以做加一操作，如果没有任何多余的代码逻辑处理， 当你旋转屏幕，你的应用界面适应了横屏模式，那么显示出来的累加值可能就会被清零了 😊， 因为数据的状态没有被正确的恢复。  

Android 框架负责管理 UI 控制器的生命周期，例如 Activities 的和 Fragments 的。 为了响应设备的事件或用户的操作, Android 框架本身可能会选择销毁或重新创建 UI 控制器， 而这些行为都不在你的控制之内。  

如果系统销毁或重新创建 UI 控制器，那么你存储在其中的所有与 UI 相关的临时数据都将丢失。 例如某个 Activity 包含了一个用户列表数据。 当配置更改了(例如旋转了屏幕)导致 Activity 被重新创建，那么该新创建出来的 Activity 必须重新获取用户列表。   对于结构简单数据， Activity 可以使用 `onSaveInstanceState()` 方法并从 `onCreate()` 中的 `bundle` 中还原其数据。 然而⚠️，此方法仅适用于可以先序列化然后反序列化的少量数据，而不适合潜在的大量数据： 例如用户列表或位图数据。  

另一个问题是，UI 控制器经常需要进行异步调用，那么这意味着请求可能需要一些时间才能返回。 UI 控制器需要管理这些调用，来确保系统在销毁后能将其清除以避免潜在的内存泄漏。 这种管理的维护工作相对而言非常昂贵，当配置更改了(例如旋转了屏幕)导致 Activity 被重新创建实际上也造成了资源的浪费： 因为对象可能不得不重新发出已经发出的调用。  

最后， UI 控制器（例如 Activities 和 Fragments）的指责已经很多了，比如说，显示 UI 数据，再比如说，对用户交互动作做出反应，另外还要处理操作系统的通信（例如权限请求）。 那么你若是还要 UI 控制器负责从数据库或网络加载数据是不是有点过分了咳咳。 它会给类增加膨胀的负担。 将过多的职责分配给 UI 控制器可能会导致一个类尝试单独处理应用程序的所有工作，而不是将工作委派给其他类。 以这种方式给 UI 控制器分配过多的责任也使测试变得更加困难。(永远不要忘了程序的可测试性 🐷)。

综上所述， 从 UI 控制器中分离视图数据的所有权更高效更简洁。  

#### 一个 ViewModel 的实现
Architecture Components 为 UI 控制器提供 ViewModel helper 类，该类负责为 UI 准备数据。 ViewModel 对象会在配置更改期间(例如屏幕旋转)自动保留，以便它们保存的数据可立即用于下一个 `Activity/Fragment` 的实例。   
举例来讲，如果你需要在应用程序中显示一个用户列表，那么请保证你所获取并保留用户列表的实现逻辑处在 ViewModel 中，而不是 `Activity` 或者 `Fragment`，如以下示例代码所示：

```kotlin
class MyViewModel : ViewModel() {
    private val users: MutableLiveData<List<User>> by lazy {
        MutableLiveData().also {
            loadUsers()
        }
    }

    fun getUsers(): LiveData<List<User>> {
        return users
    }

    private fun loadUsers() {
        // Do an asynchronous operation to fetch users.
    }
}
```

而你的 `Activity`:  

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Create a ViewModel the first time the system calls an activity's onCreate() method.
        // Re-created activities receive the same MyViewModel instance created by the first activity.

        // Use the 'by viewModels()' Kotlin property delegate
        // from the activity-ktx artifact
        val model: MyViewModel by viewModels()
        model.getUsers().observe(this, Observer<List<User>>{ users ->
            // update UI
        })
    }
}
```

如果 一个 `Activity` 被重新创建了，那么它会接收到与第一个  `Activity`  所创建出来的 `MyViewModel` 实例。 当 `Activity ` 完成它的工作之后，框架将调用 ViewModel 对象的`onCleared()` 方法，以便清理资源。  

❌ViewModel 绝不能引用任何一个视图,  也不能引用[Lifecycle 类](https://developer.android.com/reference/androidx/lifecycle/Lifecycle)，总之是不能引用任何可能包含对 `activity` 上下文有引用的类。  

~~记住了没~~



