---
layout: post
title: "java实现二分法"
date: "2015-10-08"
categories: sddtc tech
tags: [java]
---

今天突然就非常怀念在我的第一份工作的时候  
我们的老大曾经出了一道题  
实现二分法算法  
这道题直到现在对我的影响依然很大  

其实说了这么多，大家肯定会说这谁不会写啊，结果写出来的往往就踩了那么几个坑  

首先让我们思考一个简单的问题  
'什么样的情况适合使用二分查找法？'  
数组的值从小到大有序排列  
如果别人给你数组你就写也不问一下，那是不是代表你在工作中也常常先动手后思考呢：）  

那么开始动手实现吧，已知数组有序  

```java

/**
 *
 * @param demo 有序数组
 * @param key 待查找元素
 * @return 返回查找元素的数组下标
 */
public int binarySearch(int[] demo, int key) {
    if(null==demo) {
        return -1;
    }

    int left=0;
    int right=demo.length-1;

    while(left<=right) {
        int mid=left+(right-left)/2;

        if(demo[mid]<key) {
            left=mid+1;
        } else if(demo[mid]>key){
            right=mid-1;
        } else {
            return mid;
        }
    }

    return -left-1;
}


```  

总结一下这几个容易让人忽视的坑吧：）  
1.方法入口处的边界值判断  
2.mid值求法避免溢出  
3.重复值处理，上面的方法没有处理重复数字情况，要根据实际需要来修改  



