---
layout: post
title: "[LT]leetcode-Combinations"
date: "2015-12-17"
categories: sddtc tech
tags: [java]
guid: urn:uuid:866af2a0-3fc7-4ced-839d-1839115b7176
---

Given two integers n and k, return all possible combinations of k numbers out of 1 ... n.
For example,  
If n = 4 and k = 2, a solution is:  

```vim
[
  [2,4],
  [3,4],
  [2,3],
  [1,2],
  [1,3],
  [1,4],
]
```

思路：提示说backtracking问题   
后来参考网络上的答案,感觉很棒，在此记录  

```java
public List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> result = new ArrayList<>();

    if (n <= 0 || n < k) {
        return result;
    }

    List<Integer> nodes = new ArrayList<>();
    helper(n, k, 1, nodes, result);

    return result;
}

private void helper(int n, int k, int start, List<Integer> nodes, List<List<Integer>> result) {
    if(nodes.size()==k) {
        result.add(new ArrayList<>(nodes));
        return ;
    }

    for(int i=start;i<=n;i++) {
        nodes.add(i);
        helper(n, k, i+1, nodes, result);
        nodes.remove(nodes.size()-1);
    }
}
```
