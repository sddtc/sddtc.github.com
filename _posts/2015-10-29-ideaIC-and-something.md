---
layout: post
title: "idea IC版和其它的碎碎念"
date: "2015-10-29"
categories: sddtc tech
tags: [IDE, java]
guid: urn:uuid:f1f1a21b-a50b-424c-9554-6e6386b6122a
---

idea IC版真的缺失了几个小功能，以前没发现...  
1.Maven依赖图没有  
2.Add Framework Support缺失一些插件,比如把一个项目自动转成web  
关于1，遇见了包冲突，有你受罪的：）  
关于2, 就自己勤快点呗：）  

gim遇见了一个问题，我觉得价值挺大的，因为我也想用那个基于org.quartz-scheduler的组件  
这个问题就是:  
org.quartz-scheduler的2.2.1版本的quartz和org.springframework的spring-context-support有包冲突  
然而组件同时依赖，gim改写组件ing  
spring的3.2以上和quartz的2.2.1冲突，在tomcat8下发现不了，其余不论是jetty还是tomcat7.0.23以下纷纷沦陷  
网上虽然说tomcat7.0.56就能融合它俩，但毕竟组件更新是有大前提的
具体怎么就融合了，是个疑问  

另外,sdk也蛮有趣的,有很多奇妙的实现

以上。
