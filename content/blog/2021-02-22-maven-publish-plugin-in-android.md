---
title: 使用 Gradle 插件发布 Android library 到 maven 远程仓库
date: 2021-02-22
tags: [mobile]
categories: [工程实践, 技术开发]
---

最近在项目里更新了 `gradle` 插件到 `6.1.1` 之后发现它支持使用 `maven-publish` 这个插件来打包发布并部署到 `maven` 的内部远程仓库去。简单记录下，希望能帮助到需要的人。

之前项目使用 `maven` 的 `uploadArchives`:

<script src="https://gist.github.com/sddtc/5150832cf51d4dd439d8ec7d1c2d6403.js"></script>

这种方式没什么问题，一直都可以运行的很好。 如果不是遇见了一些问题，在繁忙的日常你很难跑去更新工作得好好滴东西 😑
我们的 Android 项目是基于 `Kotlin` 的 `Koin` + `apollo-android` 的 `MFE` 架构。 项目使用的一些第三方依赖很新，他们更新版本的速度真的惊人 😳
直到有一天在我试图将 `apollo-android` 从 `2.3.1` 升级到 `2.4.2` 时发现打包发布失败了。 堆栈错误信息:

```bash
> Task uploadArchives FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task 'uploadArchives'.
> Could not publish configuration 'archives'
   > Cannot publish artifact 'metadata.json' (/Users/xxx/app/build/generated/metadata/apollo/debugAndroidTest/service/metadata.json) as it does not exist.

* Try:
Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Exception is:
org.gradle.api.tasks.TaskExecutionException: Execution failed for task 'uploadArchives'.
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.lambda$executeIfValid$1(ExecuteActionsTaskExecuter.java:205)
        at org.gradle.internal.Try$Failure.ifSuccessfulOrElse(Try.java:263)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeIfValid(ExecuteActionsTaskExecuter.java:203)
        at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:184)
        at org.gradle.api.internal.tasks.execution.CleanupStaleOutputsExecuter.execute(CleanupStaleOutputsExecuter.java:109)
        at org.gradle.api.internal.tasks.execution.FinalizePropertiesTaskExecuter.execute(FinalizePropertiesTaskExecuter.java:46)
        at org.gradle.api.internal.tasks.execution.ResolveTaskExecutionModeExecuter.execute(ResolveTaskExecutionModeExecuter.java:62)
...
```

于是去查看了相关的 `issues`, 果然也有人遇见了同样的问题。
说到这个我真的忍不住吐槽最近更新了我的手机 `Google Camera` app，直接导致前置摄像头打不开害闪退 🙃， 去 `Goggle Play` 商店查看评论发现大家都遇到了同样的问题。。
也是万万妹想到大公司也会出现这么致命的问题 = =。。 因为这个 `Crush` 最近真的开机支付连脸部识别都失效，哎。如果不是真爱，~~谁会用 Android 机啊~~咳咳。
扯远了，回到正题来说，出现异常的原因是 `apollo-android` 试图在 [这一行](https://github.com/apollographql/apollo-android/blob/main/apollo-gradle-plugin/src/main/kotlin/com/apollographql/apollo/gradle/internal/ApolloPlugin.kt#L91) 为
`UnitTests/AndroidTests` 添加 `metadata.json`。 但是很有可能项目的 `UnitTests/AndroidTests` 中 `metadata.json` 是不会被生成的。因为通常这些目录不会有 `graphql` 相关的文件。

#### 为了解决这个问题其实有两个方案：
* 用 `maven-publish` 插件来替代 `maven` 插件打包发布吧，用过的人都说好！不仅能解决问题，它还是 Google 官网推崇滴打包方式嗷！
* 如果你就是要用 `maven` 的 `uploadArchives` 打包，那就只能等这个问题被修复, 或者你一直使用没有问题的 `2.3.1` 版本就好

然而回到一开始，他们更新版本的速度之快一方面修复了一些 bug, 修复了一些 issue, 更有可能修复一些安全隐患，所以升级是必要的。 ~~更新了之后前置摄像头更新坏了也是有概率发生的~~
更新的脚本非常简单，因为 `maven-publish`  插件非常强大:

<script src="https://gist.github.com/sddtc/4a6bfb152ac332cad1931555bda7bc17.js"></script>

#### 有几点需要注意:
* 将 `publishing` 放在 `afterEvaluate` 生命周期函数里
* `release(MavenPublication)` 的 `release` 可以是任何有意义的名字，它和生成的 Task 名字有关

### 接下来我们简单说下细节

![2021-02-23-4YWFw1-BZNhGU](https://cdn.jsdelivr.net/gh/sddtc/upic-cloud@main/images/2021/2021-02-23-4YWFw1-BZNhGU.png)

#### 发布什么
`Gradle` 需要知道要我们在发布时需要哪些文件和信息。 通常是 `artifacts` 和 `metadata` 的集合， `Gradle` 将其定义为 `publication` 。

举例来说, 你打包发布到远端 `maven` 仓库的内容可以包括:
* 一个或多个 `artifacts`（通常由项目构建）
* `metadata` 文件，用来描述发布的组件
* `pom` 文件, 标识主要的 `artifacts` 及其第三方依赖库。 主要的 `artifact` 通常是项目的生产 `jar` 包， 辅助的可能由 `-sources` 和 `-javadoc` 的 `jar` 组成。

另外，`Gradle` 还会发布上述所有内容的校验和，并在配置时发布签名。从 `Gradle 6.0` 开始，多了 `SHA256` 和 `SHA512`  的校验和文件。

代码示例:

```bash
...
task androidSourcesJar(type: Jar) {
    archiveClassifier.set('sources')
    from android.sourceSets.main.java.source
}

publishing {
        publications {
            release(MavenPublication) {
                from(components["release"])
                pom {
                    groupId = 'sddtc-company-v-'
                    version = '1.0.0'
                    artifactId = 'app-name'
                }
                artifact(androidSourcesJar)
            }
        }
...
}
```

#### 发布到哪里
`Gradle` 需要知道在发布的存储库地址。 该存储库提供了各种组件。 `Gradle` 需要与远程仓库进行交互，因此我们必须提供存储库的类型及其位置。

代码示例:

```bash
repositories {
    maven {
        credentials {
            username getRepositoryUsername()
            password getRepositoryPassword()
        }
        url getRepositoryUrl()
        println("> Configure maven repo: ${url}")
    }
}
```

#### 发行方式你会选择哪种
`Gradle` 会自动为发布和存储库的所有可能组合生成发布任务(除了贴心还能说啥)，从而使我们可以将任何组件发布到任何存储库。
如果要发布到 `maven` 存储库，则 `Task` 的类型为 `PublishToMavenRepository`，而对于 `Ivy` 存储库，任务的类型为 `PublishToIvyRepository`。

代码示例:

```bash
#!/bin/bash
set -xeuo pipefail

echo "+++ :buildkite: Publishing library to maven"
./gradlew clean publishReleasePublicationToMavenRepository
```






