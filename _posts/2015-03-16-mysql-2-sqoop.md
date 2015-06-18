---
layout: post
title: "mysql,sqoop相关的整理"
date: "2015-03-16"
categories: sddtc tech
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

5.sqoop的import命令(mysql--->hdfs)  

```vim
sqoop import --connect %s --username %s --password %s --query %s --target-dir %s -m 1 --as-textfile --fields-terminated-by '\001' --null-string '\\N' --null-non-string '\\N'
```
