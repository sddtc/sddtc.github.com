---
layout: post
title: "storm-hdfs-java"
date: "2015-06-30"
categories: sddtc tech
---

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

