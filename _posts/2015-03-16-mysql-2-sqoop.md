---
layout: post
title: "mysql,sqoop相关的整理"
date: "2015-03-16"
categories: sddtc tech
tags: [mysql, sqoop]
---

1.查看mysql的连接数的实际操作  

```vim
mysqladmin -uxxx -p processlist
```

2.查看当前mysql连接数(Threads既是连接数)  

```vim
mysqladmin -uxxx -p status
```

3.修改mysql的库、表、客户端的字符编码格式  
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
show variables like 'character%';
```

3.sqoop集群迁移之后,mysql与hdfs之间的import导表操作可能会报没权限错误  
a.需要给mysql添加新hdfs用户  
b.如有权限问题，最好先查看mysql都有哪些已知用户  

```vim
select * from mysql.user;
```

4.mysql赋权命令:  

```vim
grant all PRIVILEGES on *.* to root@'cdh5-slave'  identified by '${your password}' with grant option;
```

4.1.mysql添加一个server:  

```vim

CREATE SERVER servername  FOREIGN DATA WRAPPER mysql
OPTIONS
	(
		HOST 'xx.xx.xx.xx',
		DATABASE 'dbname',
		USER 'username',
		PASSWORD 'password'
	);

```


* * *

5.sqoop的import命令(mysql--->hdfs)  

```vim
sqoop import --connect %s --username %s --password %s --query %s --target-dir %s -m 1 --as-textfile --fields-terminated-by '\001' --null-string '\\N' --null-non-string '\\N'
```

6.sqoop的export命令（hdfs--->mysql)  
导出操作有几点需要注意的地方：  
1.数据库导入表的用户权限问题，sqoop报错可能提示是总有个未关闭的流和error reading database  
2.确保hdfs文件的列数量和mysql表一致  
3.hdfs文件字段之间的分隔符只能是一个字节，例如'\001'，即使指定了多个，也会只取第一个  
基本命令如下:  

```vim
sqoop export --connect %s --username %s --password %s --table %s --export-dir ${hdfs_path} -m 1 --verbose --input-fields-terminated-by '\001'
```

网络很多报错的解决方法是mysql与sqoop版本问题，但是实际情况还是要从简单的例子开始分析，能够有效的解决问题  

