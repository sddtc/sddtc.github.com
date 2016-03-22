---
layout: post
title: "mysql的常用命令和场景解析"
date: "2015-03-16"
categories: sddtc tech
tags: [mysql]
guid: urn:uuid:43e490e5-14cd-410a-8638-39233a9f4b9b
---

### 1.基本操作   

```vim
mysql>mysqladmin -uxxx -p processlist
mysql>mysqladmin -uxxx -p status
```

1.1 修改mysql的库、表、客户端的字符编码格式  
a.停止mysql服务  
b.修改my.cnf文件

```vim
[client]
default-character-set=utf8

[mysql]
default-character-set=utf8

[mysqld]
collation-server = utf8_unicode_ci
init-connect='SET NAMES utf8'
character-set-server = utf8
```

c.启动mysql服务  
d.验证是否修改成功  

```vim
mysql>show variables like 'character%';
```

1.2 mysql server相关  

```vim
//mysql添加一个server:
CREATE SERVER ${servername} FOREIGN DATA WRAPPER mysql
OPTIONS
	(
		HOST '${remote_host}',
		DATABASE '${dbname}',
		USER '${username}',
		PASSWORD '${password}'
	);

//删除一个mysq server:
drop server if exists ${servername}
```

* * *


### 2.mysql索引使用  

*场景一*：  

发现一个现象:'select id,sum(cnt) from a group by id'这条语句,在id建立索引之后，仍然使用不到索引，并且该表若数量到达1KW,该语句效率问题导致无法使用，后来寻求解答，得出结论，若建立联合索引(id, cnt),该语句能用到索引，速度提升明显，借此机会发现了联合索引的强大力量  

*场景二*：  

某一天，每30分钟统计一次数据：  

```vim
SELECT HOUR(created_time) AS h,
       FLOOR(MINUTE(created_time) / 30) AS v,
       COUNT(*)
FROM record
WHERE created_time >= '2010-02-10'
AND created_time < FROM_DAYS(TO_DAYS('2010-02-10') + 1)
GROUP BY h, v;
```
