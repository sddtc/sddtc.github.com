---
title: "[Shell]关于Shell的那些事"
layout: post
guid: urn:uuid:f7fba600-15c8-4df4-af1b-b0ad5712a5df
date: "2017-01-24"
categories: sddtc tech
tags:
  - shell
---

##### 背景
需要在shell脚本中获取java调用的System.exit()的值  
System.exit(-1),则 $? 的值为255

```vim

java -jar xxx.jar param param2 param3  
if [ $? -eq 0 ]; then
	echo "Pass"
else
	echo "Not Pass"
	exit -1
fi


```

如果脚本中有多次java -jar的调用,则需要这样关联判断,取得最终结果.否则只要最后一次调用是成功的,不论前面几次失败,结果都会是成功.
