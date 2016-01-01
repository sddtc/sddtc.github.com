---
layout: post
title: "【年度案例】Twitter高性能分布式日志系统架构解析"
date: "2015-12-29"
categories: sddtc tech
tags: [twitter, log]
---

本文是关于Twitter 分布式日志系统 DistributedLog/BookKeeper的摘要  
Manhattan（Twitter的最终一致性分布式Key/Value数据库）  

1.可以使用日志来序列化所有的请求。co-ordinator 将请求写到日志中。所有的 replicas 从日志中按顺序读取请求，并修改本地的状态。这种解决问题的思路叫做 Pub/Sub。而日志就是 Pub/Sub 模式的基础。  
2.当数据被复制到多台机器上的时候，我们就需要保证数据的强一致性。否则，如果我们出现丢数据、数据不一致，那么势必影响到构建在分布式日志上的所有系统。如果日志都不能相信了，你的生活还能相信谁呢 ：）  
3.为什么持久化 (durability)、多副本 (replication) 和强一致性 (consistency)，对我们来说这么重要呢？  
比如 Kestrel（用于在线系统）、Kafka（用于离线分析）这些系统都不支持严格的持久化，或者在支持持久化的情况下性能极差。它们采用定期回刷 (periodic flush) 磁盘或者依赖于文件系统 (pdflush) 来持久化数据。  
4.日志系统的核心负载可以归为三类：writes，tailing reads 和 catch-up reads。  
Writes 就是将数据追加到一个日志中，tailing reads 就是从日志的尾部读最新的东西，而 catch-up reads 则是从比较早的位置开始读日志（比如数据库中重建副本）。    
Writes 和 tailing reads 在意的是延时 (latency)，因为它关系到一个消息能多快地从被写入到被读到。
而 catch-up reads 在意的则是高吞吐量，因为它关系到是否能追赶到日志的尾部。  
在一个“完美”的世界中，系统应该只有两种负载，writes 和 tailing reads。而且大部分现有系统对于这两种负载可以很好地应付。  
但是，在现实世界里，这基本不可能。尤其在一个多租户的环境里，catch-up reads 通常成为影响系统的重要因素。   
举个例子，以流式计算为例，用户可能重启一个 topology。而这个 topology 可能从很早地位置开始大量读数据，从而引入大量的 catch-up reads。而这些 catch-up reads 在文件系统角度通常会表现为大批量的扫描，文件系统会进行大量的预读取到 Page Cache 里，从而挤掉最新的数据而影响写操作和 tailing read操作。  
在设计这个分布式日志系统 DistributedLog 的时候，我们进行了各种调研。也同时基于运维已有系统 (kestrel, Kafka) 的经验，我们最终决定基于 Apache BookKeeper进行构建。  
主要因为 Apache BookKeeper 提供的三个核心特性：I/O 分离、并行复制和容易理解的一致性模型。它们能够很好地满足我们对于持久化、多副本和一致性的要求。  

摘自：[【年度案例】Twitter高性能分布式日志系统架构解析](http://mp.weixin.qq.com/s?__biz=MzAwMDU1MTE1OQ==&mid=403051208&idx=1&sn=1694ac05acbcb5ca53c88bfac8a68856&scene=1&srcid=1224xZuQ9QQ4sRmiPVdHTppL#wechat_redirect)
