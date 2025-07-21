---
title: wechat 通过抓包获取图片方法实践
date: 2016-01-28
tags: spider
---

今天无意中看到[developerWorks](http://mp.weixin.qq.com/s?__biz=MjM5MzA0ODkyMA==&mid=405276891&idx=1&sn=ebd98476ad94725d57d2570bde17e45d&scene=23&srcid=0128POvbcBkiuZTd9TG7aCs2#rd)的一篇抓微信红包图片的方法，在电脑上试了一下，第一次看到APP的数据包，还蛮新奇的，特此记录一下，等大年三十红包接口开放了，我们一家可以看免费图片了：）虽然并不想看【。
有3个步骤(针对iPhone；安卓的在开发者平台那个APP有文章说明，在此不做记录)：

### 1.获取自己手机的udid

连接iTunes，手机信息，点击'序列号'，会出现UDID

### 2.打开电脑终端，将udid添加到rvictl命令中

```vim
>rvictl -s ${udid}
```
iOS 5后，apple引入了RVI remote virtual interface的特性，它只需要将iOS设备使用USB数据线连接到mac上，然后使用rvictl工具以iOS设备的UDID为参数在Mac中建立一个虚拟网络接口rvi，就可以在mac设备上使用tcpdump，wireshark等工具对创建的接口进行抓包分析了
重要信息：RVI 设备重现的是 iOS 设备的整个网络堆栈，无法跟踪设备上指定的网络接口，或者判断哪些包是通过哪个网络接口传输的，将 WLAN 关闭就可以抓 3G 连接的包。

### 3.tcpdump运行抓包命令实施监控

```vim
>sudo tcpdump -i rvi0 -AAl
or
>sudo tcpdump -i rvi0 -AAl |grep 'GET'
or Wechat红包
>sudo tcpdump -i rvi0 -AAl |grep 'GET /mmsns'
```

### 4.事成之后,将自己的设备从rvictl移除

```vim
>rvictl -x ${udid}
```
