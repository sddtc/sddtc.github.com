---
layout: post
title: "[Java]concurrent包部分解读。"
date: "2015-12-23"
categories: sddtc tech
tags: [java]
guid: urn:uuid:af62c8d3-84d7-4c48-bb29-4fef13220ff1
---

#### CountDownLatch  

CountDownLatch in Java is a kind of synchronizer which allows one Thread to wait for one or more Threads before starts processing.  

CountDownLatch in Java is introduced on Java 5 along with other concurrent utilities like CyclicBarrier, Semaphore, ConcurrentHashMap and BlockingQueue in java.util.concurrent package.

CountDownLatch works in Java, an example of CountDownLatch in Java and finally some worth noting points about this concurrent utility. You can also implement same functionality using  wait and notify mechanism in Java but it requires lot of code and getting it write in first attempt is tricky,  With CountDownLatch it can  be done in just few lines.

One of the disadvantage of CountDownLatch is that its not reusable once count reaches to zero you can not use CountDownLatch any more, but don't worry Java concurrency API has another concurrent utility called CyclicBarrier for such requirements.  

#### Cyclicbarrier

Difference between CountDownLatch and CyclicBarrier in Java  
In our last article we have see how CountDownLatch can be used to implement multiple threads waiting for each other.  
If you look at CyclicBarrier it also the does the same thing but there is a different you can not reuse CountDownLatch once count reaches zero while you can reuse CyclicBarrier by calling reset() method which resets Barrier to its initial State.   
What it implies that CountDownLatch is good for one time event like application start-up time and CyclicBarrier can be used to in case of recurrent event e.g. concurrently calculating solution of big problem etc.   

When to use CyclicBarrier in Java  
Given the nature of CyclicBarrier it can be very handy to implement map reduce kind of task similar to fork-join framework of Java 7, where a big task is broker down into smaller pieces and to complete the task you need output from individual small task e.g. to count population of India you can have 4 threads which counts population from North, South, East and West and once complete they can wait for each other, When last thread completed there task, Main thread or any other thread can add result from each zone and print total population. You can use CyclicBarrier in Java :

1) To implement multi player game which can not begin until all player has joined.
2) Perform lengthy calculation by breaking it into smaller individual tasks, In general to implement Map reduce technique.

*todo*
ForkjoinTask  
AbstractQueuedSynchronizer  
TreeMap
