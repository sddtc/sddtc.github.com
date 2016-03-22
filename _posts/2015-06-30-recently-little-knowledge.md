---
layout: post
title: "近期指令与概念总结"
date: "2015-06-30"
categories: sddtc tech
tags: [storm, kafka]
guid: urn:uuid:77290b8e-e34e-44cd-b084-99ad330e2d96
---

* spout 龙卷，读取原始数据为bolt提供数据  
* bolt 雷电，从spout或其它bolt接收数据，并处理数据，处理结果可作为其它bolt的数据源或最终结果  
* nimbus 雨云，主节点的守护进程，负责为工作节点分发任务。  

* topology 拓扑结构，Storm的一个任务单元  
* define field(s) 定义域，由spout或bolt提供，被bolt接收  

本地运行storm,kafka,zookeeper  
storm的lib包下面需要放zookeeper.jar  

- transient
- storm分发策略
- hdfs文件切分策略
- hdfs主从切分写入流转换
- 其它
  - kafka消费-log4j
  - FileSystem java API

* * *

**hdfs可以写入hdfs文件系统，也可以将流直接写入本地文件**

You can get the FileSystem by the following way:

```java
Configuration conf = new Configuration();
Path path = new Path(stringPath);
FileSystem fs = FileSystem.get(path.toUri(), conf);

```

You do not need to judge if the path starts with hdfs:// or file://. This API will do the work.  

**Kafka常用查看topic的命令**  

查看某个topic的信息  

```vim
bin/kafka-topics.sh --describe --zookeeper IP1:2181,IP2:2181,IP3:2181 --topic TOPICNAME
```

作为consumer从beginning处消费  

```vim
bin/kafka-console-consumer.sh --from-beginning --topic TOPICNAME --zookeeper IP1:2181,IP2:2181,IP3:2181
```

list当前的topics  

```vim
bin/kafka-topics.sh --list --zookeeper IP1:2181,IP2:2181,IP3:2181
```

*storm-hdfs* 可以写入本地，只要fsurl指定前缀为file://  
另外它的流是org.apache.hadoop.fs.FSDataOutputStream  
