---
layout: post
title: "[algorithm]Sort Colors解决方案。"
date: "2015-12-01"
categories: sddtc tech
tags: [algorithm]
guid: urn:uuid:afa0ccfa-bd18-4008-93f0-b12d20edefbc
---

Given an array with n objects colored red, white or blue, sort them so that objects of the same color are adjacent, with the colors in the order red, white and blue.  
Here, we will use the integers 0, 1, and 2 to represent the color red, white, and blue respectively.    
Could you come up with an one-pass algorithm using only constant space?  

解这道题，也可以再学习下 [计数排序](https://zh.wikipedia.org/zh/%E8%AE%A1%E6%95%B0%E6%8E%92%E5%BA%8F)  

~~~java
public void sortColor(int[] nums) {
    if(nums == null || nums.length <= 1) {
        return;
    }

    int low = 0;
    int high = nums.length - 1;
    for(int i = low; i <= high;) {
         if(nums[i] == 0) {
             int temp = nums[i];
             nums[i] = nums[low];
             nums[low] = temp;

             i++;
             temp++;
         } else if(nums[i] == 2) {
             int temp = nums[i];
             nums[i] = nums[high];
             nums[high] = temp;

             high--;
         } else {
             i++;
         }
    }
}
~~~
