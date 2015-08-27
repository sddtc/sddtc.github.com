---
layout: post
title: "关于git和github的一些使用"
date: "2015-08-27"
categories: sddtc tech
tags: [github, command]
---

### .gitignore在查看git status的时候不能过滤文件和文件夹  

在.gitignore添加.idea文件夹，以过滤该文件夹，但是通过git status查看仍显示.idea文件夹的状态。  

原因：
在git库中已存在了这个文件，之前push提交过该文件。  
.gitignore文件只对还没有加入版本管理的文件起作用，如果之前已经用git把这些文件纳入了版本库，就不起作用  

解决：
需要在git库中删除该文件，更新.gitignore文件

```
git rm --cached .idea/
```  

然后再次git status查看状态，.idea文件夹不再显示状态。

