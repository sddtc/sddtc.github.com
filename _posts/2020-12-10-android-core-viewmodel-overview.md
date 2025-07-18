---
title: "[Android Core] 再谈 ViewModel"
layout: post
categories: 移动端
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

❌ ViewModel 绝不能引用任何一个视图,  也不能引用 [Lifecycle 类](https://developer.android.com/reference/androidx/lifecycle/Lifecycle)，总之是不能引用任何可能包含对 `activity` 上下文有引用的类。  

`ViewModel` 对象是为了使 `Views` 或 `LifecycleOwners` 的实例寿命更长。这种设计还意味着你可以编写测试来更轻松地覆盖 `ViewModel`， 因为它不了解 `View` 和 `Lifecycle` 对象。  
`ViewModel` 对象可以_包含_ `LifecycleObserver`，例如 `LiveData` 对象。 但是 `ViewModel` 对象绝不能 _`observe`_ 有生命周期感知属性的可观察对象的更改（例如： `LiveData`）。     
如果 `ViewModel` 需要 `Application` 上下文（例如，查找系统服务），则可以扩展 `AndroidViewModel` 类， 并构造一个接收 `Application` 的构造函数，因为 `Application` 类扩展了 `Context`。  

~~记住了没~~  

#### ViewModel 的生命周期
`ViewModel` 对象作用的的范围是从获取 `ViewModel` 时传递给 `ViewModelProvider` 的整个生命周期范围。 `ViewModel` 会被保留在内存中直到其生命周期范围永久的消亡：对于 `Activity` 而言是当它完成的时候; 对于 `Fragment` 而言，是当它 `deteched` 的时候。  

![viewmodel-lifecycle](/media/img/viewmodel/viewmodel-lifecycle.png)

上面这张图说明了当一个 `Activity` 经历 `rotated`(屏幕旋转) 后结束时的各种生命周期状态。 它还在关联的 `Activity` 生命周期旁显示了 `ViewModel` 的生命周期。 它也同样适用于 `Fragment` 的生命周期。  

#### Fragments 之间的数据共享
通常一个 `Activity` 中的两个或更多 `Fragments` 需要相互通信。 想象这样一个场景:            
你有一个 `Fragment` 是允许用户从列表中选择一个项目，另一个 `Fragment` 显示了所选项目的内容。 这种情况绝非易事，因为两个 `Fragment` 都需要定义一些接口描述，并且 `Activity` 必须将这两个 `Fragments` 绑定在一起。 此外，两个 `Fragment` 都必须处理另一个 `Fragment` 尚未创建或不可见的情况。          
那么这个时候你该怎么办呢？ 你可以通过使用 `ViewModel` 对象解决这样的痛点。 `Fragments` 可以共享 `ViewModel` 来处理此通信，通过使用 `ViewModel` 的各种生命周期函数。 如以下示例代码所示：  

```kotlin
class SharedViewModel : ViewModel() {
    val selected = MutableLiveData<Item>()

    fun select(item: Item) {
        selected.value = item
    }
}

class MasterFragment : Fragment() {

    private lateinit var itemSelector: Selector

    // Use the 'by activityViewModels()' Kotlin property delegate
    // from the fragment-ktx artifact
    private val model: SharedViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        itemSelector.setOnClickListener { item ->
            // Update the UI
        }
    }
}

class DetailFragment : Fragment() {

    // Use the 'by activityViewModels()' Kotlin property delegate
    // from the fragment-ktx artifact
    private val model: SharedViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        model.selected.observe(viewLifecycleOwner, Observer<Item> { item ->
            // Update the UI
        })
    }
}
```

我们可以注意到的是，`MasterFragment` 和 `DetailFragment` 都持有 `SharedViewModel`。 这样，当每个 `Fragment` 都获得 `ViewModelProvider` 时，它们将收到相同的 `SharedViewModel` 的实例，该实例的作用范围将是展示给用户的那个 `Activity`。  

使用这种方法具有以下优点：    
* `Activity` 无需执行任何操作也无需了解此通信。  
* 除了都持有 `SharedViewModel` 之外，`Fragments` 之间也不需要过多的了解彼此的细节。 如果其中一个 `Fragment` 消失了，则另一个 `Fragment` 仍然可以继续照常工作。
* 每个 `Fragment` 都有自己的生命周期并且不受另一个 `Fragment` 的生命周期影响。 如果一个 `Fragment` 替换了另一个 `Fragment`， 则 UI 可以继续工作而不会出现任何问题。

#### Replacing Loaders with ViewModel
像 `CursorLoader` 这样的 Loader 类经常用于使应用程序 UI 中的数据与数据库保持同步。 你可以使用 ViewModel 和其他一些类来替换这种 Loader 类。 使用 ViewModel 可将 UI 控制器与数据加载的操作分离开来，这意味着类之间的强引用会变少。    
在使用 `loader` 程序的一种常见方法中，应用程序可能会使用 `CursorLoader` 来观察数据库中的内容。 当数据库中的值发生更改时， `loader` 会自动触发数据的重新加载并更新 UI：  

![viewmodel-loader](/media/img/viewmodel/viewmodel-loader.png)

`ViewModel` 与 `Room` 和 `LiveData` 一起使用以替换 `loader`。 `ViewModel` 可以确保数据在设备配置更改后（例如旋转屏幕）仍然存在。 当数据库更改时，`Room` 会通知你的 `LiveData`，然后 `LiveData` 会使用修改后的数据更新 UI。  

![viewmodel-replace-loader](/media/img/viewmodel/viewmodel-replace-loader.png)  

#### Use coroutines with ViewModel
`ViewModel` 还包含了对 `Kotlin` 协程的支持

#### 更多的信息
随着数据变得越来越复杂，你可能会选择使用单独的类来加载数据。 `ViewModel` 的目的是为 UI 控制器封装数据，以使数据在配置更改后仍然可以被恢复。 所以如果你想要了解更多更多有关如何在配置更改后加载，保留和管理数据的信息，可以看看[这篇文章](https://developer.android.com/topic/libraries/architecture/saving-states)    

#### 一些相关的资源
* [Android Architecture Components basic sample](https://github.com/android/architecture-components-samples/tree/main/BasicSample)
* [Sunflower, a gardening app illustrating Android development best practices with Android Jetpack.](https://github.com/android/sunflower)




