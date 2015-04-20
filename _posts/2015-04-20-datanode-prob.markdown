---
layout: post
title: "datanode相关的问题"
date: "2014-04-20"
---

今天遇到了一个关于cdh集群的hadoop问题
其中一个datanode的存储空间突然接近满溢，还没查出来问题
日志有报错
比其它datanode多出来将近100G
应该是日志中一台报错之后，数据均衡分布出现了偏差
start-balance.sh脚本没找到
