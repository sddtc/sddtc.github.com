---
title: datanode存储空间溢出解决
date: 2015-04-20
tags: 大数据
---

今天遇到了一个关于cdh集群的hadoop问题
其中一个datanode的存储空间突然接近满溢，还没查出来问题
日志有报错
比其它datanode多出来将近150G
应该是日志中一台报错之后，数据均衡分布出现了偏差
start-balance.sh脚本没找到


问题解决：
机器添加hadoop之后，没有进行balance，以至于出现这种磁盘分配不均的问题
cdh的hdfs命令可以进行dn的blk均衡move

```vim
sudo -u hdfs hdfs balancer -threshold 5
```
