---
layout: post
title: linux-dirs
categories: sddtc tech
tags: [linux, directive]
---

nohup代表后台运行  

```vim
nohup java -classpath $CLASS_PATH ${jarpath} &
```

查看磁盘使用情况  

```vim
du -h --max-depth=1
```

解压  

```vim
tar -xzf kafka_2.x.x.x.tgz
```

马上使/etc/profile文件生效  

```vim
source /etc/profile
```

利用nc进行文件的传输，用于本地和服务器之间  

本地上传文件到服务器:  

服务器端:  

```vim
nc -l 4444 > kafka-demo-0.0.1-SNAPSHOT-bin.zip
```

本地:

```vim
nc 服务器IP 4444 < kafka-demo-0.0.1-SNAPSHOT-bin.zip 
```

服务器到本地命令反过来即可  

统计文件行数  

```vim
wc -l filename
```
