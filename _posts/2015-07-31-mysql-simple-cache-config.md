---
layout: post
title: "[Mysql]mysql的高级优化"
date: "2015-07-31"
categories: sddtc tech
tags: [mysql, cache]
guid: urn:uuid:ac28bead-627d-4d6d-8f78-d981730908b8
---

背景:  
  因为资源争用的问题,跑数据和业务的query迟迟很难执行完毕，都相对比较紧急，吃饭的运维的同学看到我的屏幕，说了一句。。mysql配置查询缓存了吗。。真是一语惊醒。。  
解决方式：  
  上网查询了配置mysql缓存的方法，希望能1.检测服务器是否正确配置了缓存机制2.如果没有赶紧配上3.代码层面是解决的下一步方案，因为我在编写代码的时候每个sql都检查过索引和执行效果  

主要有以下几个参数：  
1.query\_cache\_type  

```vim
mysql> select @@query_cache_type;
```

结果类型有3种:0代表关闭查询缓存OFF;1代表开启ON;（DEMAND）代表当sql语句中有SQL\_CACHE关键词时才缓存;  
① 在query\_cache\_type打开的情况下，如果你不想使用缓存，需要指明:select sql\_no\_cache id,name from tableName;  
② 当sql中用到mysql函数，也不会缓存  

这一步,服务器是ON,也就是打开了  

2.have\_query\_cache: 系统变量,设置查询缓存是否可用  

```vim
mysql>show variables like 'have_query_cache';
```

value:YES  

这一步,服务器是YES,也就是可用的  

3.query\_cache\_size:表示查询缓存大小,也就是分配内存大小给查询缓存,如果你分配大小为0,那么第一步(1)和第二步(2)起不到作用,还是没有任何效果  

```vim
mysql>select @@global.query_cache_size;
```

这一步,服务器应该是默认值0,因此可以判断,服务器没有正确开启查询缓存,接下来就简单啦,赋值～然而也并没有那么简单,想到我们的服务器上面有多个项目在跑,内存的分配显然不能太过大手笔,因此大家就自己估量不要影响其它,另外，默认是0也是mysql5.0下出现的,6应该不是如此  

```vim
mysql>set @@global.query_cache_size=5242880;
```

4.query\_cache\_limit 控制缓存结果最大值:当你查询缓存数结果数据超过这个值就不会进行缓存。缺省为1M，也就是超过了1M查询结果就不会缓存  

```vim
mysql>select @@global.query_cache_limit;
```

通过以上四步，打开了查询缓存  

* * *    

mysql查询缓存相关变量  

```vim
mysql>show variables like '%query_cache%';
```

此处需要配图...  

* * *    

查看缓存状态  

```vim
mysql>show status like 'Qcache%';
```

此处需要配图...  

5.key\_read  


```vim
mysql>show status like '%key_read%';
```  

Key\_reads 代表命中磁盘的请求个数， Key\_read\_requests 是总数。命中磁盘的读请求数除以读请求总数就是不中比率 —— 在本例中每 1,000 个请求，大约有 0.6 个没有命中内存。如果每 1,000 个请求中命中磁盘的数目超过 1 个，就应该考虑增大关键字缓冲区了。


6.key\_buffer\_size 这个参数是用来设置索引块（index blocks）缓存的大小，它被所有线程共享，严格说是它决定了数据库索引处理的速度，尤其是索引读的速度。  


```vim
mysql>select @@global.key_buffer_size;
```  

innodb\_buffer\_pool\_size 这个参数和MyISAM的key\_buffer\_size有相似之处，但也是有差别的。这个参数主要缓存innodb表的索引，数据，插入数据时的缓冲。为Innodb加速优化首要参数。  


* * *  

Qcache\_free\_blocks：目前还处于空闲状态的Query Cache中内存 Block数目  
Qcache\_free\_memory：目前还处于空闲状态的 Query Cache 内存总量  
Qcache\_hits：Query Cache 命中次数  
Qcache\_inserts：向 Query Cache 中插入新的 Query Cache 的次数，也就是没有命中的次数  
Qcache\_lowmem\_prunes：当 Query Cache 内存容量不够，需要从中删除老的 Query Cache 以给新的 Cache 对象使用的次数  
Qcache\_not\_cached：没有被 Cache 的 SQL 数，包括无法被 Cache 的 SQL 以及由于 query\_cache\_type 设置的不会被 Cache 的 SQL  
Qcache\_queries\_in\_cache：目前在 Query Cache 中的 SQL 数量  
Qcache\_total\_blocks：Query Cache 中总的 Block 数量  

* * *  

检查查询缓存使用情况: 检查是否从查询缓存中受益的最简单的办法就是检查缓存命中率  
当服务器收到SELECT 语句的时候，Qcache\_hits 和Com\_select 这两个变量会根据查询缓存的情况进行递增  
查询缓存命中率的计算公式是：Qcache\_hits/(Qcache\_hits + Com\_select)  

```vim
mysql> show global status like '%Com_select%';
```


query\_cache\_min\_res\_unit的配置是一柄”双刃剑”，默认是4KB，设置值大对大数据查询有好处，但如果你的查询都是小数据 查询，就容易造成内存碎片和浪费  


* * *   

查询缓存碎片率 = Qcache\_free\_blocks / Qcache\_total\_blocks * 100%  
如果查询缓存碎片率超过20%，可以用FLUSH QUERY CACHE整理缓存碎片，或者试试减小query\_cache\_min\_res\_unit，如果你的查询都是小数据量的话  
查询缓存利用率 = (query\_cache\_size - Qcache\_free\_memory) / query\_cache\_size * 100%  
查询缓存利用率在25%以下的话说明query\_cache\_size设置的过大，可适当减小;查询缓存利用率在80%以上而且 Qcache\_lowmem\_prunes > 50的话说明query\_cache\_size可能有点小，要不就是碎片太多  
查询缓存命中率 = (Qcache\_hits - Qcache\_inserts) / Qcache\_hits * 100%  
示例服务器 查询缓存碎片率 = 20.46%，查询缓存利用率 = 62.26%，查询缓存命中率 = 1.94%，命中率很差，可能写操作比较频繁吧，而且可能有些碎片  

* * *  

优化提示：  
如果Qcache\_lowmem\_prunes 值比较大，表示查询缓存区大小设置太小，需要增大  
如果Qcache\_free\_blocks 较多，表示内存碎片较多，需要清理，flush query cache  
根据《High Performance MySQL》中所述，关于query\_cache\_min\_res\_unit大小的调优，书中给出了一个计算公式，  
可以供调优设置参考：query\_cache\_min\_res\_unit = (query\_cache\_size - Qcache\_free\_memory) / Qcache\_queries\_in\_cache  

* * *  

该文章转自[mysql查询缓存打开、设置、参数查询、性能变量意思](http://blog.sina.com.cn/s/blog_75ad10100101by7j.html)  

另一篇优化详解[myql优化，启动mysql缓存机制，实现命中率100%](http://blog.csdn.net/wulantian/article/details/11043121)

* * *

背景:  
  执行一个用到了索引的sql，表150w数据，行为是copy，但是processlist显示writing to net,觉得很奇怪，继而查询解决方案，发现了一个参数，设置之后该状态消失  

主要参数：  
max\_allowed\_packet 说明:mysql根据配置文件会限制server接受的数据包大小  
默认该配置是1M,因此一定是150w数据结果超过限制，导致反复读取   

```vim
//查看
mysql>select @@max_allowed_packet;
//设置为20M
mysql>set @@global.max_allowed_packet=20971520;
```
