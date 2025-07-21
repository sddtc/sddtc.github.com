---
title: 关于Python的Thread介绍
date: 2015-03-23
tags: python
---

### Thread

"Unhandled exception in thread started by
Error in sys.excepthook:
Original exception was:"
问题在于主线程结束时子线程还未结束，解决办法就是让主线程阻塞足够的时间让子线程运行完再结束自己

Python中对多线程有两种启动方法：
一种是thread模块的start_new_thread方法，在线程中运行一个函数，但获得函数返回值极为困难，Python官方不推荐
另一种是集成threading模块的Thread类，然后重写run方法，类似于Java的Runnable接口定义，灵活性较高

import thread
Python的线程sleep方法并不是在thread模块中，反而是在time模块下
解决：启动线程之后，必须调用time.sleep休眠足够长的时间，使主线程等待所有子线程返回结果，如果主线程比子线程早结束，就会抛出这个异常


### Shell & Python

```python

import commands
a = commands.getoutput(‘echo $a')
b = commands.getoutput(‘echo $b')

```

说明:可以读取shell的变量数据


相关参考:

[Python的多线程机制有关](http://bestchenwu.iteye.com/blog/1063401)
