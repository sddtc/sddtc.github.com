---
layout: post
title: "mac的配置文件相关"
date: "2015-08-01"
categories: sddtc work
tags: [mac, config]
---

#### Mac启动加载文件位置:可设置环境变量
1.首先要知道你使用的Mac OS X是什么样的Shell  
使用命令  

echo $SHELL  

如果输出的是：csh或者是tcsh，那么你用的就是C Shell。  
如果输出的是：bash，sh，zsh，那么你的用的可能就是Bourne Shell的一个变种。  
Mac OS X 10.2之前默认的是C Shell。  
Mac OS X 10.3之后默认的是Bourne Shell。  
 
2.如果是Bourne Shell  
那么你可以把你要添加的环境变量添加到你主目录下面的.profile或者.bash_profile，如果存在没有关系添加进去即可，如果没有生成一个。  
 
 1./etc/profile（建议不修改这个文件 ）  
 全局（公有）配置，不管是哪个用户，登录时都会读取该文件。  
 
 2./etc/bashrc（一般在这个文件中添加系统级环境变量）  
 全局（公有）配置，bash shell执行时，不管是何种方式，都会读取此文件。    
 
 3.~/.bash_profile  （一般在这个文件中添加用户级环境变量）  
（注：Linux 里面是 .bashrc 而 Mac 是 .bash_profile）  
 若bash shell是以login方式执行时，才会读取此文件。该文件仅仅执行一次!  
 默认情况下,他设置一些环境变量  
 设置终端配色  
 设置命令别名alias ll='ls -la'  
 设置环境变量：export PATH=/opt/local/bin:/opt/local/sbin:$PATH  
 
 ```
 #source /etc/profile
 $ source .bash_profile（这是文件名）
 ```
