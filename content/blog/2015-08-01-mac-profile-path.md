---
title: Mac终端的配置文件定义与修改
date: 2015-08-01
tags: 命令行
---

### Mac启动加载文件位置:可设置环境变量
1. 首先要知道你使用的 `Mac OS X` 是什么样的 `Shell`
使用命令:

```vim
echo $SHELL
```

如果输出的是: `csh` 或者是 `tcsh`，那么你用的就是 `C Shell`;
如果输出的是: `bash, sh, zs`, 那么你的用的可能就是 `Bourne Shell` 的一个变种.

`Mac OS X 10.2` 之前默认的是 `C Shell`. `Mac OS X 10.3` 之后默认的是 `Bourne Shell`.

2. 如果是 `Bourne Shell`, 那么你可以把你要添加的环境变量添加到你主目录下面的 `.profile` 或者 `.bash_profile`,
如果存在没有关系添加进去即可, 如果没有生成一个.

2.1. `/etc/profile` (建议不修改这个文件): 全局（公有）配置，不管是哪个用户，登录时都会读取该文件.
2.2. `/etc/bashrc` (一般在这个文件中添加系统级环境变量): 全局（公有）配置， `bash shell` 执行时，不管是何种方式，都会读取此文件.
2.3. `~/.bash\_profile` (一般在这个文件中添加用户级环境变量):（注：`Linux` 里面是 `.bashrc` 而 `Mac` 是 `.bash\_profile`）

若 `bash shell` 是以 `login` 方式执行时，才会读取此文件.该文件仅仅执行一次!

默认情况下,他设置一些环境变量: 设置终端配色, 设置命令别名 `alias ll='ls -la'`,
设置环境变量： `export PATH=/opt/local/bin:/opt/local/sbin:$PATH`

```vim
#source /etc/profile
$source .bash_profile（这是文件名）
```
