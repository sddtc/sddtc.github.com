---
layout: post
title: "mac安装scrapy"
date: "2015-11-03"
categories: sddtc tech
tags: [python, scrapy]
guid: urn:uuid:302ac300-ab74-45b2-b388-0abb5ff7c35a
---

以前用ubuntu的时候，装过scrapy，很顺利  
自己换了电脑之后，发现官网没有针对mac安装scrapy的说明，特此记录一下  

1.python2.7是电脑自带的，没卸载没重装过  
2.去官网下载(http://scrapy.org/download/)zip包  
官网目前是1.0版本的zip找不到下载路径  
我下的是(the development branch)的zip版本  
安装完了显示是dev1.1版本  
3.下载zip，解压到自己的目录  
发现里面有个setup.py文件  
执行:

```vim
sudo python setup.py install  
```

安装完成  
4.在命令行运行scrapy的时候报错  
查了下原因，后来解决，解决网址(http://stackoverflow.com/questions/17911345/scrapy-unable-to-create-a-project)，命令如下：  

```vim
sudo easy_install --upgrade lxml   
sudo easy_install --upgrade scrapy
```

安装lxml过程中，还安装了xcode的一个小插件的样子  
5.上面两个执行完成，scrapy就显示成功了  
6.可以scrapy startproject bilibili辣  

耶耶耶
