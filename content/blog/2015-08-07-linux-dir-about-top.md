---
date: 2015-08-07
title: Linux关于top命令的说明
tags: shell
---

### top命令关键参数解析:

```vim
top - 15:44:40 up  5:49,  5 users,
load average: 2.01, 2.22, 2.15(系统负载,三个数值分别为 1分钟、5分钟、15分钟前到现在务队列的平均长度)
Tasks: 263 total,   1 running, 262 sleeping,   0 stopped,   0 zombie
%Cpu(s): 27.9 us(用户空间占用CPU百分比),
7.2 sy(内核空间占用CPU百分比),
0.0 ni(用户进程空间内改变过优先级的进程占用CPU百分比),
63.3 id(空闲CPU百分比),
1.6 wa(等待输入输出的CPU时间百分比),
0.0 hi,  0.0 si,  0.0 st
KiB Mem:   7991812 total(物理内存总量),  7759216 used(使用的物理内存总量),
232596 free,
257896 buffers(用作内核缓存的内存量)
KiB Swap:  1999868 total(交换区总量),
1900 used(使用的交换区总量),
1997968 free.  3040700 cached Mem
```

平均负载（load average）,一般对于单个cpu来说，负载在0～1.00之间是正常的，超过1.00须引起注意.在多核cpu中，系统平均负载不应该高于cpu核心的总数.
Swap cached Mem:内存中的内容被换出到交换区，而后又被换入到内存，但使用过的交换区尚未被覆盖，该数值即为这些内容已存在于内存中的交换区的大小.
相应的内存再次被换出时可不必再对交换区写入.

```vim
PID USER      PR  NI
VIRT(进程使用的虚拟内存总量，单位kb.VIRT=SWAP+RES)
RES(进程使用的、未被换出的物理内存大小，单位kb.RES=CODE+DATA)
SHR(共享内存大小，单位kb)
S  %CPU
%MEM(进程使用的物理内存百分比)
TIME+ COMMAND
```
