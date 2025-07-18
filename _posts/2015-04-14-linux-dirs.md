---
layout: post
title: "[Shell] tar & scp & du, etc.. 命令."
categories: 命令行
tags:
  - shell
guid: urn:uuid:76552c5a-3e32-437a-9e49-ad545aa470b0
---

### 压缩和解压

~~~vim
tar -xzf kafka_2.x.x.x.tgz //解压
tar xvf xxx.tar //解压
tar cvf xxx.tar folder //压缩

tar zxvf xxx.tar.gz //解压
tar zcvf xxx.tar.gz folder //压缩
~~~

### 服务器间文件传输

~~~vim
nc -l 4444 > kafka-demo.zip
nc serverip 4444 < kafka-demo.zip

scp -P10033 localFile sddtc@serverip:/home/sddtc
scp -P10033 sddtc@serverip:/home/sddtc/remote.txt .
~~~

#### du: Find files with size info

~~~vim
du -h --max-depth=1
du -h -d 1 (macOS)

du -s folder/* | sort -rn | head //显示文件夹下所有文件的大小，按照M展示，并按照[数字]排序取出最大的前10
du -sh folder/* | sort -rn | head
~~~

### 未分类 

~~~vim
nohup java -classpath $CLASS_PATH ${jarpath} & //nohup代表后台运行

source /etc/profile //马上使/etc/profile文件生效

wc -l filename //统计文件行数

dpkg --get-selections|grep linux //带有image的为系统内核

uname -a //查看系统当前使用内核


zip -r filename.zip ${filesdir}	 //压缩zip
zip -r filename.zip file1 file2 ${filesdir} //同时处理多个文件和目录，可以将它们逐一列出，并用空格间隔
~~~

### sed相关的知识  
[耗子的博客](http://coolshell.cn/articles/9104.html)
