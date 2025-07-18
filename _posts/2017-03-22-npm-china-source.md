---
title: "[npm] 国内镜像配置方法。"
layout: post
date: "2017-03-22"
categories: 软件工程
guid: urn:uuid:0d1db18e-7b0a-4da1-8b7e-22e9820fece8
tags:
  - npm
  - nodejs
---

通过npm下载vue-cli脚手架,由于源的问题一直报错:  
~~~
...shasum check failed for...
~~~
设置国内镜像:  
1. config:  
~~~
npm config set registry http://registry.cnpmjs.org
npm info underscore （如果上面配置正确这个命令会有字符串response）
~~~
2. 编辑 ~/.npmrc 加入下面内容:  
~~~
registry = http://registry.cnpmjs.org
~~~
本文转自:  
[解决npm的'shasum check failed for..'错误(npm注册国内镜像介绍)](http://blog.csdn.net/enson16855/article/details/23299787)
