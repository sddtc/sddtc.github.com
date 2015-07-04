---
layout: post
title: "storm-hdfs-java"
date: "2015-06-30"
categories: sddtc tech
---

研究和实践总是很痛苦的一件事  
在此先总结一些遇见和用到的东西  

- transient
- storm分发策略
- hdfs文件切分策略
- hdfs主从切分写入流转换
- 其它
  - kafka消费-log4j
  - FileSystem java API

***

**hdfs可以写入hdfs文件系统，也可以将流直接写入本地文件**

You can get the FileSystem by the following way:

```
Configuration conf = new Configuration();
Path path = new Path(stringPath);
FileSystem fs = FileSystem.get(path.toUri(), conf);

```

You do not need to judge if the path starts with hdfs:// or file://. This API will do the work.