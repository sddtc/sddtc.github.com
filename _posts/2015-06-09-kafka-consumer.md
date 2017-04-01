---
layout: post
title: "[kafka]consumer的主要流程讲解。"
date: "2015-06-09"
categories: sddtc tech
tags: [kafka]
guid: urn:uuid:e38b6d76-e936-4a17-a1a7-55fea65e0e59
---

#### Consumer主要流程如下:  

1. 加载并解析命令行参数，唯一的必要参数(Required)是zookeeper
2. 如果没有传入group.id，ConsoleConsumer将生成自己的group.id，即console-consumer-[10万以内的一个随机数]
3. 创建ConsumerConfig用于封装consumer的各种配置
4. 创建默认的消息格式化类，其定义的writeTo方法会默认将消息输出到控制台
5. 创建ZookeeperConsumerConnector。Kafka使用它来创建KafkaStream消费流  
5.1. 创建本地缓存， 保存topic下每个分区的信息，包括该分区底层的阻塞队列，已消费的位移、已获取到的最新位移以及获取大小等  
5.2. 创建本地缓存，保存每个topic分区当前在zookeeper中保存的位移值  
5.3. 创建本地缓存，保存topic的每个读取线程底层对应的阻塞队列，主要用于关闭Connector时可以批量关闭底层的阻塞队列  
5.4. 生成consumer id，规则为[group.id]\_[主机名]\_[时间戳]\_[随机产生的一个UUID的前8位]。其中主机名就是运行ConsoleConsumer所在broker节点的主机名  
5.5. 创建获取线程管理器(ConsumerFetcherManager)  
5.6. 启动一个特定线程，用于定时地(默认是1分钟)向Zookeeper提交更改过的位移
6. 增加JVM关闭钩子，确保JVM关闭后资源也能够被释放
7. 创建KafkaStream并通过迭代器不断遍历该stream， KafkaStream的迭代器的底层实现包含一个阻塞队列，如果没有新的消息到来，该迭代器会一直阻塞，除非你显式设置了consumer.timeout.ms参数(默认是-1表示consumer会一直等待新消息的带来)
8. 每接收到一条新的消息，默认的消息格式化类会将其输出到控制台上。然后再次等待迭代器传过来的下一条消息

本质上来说，console consumer启动时会创建一个KafkaStream(可以简单翻译成Kafak流)，该stream会不停地等待可消费的新消息——具体做法就是通过LinkedBlockingQueue阻塞队列来实现


该内容来自  
[【原创】Kafka console consumer源代码分析(一)](http://www.cnblogs.com/huxi2b/p/4671925.html)
