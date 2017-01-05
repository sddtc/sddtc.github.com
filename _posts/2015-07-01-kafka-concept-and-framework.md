---
layout: post
title: "[Kafka]概念详解与架构特性"
date: "2015-07-01"
categories: sddtc tech
tags: [kafka]
guid: urn:uuid:52ea5e3d-c004-401d-ad63-a33c766eb7ce
---

##### 背景介绍  
**Kafka简介**  

Kafka是一种分布式的，基于发布/订阅的消息系统。  
主要设计目标如下：以时间复杂度为O(1)的方式提供消息持久化能力，即使对TB级以上数据也能保证常数时间的访问性能高吞吐率。即使在非常廉价的商用机器上也能做到单机支持每秒100K条消息的传输,支持Kafka Server间的消息分区，及分布式消费，同时保证每个partition内的消息顺序传输,同时支持离线数据处理和实时数据处理  

**Kafka/Jafka**  

Kafka是Apache下的一个子项目，是一个高性能跨语言分布式发布/订阅消息队列系统，而Jafka是在Kafka之上孵化而来的，即Kafka的一个升级版。具有以下特性：快速持久化，可以在O(1)的系统开销下进行消息持久化；高吞吐，在一台普通的服务器上既可以达到10W/s的吞吐速率；完全的分布式系统，Broker、Producer、Consumer都原生自动支持分布式，自动实现复杂均衡；支持Hadoop数据并行加载，对于像Hadoop的一样的日志数据和离线分析系统，但又要求实时处理的限制，这是一个可行的解决方案。Kafka通过Hadoop的并行加载机制来统一了在线和离线的消息处理。Apache Kafka相对于ActiveMQ是一个非常轻量级的消息系统，除了性能非常好之外，还是一个工作良好的分布式系统。  

##### Kafka解析    

Broker  
Kafka集群包含一个或多个服务器，这种服务器被称为broker  

Topic  
每条发布到Kafka集群的消息都有一个类别，这个类别被称为topic。（物理上不同topic的消息分开存储，逻辑上一个topic的消息虽然保存于一个或多个broker上但用户只需指定消息的topic即可生产或消费数据而不必关心数据存于何处）

Partition  
parition是物理上的概念，每个topic包含一个或多个partition，创建topic时可指定parition数量。每个partition对应于一个文件夹，该文件夹下存储该partition的数据和索引文件

Producer  
负责发布消息到Kafka broker

Consumer  
消费消息。每个consumer属于一个特定的consuer group（可为每个consumer指定group name，若不指定group name则属于默认的group）。使用consumer high level API时，同一topic的一条消息只能被同一个consumer group内的一个consumer消费，但多个consumer group可同时消费这一消息。


##### Kafka架构

一个典型的kafka集群中包含若干producer（可以是web前端产生的page view，或者是服务器日志，系统CPU、memory等），若干broker（Kafka支持水平扩展，一般broker数量越多，集群吞吐率越高），若干consumer group，以及一个Zookeeper集群。Kafka通过Zookeeper管理集群配置，选举leader，以及在consumer group发生变化时进行rebalance。producer使用push模式将消息发布到broker，consumer使用pull模式从broker订阅并消费消息。  

**Push vs. Pull**  

作为一个messaging system，Kafka遵循了传统的方式，选择由producer向broker push消息并由consumer从broker pull消息。一些logging-centric system，比如Facebook的Scribe和Cloudera的Flume,采用非常不同的push模式。事实上，push模式和pull模式各有优劣。  
push模式很难适应消费速率不同的消费者，因为消息发送速率是由broker决定的。push模式的目标是尽可能以最快速度传递消息，但是这样很容易造成consumer来不及处理消息，典型的表现就是拒绝服务以及网络拥塞。而pull模式则可以根据consumer的消费能力以适当的速率消费消息。  

**Topic & Partition**    

Topic在逻辑上可以被认为是一个在的queue，每条消费都必须指定它的topic，可以简单理解为必须指明把这条消息放进哪个queue里。为了使得Kafka的吞吐率可以水平扩展，物理上把topic分成一个或多个partition，每个partition在物理上对应一个文件夹，该文件夹下存储这个partition的所有消息和索引文件。
每个日志文件都是“log entries”序列，每一个log entry包含一个4字节整型数（值为N），其后跟N个字节的消息体。每条消息都有一个当前partition下唯一的64字节的offset，它指明了这条消息的起始位置。  
磁盘上存储的消费格式如下：  
message length ： 4 bytes (value: 1+4+n)  
“magic” value ： 1 byte   
crc ： 4 bytes  
payload ： n bytes  

这个“log entries”并非由一个文件构成，而是分成多个segment，每个segment名为该segment第一条消息的offset和“.kafka”组成。另外会有一个索引文件，它标明了每个segment下包含的log entry的offset范围。  

因为每条消息都被append到该partition中，是顺序写磁盘，因此效率非常高（经验证，顺序写磁盘效率比随机写内存还要高，这是Kafka高吞吐率的一个很重要的保证）。  

...


详情详见：[kafka的深度解析](http://www.xker.com/page/e2015/01/158138.html)
