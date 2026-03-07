---
title: Android KTX【卡通侠神马的
date: 2021-01-11
tags: [mobile]
categories: [工程实践]
---

Android KTX 是一组 Kotlin 扩展库。它被包含在 Android Jetpack 和其他 Android 库中。 KTX 扩展为 Jetpack，Android 平台和其他 API 提供简洁的，地道的 Kotlin
语言用法。为此，这些扩展利用了以下几种 Kotlin 的语言功能：
* Extension functions
* Extension properties
* Lambdas
* Named parameters
* Parameter default values
* Coroutines

举例来说，当你想要修改 `SharedPreferences` 中的某个属性时你必须先创建一个编辑器，之后还要 `apply/commit` 你的改动：

```kotlin
sharedPreferences
        .edit()  // create an Editor
        .putBoolean("key", value)
        .apply() // write to disk asynchronously
```

而在这个 🌰 中，Kotlin Lambda 就非常适合于该场景。它们允许你采用更简洁的方法：在创建编辑器之后传入代码块以执行，让代码自己执行，然后让 `SharedPreferences API` 自动应用更改。
这是一个 Android KTX Core 功能之一的示例：`SharedPreferences.edit`。它向 `SharedPreferences` 添加了一个编辑函数。 该函数将一个 `optional` 的布尔值作为其第一个参数，指示是否要提交或应用更改。
它还以 `lambda` 形式接收要在 `SharedPreferences` 编辑器上执行的操作。

```kotlin
// SharedPreferences.edit extension function signature from Android KTX - Core
// inline fun SharedPreferences.edit(
//         commit: Boolean = false,
//         action: SharedPreferences.Editor.() -> Unit)

// Commit a new value asynchronously
sharedPreferences.edit { putBoolean("key", value) }

// Commit a new value synchronously
sharedPreferences.edit(commit = true) { putBoolean("key", value) }
```

调用者可以选择是 `apply/commit`。 操作 `lambda` 本身是 `SharedPreferences.Editor` 上的一个匿名函数，该函数返回 `Unit`。也就是没有返回值。
最后，`SharedPreferences.edit()` 签名包含 `inline` 关键字。 此关键字告诉 `Kotlin` 编译器，每次使用该函数时，都应复制并粘贴（或内联）该函数的已编译字节码。 这样避免了每次调用此函数时为每个操作实例化新类的开销。

这种使用 `lambda` 传递代码，应用于具有可被覆盖的默认值以及使用内联扩展功能将这些行为添加到现有 `API` 的模式是 `Android KTX` 库提供的典型增强功能。
