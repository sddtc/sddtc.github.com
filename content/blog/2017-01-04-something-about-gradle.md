---
title: 关于 Gradle 打 jar 包解决方案
date: 2017-01-04
tags: software engineer
---

感谢周围的人让我接触到了gradle,从此我要和maven说再见.
1. 用gradle打一个包含依赖的可运行Jar包.

```
apply plugin: 'application'
mainClassName= 'sddtc.gradle.APP'

task runnbaleJar(type: Jar) {
    from files(sourceSets.main.output.classesDir)
    from configurations.runtime.asFileTree.files.collect { zipTree(it) }
    manifest {
        attributes 'Main-Class': 	'sddtc.gradle.APP'
    }
}
```
说明: 这样打包并不包含配置文件,如logback.xml, 接下来我会实践一种优雅的打配置文件包方式.
今天我发现用 jar 命令就可以推翻上面的方式:
```vim
jar {
    baseName='sddtc-project'
    version='0.0.1'
    from configurations.compile.collect{it.isDirectory()?it:zipTree(it)}

    manifest {
        attributes 'Main-Class':'sddtc.gradle.APP'
    }
}
```
这样执行 gradle clean build. 打出来的jar包, 在 src/main/resources 内的配置文件会自动打包进来
