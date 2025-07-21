---
title: Shell正常和异常退出的控制命令
date: 2017-01-24
tags: 命令行
---

需要在 shell 脚本中获取 java 调用的 System.exit() 的值, System.exit(-1), 则 $? 的值为255
```
java -jar xxx.jar param param2 param3

if [ $? -eq 0 ]; then
    echo "Pass"
else
    echo "Not Pass"
    exit -1
fi
```
如果脚本中有多次 java -jar 的调用,则需要这样关联判断, 取得最终结果.
否则只要最后一次调用是成功的,不论前面几次失败,结果都会是成功.

