---
layout: post
title: "git常用命令集锦"
date: "2015-08-27"
categories: sddtc tech
tags: [github, command]
guid: urn:uuid:a3ec03ca-1f7a-46d7-ba65-db27dda6f614
---

#### .gitignore在查看git status的时候不能过滤文件和文件夹  

在.gitignore添加.idea文件夹，以过滤该文件夹，但是通过git status查看仍显示.idea文件夹的状态。  
原因：
在git库中已存在了这个文件，之前push提交过该文件。  
.gitignore文件只对还没有加入版本管理的文件起作用，如果之前已经用git把这些文件纳入了版本库，就不起作用  

解决：
需要在git库中删除该文件，更新.gitignore文件

```vim
git rm --cached .idea/
```  

然后再次git status查看状态，.idea文件夹不再显示状态。  

#### 本地修改，但更新强制覆盖本地  

```vim
git fetch --all  
git reset --hard origin/master
```

#### 远程新建分支，拉取到本地  

1.查看所有分支，包括远程: git branch -va   
2.切换到分支： git checkout -b <branch> origin/<branch>  
3.如果切到新分支，push代码失败，执行：git push -f origin <branch>
