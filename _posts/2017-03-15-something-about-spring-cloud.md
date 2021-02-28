---
title: "[Spring-Cloud] 概念理解和部署。"
layout: post
guid: urn:uuid:21f23e62-4c3a-41dd-82dc-2fb49284cda0
date: "2017-03-15"
categories: springcloud
tags:
  - springcloud
---

### 背景
在接触了SpringBoot之后,了解到其启动的便利,因为内置了tomcat的缘故,在集成的时候我们用gradlew命令启动jar包的形式直接部署后端应用,在build时会运行findbugs与checkstyle的task生成报告文件,添加jacoco的task分析单元测试覆盖率     
该后端应用特点:  
1.RESTful风格API接口作为数据提供方  
2.前后端通过API通信,前端项目采用AngularJS,集成第三方单点登录框架  

思考了一下自己比较常用的搭建应用的模式以及技术栈:   
0.Mybatis+SpringBoot+RESTful+Vue.js => **前后端一体**       
1.Mybatis+SpringBoot+RESTful => **前后端分离**      
2.Mybatis+Redis+RPC Service Framework => **纯服务端**     
3.Mybatis+SpringMVC+FreeMarker+AngularJS  
4.Mybatis+Memcach+SpringMVC+FreeMarker+JQuery  

目前的模式及技术栈:  
JPA+RabbitMQ+SpringCloud+RESTful+React+Docker => **典型微服务架构**  

之前了解过要想把一个SpringBoot架构的应用改造成SpringCloud,需要其它服务支持,比如注册服务、发现服务等,维护成本意味着自动化集成上线很重要,拆分成本意味着一般情况下是对已有成熟系统进行拆分,因此权衡利弊选择适合自己的较为重要.    

以下是当前生产环境遇到的技术栈:    
#### Eureka
Netflix开源了他们另一个架构——Eureka，它是一个RESTful服务，用来定位运行在AWS域（Region）中的中间层服务。  

Eureka由两个组件组成：Eureka服务器和Eureka客户端。Eureka服务器用作服务注册服务器。Eureka客户端是一个java客户端，用来简化与服务器的交互、作为轮询负载均衡器，并提供服务的故障切换支持。Netflix在其生产环境中使用的是另外的客户端，它提供基于流量、资源利用率以及出错状态的加权负载均衡。  

当一个中间层服务首次启动时，他会将自己注册到Eureka中，以便让客户端找到它，同时每30秒发送一次心跳。如果一个服务在几分钟内没有发送心跳，它将从所有Eureka节点上注销。一个Amazon域中可以有一个Eureka节点集群，每个可用区（Availability Zone）至少有一个Eureka节点。AWS的域相互之间是隔离的。  

对比亚马逊的ELB，Netflix推销Eureka时说：  
> AWS弹性负载均衡服务是边界服务的负载均衡解决方案，边界服务是向终端用户访问Web而开放的。Eureka填补了中间层负载均衡的空缺。虽然，理论上可以将中间层服务直接挂在AWS弹性负载均衡器后面，但这样会将它们直接开放给外部世界，从而失去了AWS安全组的所有好处。  

#### Zuul  
Zuul在Netflix的微服务体系中的定位：  
Zuul只做跨横切面的功能: 如路由，安全认证，容错，限流，日志等  
Zuul只是一个HTTP网关: 聚合或者协议转换(如rpc转换成http)，在Edge Service层做  

*todo*  
Zipkin  
Sleuth  
Kibana  
Ribbon  
Feign  
Hystrix  

参考资料:   
[Netflix开源他们的另一个架构——Eureka](http://www.infoq.com/cn/news/2012/09/Eureka)  
[Netflix/eureka/wiki](https://github.com/Netflix/eureka/wiki)  
[Spring Cloud Sleuth使用简介](http://www.jianshu.com/p/6d6b52c7624f)  





