---
layout: post
title: "Insertion Sort List小记"
date: "2015-09-23"
categories: sddtc tech
tags: [algorithms]
---

题目链接: [Insertion Sort List](https://leetcode.com/problems/insertion-sort-list/)  

这道题做完感触略多  
1.普通实现  
2.适合的场景和数据结构  
3.思考与编码  
4.关于Arrays.sort源码的剖析  

这道题个人解答如下，性能要甩出链表遍历解答方案一条街  

```java
    /**
     * Definition for singly-linked list.
     * ListNode {
     * int val;
     * ListNode next;
     * ListNode(int x) {val = x;}
     * }
     */
    public ListNode insertionSortList(ListNode head) {
        int size = 0;
        ListNode calLength = head;
        while (calLength != null) {
            size++;
            calLength = calLength.next;
        }
        int[] middle = new int[size];

        ListNode getValue = head;
        for(int i=0; getValue!=null; i++) {
            middle[i] = getValue.val;
            getValue = getValue.next;
        }
        Arrays.sort(middle);

        ListNode pre = head;

        for(int j=1;j<middle.length;j++) {
            pre.next = new ListNode(middle[j]);
            pre = pre.next;
        }
        head.val = middle[0];

        return head;
    }
```

解决思路如下:  
