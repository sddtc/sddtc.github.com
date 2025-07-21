---
title: npm国内镜像配置方法
date: 2017-03-22
tags: 软件工程
---

通过npm下载vue-cli脚手架,由于源的问题一直报错:
```
...shasum check failed for...
```
设置国内镜像:
1. config:
```
npm config set registry http://registry.cnpmjs.org
npm info underscore （如果上面配置正确这个命令会有字符串response）
```
2. 编辑 ~/.npmrc 加入下面内容:
```
registry = http://registry.cnpmjs.org
```
本文转自:
[解决npm的'shasum check failed for..'错误(npm注册国内镜像介绍)](http://blog.csdn.net/enson16855/article/details/23299787)
