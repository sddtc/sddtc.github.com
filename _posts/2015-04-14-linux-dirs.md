---
layout: post
title: linux-dirs
categories: sddtc tech
tags: [linux, directive]
guid: urn:uuid:76552c5a-3e32-437a-9e49-ad545aa470b0
---


```vim
//nohup代表后台运行
nohup java -classpath $CLASS_PATH ${jarpath} &  

//查看磁盘使用情况
du -h --max-depth=1  
tar -xzf kafka_2.x.x.x.tgz //解压

//马上使/etc/profile文件生效
source /etc/profile

//利用nc进行文件的传输，用于本地和服务器之间
nc -l 4444 > kafka-demo-0.0.1-SNAPSHOT-bin.zip
//本地上传文件到服务器
nc server-IP 4444 < kafka-demo-0.0.1-SNAPSHOT-bin.zip

wc -l filename //统计文件行数

dpkg --get-selections|grep linux       //带有image的为系统内核

uname -a          //查看系统当前使用内核

//压缩zip
zip -r filename.zip ${filesdir}
//同时处理多个文件和目录，可以将它们逐一列出，并用空格间隔：
zip -r filename.zip file1 file2 file3 ${filesdir}

//hdfs文件download到本地
hdfs dfs -get ${hdfsFilePath} ${localPath}
hdfs dfs -copyToLocal ${hdfsFilePath} ${localPath}

//显示文件夹下所有文件的大小，按照M展示，并按照[数字]排序取出最大的前10  
du -s folder/* | sort -rn | head
//2
du -sh folder/* | sort -rn | head
```

####sed相关的知识  
[耗子的博客](http://coolshell.cn/articles/9104.html)
