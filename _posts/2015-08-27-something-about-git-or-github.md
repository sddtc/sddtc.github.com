---
layout: post
title: "[Git]版本管理相关命令。"
date: "2015-08-27"
categories: sddtc tech
tags: [git]
guid: urn:uuid:a3ec03ca-1f7a-46d7-ba65-db27dda6f614
---

### .gitignore在查看git status的时候不能过滤文件和文件夹  
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

### 本地修改，但更新强制覆盖本地  

```vim
git fetch --all   
git reset --hard origin/${branch_name}
```

### 远程新建分支，拉取到本地  
1.查看所有分支，包括远程: git branch -va   
2.切换到分支： git checkout -b ${branch_name} origin/${branch_name}  
3.如果切到新分支，push代码失败，执行：git push -f origin ${branch_name}  

### 比较分支  

```vim
git diff master..test
```

如果不是查看每个文件的详细差别，而是统计一下有哪些文件被改动，有多少行被改 动，就可以使用‘--stat' 参数。  

```vim
git diff --stat
```

### 合并分支A文件到分支B

```vim
git checkout -p dev user.java //不切换branch，把dev上的user.java更新到当前分支
git checkout dev feed.java //去掉-p参数，新增该feed.java文件
```

### 从master分支更新代码到fork分支

```
git remote -v
git remote add upstream ${master_repo_address}
git fetch upstream
git checkout master
git merge upstream/master
```

### git pull vs git fetch then git rebase

> * Fetch vs Pull

>> Git fetch just updates your repo data, but a git pull will basically perform a fetch and then merge the branch pulled

> * Rebase vs Merge

>> In contrast, rebasing unifies the lines of development by re-writing changes from the source branch so that they appear as children of the destination branch – effectively pretending that those commits were written on top of the destination branch all along.

