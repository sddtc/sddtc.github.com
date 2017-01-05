---
title: [Gradle]关于gradle的那些事
layout: post
guid: urn:uuid:ef8c2cbc-413b-41ad-91e1-03614b0627e5
date: "2017-01-04"
categories: sddtc tech
tags:
  - gradle
---

感谢周围的人让我接触到了gradle,从此我要和maven说再见.  

1.用gradle打一个包含依赖的可运行Jar包  

```vim 

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

说明:这样打包并不包含配置文件,如logback.xml,接下来我会实践一种优雅的打配置文件包方式