---
layout: post
title: "leetcode-Triangle"
date: "2015-11-25"
categories: sddtc tech
tags: [java, leetcode]
---

真是活久见系列的生动范例  
一个动态规划实际算法习题  

Given a triangle, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.  

For example, given the following triangle  

```
[  
     [2],  
    [3,4],
   [6,5,7],
  [4,1,8,3]
]

```
The minimum path sum from top to bottom is 11 (i.e., 2 + 3 + 5 + 1 = 11).

Note:  
Bonus point if you are able to do this using only O(n) extra space, where n is the total number of rows in the triangle.


```

public int minimumTotal(List<List<Integer>> triangle) {
    if(triangle.size==0) return 0;
    if(triangle.size==1) return triangle.get(0).get(0);
    
    int[] dp = new int[triangle.size()];
    dp[0] = triangle.get(0).get(0);
    
    return minimumTotal(triangle, dp, 1);
}


public int minimumTotal(List<List<Integer>> triangle, int[] dp, int lvlidx) {
    List<Integer> list = triangle.get(lvlidx);
    int pre = dp[0];
    int temp;
    
    dp[0] += list.get(0);
    for(int i=1;i<lvlidx;i++) {
        temp = dp[i];
        dp[i] = list.get(i) + Math.min(pre, dp[i]);
        pre = temp;
    }
    
    dp[lvlidx] = pre + list.get(lvlidx);
    
    if(lvlidx+1==triangle.size()) {
        int res = dp[0];
        for(int i=1;i<=lvlidx;i++) {
            res = Math.min(res, dp[i]);
        }
        
        return res;
    }

    return minimumTotal(triangle, dp, lvlidx+1);
}




```



