---
title: "[Mockito]初步使用静态测试方法。"
layout: post
guid: urn:uuid:abb1f64e-4061-4d12-bd4b-0fc891562194
date: "2017-01-05"
categories: sddtc tech
tags: [mockito]
---

mockito,一种🌿口味的鸡尾酒🍸,用这种名字做的单元测试框架,一下就吸引了窝~  
这两天在搜索问题的时候,搜到了以前同事的博客,内心感到莫名的开心  
昨天斯托卡了下以前同事的简书博客,真为我们这群勤于更新博客的人感到骄傲😏  

### 背景  
这几天写了一个项目,主要使用System.exit()来判断结果的成功与失败,在写单元测试的时候,需要用到可以调取这种静态方法的工具,因为System.exit(0)会使得JVM进程退出,之后是不会有返回结果的,于是有了这个特殊的需求,发现了PowerMock可以很好地满足这一点  

1.主要需要三个依赖  

```vim

powermock-api-mockito
powermock-module-junit4
powermock-api-mockito-common

```

2.在单元测试类需要以下注解  

```java

@RunWith(PowerMockRunner.class)
@PrepareForTest({System.class, App.class(待测试类)})
@PowerMockIgnore(“javax.net.ssl.*")

```

其中PowerMockIgnore(“javax.net.ssl.*")出现的原因,是因为在我的方法中需要用到HttpClient相关的接口实现,不想使用PowerMock给我初始化好的同样的接口实现  

3.主要涉及到的方法  

```java

PowerMockito.mockStatic(System.class);
App.main(null);
PowerMockito.verifyStatic();
System.exit(-1);
System.out.println(“should return -1”);


```

这样可以得到关于System.exit()的期望返回结果
