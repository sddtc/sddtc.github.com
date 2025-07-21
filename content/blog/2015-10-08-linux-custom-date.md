---
title: Shell自定义 date 命令
date: 2015-10-08
tags: shell
---

### linux下的shell date命令通常获取系统时间,例如：

```vim
start=$1
end=$2

if [[ ! -n "$start" ]]; then
    start=`date --date='yesterday' +%Y-%m-%d`
fi

if [[ ! -n "$end" ]]; then
    end=`date +%Y-%m-%d`
fi
```

### 如果需要用到start和end这种变量，并且在变量的基础上进行日期的增减,例如：

```vim
custom_start=`date -d "${start} 7 day ago" "+%Y-%m-%d"`
custom_end=`date -d "${end} +1 day" "+%Y-%m-%d"`
custom_start1=`date --date=''$start' +1 day' +'%F'`
```
