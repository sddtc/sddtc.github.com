---
layout: post
title: "让Gitlab和Github的账号合为一体不离不弃"
date: "2016-03-01"
categories: sddtc tech
tags: [git,github,gitlab]
---

好久没有更新博客了，以后积攒的好东西还会记录下来的   
这次记录下让公司的Gitlab和在家的Github的代码可以在住的地方和公司无缝提交代码   
github的id\_rsa和id\_rsa.pub已经存在，也是git的global账户   

```vim
# 全局配置，Github仓库中默认使用此配置，是自己的github项目
git config --global user.name 'sddtc' && git config --global user.email 'sddtc@gmail.com'

# 团队项目配置，每次新创建一个项目，需要执行下，就是gitlab项目
git config --local user.name 'tuijiang' && git config --local user.email 'tuijiang@gitlab.uuu.org'
```
然后是.ssh下面的config文件配置  

```vim
#github
Host github
Hostname github.com
IdentityFile /Users/sddtc/.ssh/id_rsa

#gitlab-work
Host gitlab
Hostname gitlab.uuu.org
IdentityFile /Users/sddtc/.ssh/id_rsa_work
```

生成文件的命令  

```vim
ssh-keygen -t rsa -C "tuijiang@gitlab.uuu.org"
```

理论上，配置完成之后，ssh -T git@github 或者 ssh -T git@gitlab都可以通过  
但是公司不允许执行ssh，对于代码可以使用http下载  
注:  
ssh协议和http协议的代码远程地址切换    

```vim
git remote set-url origin [url]
```
