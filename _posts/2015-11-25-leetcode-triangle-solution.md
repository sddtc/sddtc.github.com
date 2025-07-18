---
layout: post
title: "[algorithm]动态规划合集。"
date: "2015-11-25"
categories: 算法
tags: [algorithm]
guid: urn:uuid:102ad6aa-e1e4-43e3-8338-21ddaf5a7c8c
---

真是活久见系列的生动范例: 动态规划实际算法习题  

### 一

Given a triangle, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.   
For example, given the following triangle    
~~~vim
[  
     [2],  
    [3,4],
   [6,5,7],
  [4,1,8,3]
]
~~~
The minimum path sum from top to bottom is 11 (i.e., 2 + 3 + 5 + 1 = 11).  

Note:   
Bonus point if you are able to do this using only O(n) extra space, where n is the total number of rows in the triangle.  
~~~java
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
~~~

### 二  
 
A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).  
The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).  
How many possible unique paths are there?   
~~~java
public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];

    for(int i=0;i<m;i++) {
        dp[i][0] = 1;
    }
    for(int j=0;j<n;j++) {
        dp[0][j] = 1;
    }

    for(int i=1;i<m;i++) {
       for(int j=1;j<n;j++) {
           dp[i][j] = dp[i-1][j] + dp[i][j-1];//it is core
       }
    }

    return dp[m-1][n-1];
}
~~~
