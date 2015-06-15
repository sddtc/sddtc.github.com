---
layout: post
title: "storm-study"
date: "2015-06-09"
categories: sddtc tech
---

* spout 龙卷，读取原始数据为bolt提供数据  
* bolt 雷电，从spout或其它bolt接收数据，并处理数据，处理结果可作为其它bolt的数据源或最终结果  
* nimbus 雨云，主节点的守护进程，负责为工作节点分发任务。  

* topology 拓扑结构，Storm的一个任务单元  
* define field(s) 定义域，由spout或bolt提供，被bolt接收  

本地运行storm,kafka,zookeeper  
storm的lib包下面需要放zookeeper.jar  

