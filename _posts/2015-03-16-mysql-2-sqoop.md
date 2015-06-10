---
layout: post
title: "mysql,sqoop相关的整理"
date: "2015-03-16"
categories: sddtc tech
---

1.查看mysql的连接数的实际操作
```vim
mysqladmin -uxxx -p processlist
```

2.查看当前mysql连接数(Threads既是连接数)
```vim
mysqladmin -uxxx -p status
```
