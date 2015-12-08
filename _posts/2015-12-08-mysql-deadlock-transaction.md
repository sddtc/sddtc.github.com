---
layout: post
title: "记一次mysql的Deadlock found when trying to get lock; try restarting transaction"
date: "2015-12-08"
categories: sddtc tech
tags: [java, mysql]
---

####场景说明：  
有一个消费者实时消费消息，并且实时将记录插入mysql数据库中，由于有一定的吞吐量，因此采用jdbc的批量插入batch模式，并且开启了事务，完成时commit，抛出异常时rollback。每一步都记录了log日志。最近发生了奇怪的事情，就是error日志中出现了如下异常:  

```
2015-12-08 12:10:18  [ Thread-0:3088986302 ] - [ ERROR ]  入库失败Deadlock found when trying to get lock; try restarting transaction
java.sql.BatchUpdateException: Deadlock found when trying to get lock; try restarting transaction
	at com.mysql.jdbc.PreparedStatement.executeBatchSerially(PreparedStatement.java:1805)
	at com.mysql.jdbc.PreparedStatement.executeBatch(PreparedStatement.java:1277)
	at com.lagou.order.queue.DeliverInsertThread$1.run(DeliverInsertThread.java:109)
	at java.lang.Thread.run(Thread.java:745)
Caused by: com.mysql.jdbc.exceptions.jdbc4.MySQLTransactionRollbackException: Deadlock found when trying to get lock; try restarting transaction
	at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:57)
	at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.lang.reflect.Constructor.newInstance(Constructor.java:526)
	at com.mysql.jdbc.Util.handleNewInstance(Util.java:377)
	at com.mysql.jdbc.Util.getInstance(Util.java:360)
	at com.mysql.jdbc.SQLError.createSQLException(SQLError.java:985)
	at com.mysql.jdbc.MysqlIO.checkErrorPacket(MysqlIO.java:3887)
	at com.mysql.jdbc.MysqlIO.checkErrorPacket(MysqlIO.java:3823)
	at com.mysql.jdbc.MysqlIO.sendCommand(MysqlIO.java:2435)
	at com.mysql.jdbc.MysqlIO.sqlQueryDirect(MysqlIO.java:2582)
	at com.mysql.jdbc.ConnectionImpl.execSQL(ConnectionImpl.java:2530)
	at com.mysql.jdbc.PreparedStatement.executeInternal(PreparedStatement.java:1907)
	at com.mysql.jdbc.PreparedStatement.executeUpdate(PreparedStatement.java:2141)
	at com.mysql.jdbc.PreparedStatement.executeBatchSerially(PreparedStatement.java:1773)
	... 3 more
	
```

没错，死锁。  
为什么，怎么会，出现这种情况呢???  

登陆mysql，查看最后innodb状态  

```

mysql> show engine innodb status;

```

发现是在表A中进行insert操作时，表B也进行insert操作，只是表B的数据来源是select表A中的记录  
和网上的update、insert同一条记录都不相同。  

先说明表A的基本特点：使用innodb引擎，有主键  
消费者特点：200条提交一次，单线程消费


我产生了以下疑问:  
1.为什么insert表A和insert表B并且select表A会产生死锁？  
2.发生的频率不是很大，如何避免？  
3.jdbc的操作，关于事务有什么特别的地方?什么时候开启事务，什么时候结束?  

一步一步来解决  
1.查看mysql当前隔离级别：  

```

mysql> select @@global.tx_isolation, @@tx_isolation;
+-----------------------+-----------------+
| @@global.tx_isolation | @@tx_isolation  |
+-----------------------+-----------------+
| REPEATABLE-READ       | REPEATABLE-READ |
+-----------------------+-----------------+
1 row in set (0.01 sec)


```

2.回答问题3  
###jdbc的操作，关于事务有什么特别的地方?什么时候开启事务，什么时候结束?  
####[How to start a transaction in JDBC?](http://stackoverflow.com/questions/4940648/how-to-start-a-transaction-in-jdbc)  

* 如果程序默认(auto-commit)，即自动提交，则每一个sql是有隐含的事务和提交操作  
* 如果关闭自动提交(auto-commit)操作，则每一个sql操作都需要自己手动提交事务  
* 更改自动提交模式(auto-commit)触发提交当前事务中（如果有效）  
* 如果auto-commit已经启用，可以在任意时刻调用Connection.setTransactionIsolation()
* 如果自动提交(auto-commit)为false，Connection.setTransactionIsolation（）只可在事务开始之前或结束之后调用。若在事务中调用会发生为止不可预测的行为  
 
####setTransactionIsolation  

```

void setTransactionIsolation(int level) throws SQLException  
Attempts to change the transaction isolation level for this Connection object to the one given. The constants defined in the interface Connection are the possible transaction isolation levels.
Note: If this method is called during a transaction, the result is implementation-defined.

Parameters:
level - one of the following Connection constants: Connection.TRANSACTION_READ_UNCOMMITTED, Connection.TRANSACTION_READ_COMMITTED, Connection.TRANSACTION_REPEATABLE_READ, or Connection.TRANSACTION_SERIALIZABLE. (Note that Connection.TRANSACTION_NONE cannot be used because it specifies that transactions are not supported.)
Throws:
SQLException - if a database access error occurs, this method is called on a closed connection or the given parameter is not one of the Connection constants
See Also:
DatabaseMetaData.supportsTransactionIsolationLevel(int), getTransactionIsolation()

```  

3.回答问题2  
####死锁发生的频率不是很大，如何避免？来自[mysql官网](http://dev.mysql.com/doc/refman/5.0/en/innodb-deadlocks.html)  

You can cope with deadlocks and reduce the likelihood of their occurrence with the following techniques:  

* 用'show engine innodb status;'查看最后一次死锁的状态详情，并以此来更改应用程序尝试分析和避免  
* 随时准备在出现死锁的时候，再重新执行一次提交，死锁并不可怕也不危险，再试一次就好  
* 尽量保持事务简洁和短小，以此来避免死锁的易发性，减少冲突  
* 在做完一系列相关操作之后，立刻提交事务，在手动提交事务的场景下，尽量避免长时间保持耦合度高的session  
* 如果你使用了读锁，尽量降低数据库的隔离级别  
* 若在一个事务中，操作多个表，或更新多个字段的值，一个一个提交会严重影响各方面性能，并增大死锁的可能性，请组织好逻辑和方法  
* 索引的建立非常重要，请设计合理的索引，保证查询尽可能锁更少的记录，就能更好的避免死锁的出现  
* 使用更少的锁。如果可以就SELECT从一个旧的快照返回数据，不添加子句FOR UPDATE或LOCK IN SHARE MODE它。使用READ COMMITTED隔离级别是比较好的，因为同一个事务中的持续读从它自己的快照里读取。您还应该设置innodb_support_xa为0值，这将减少磁盘刷新的次数，由于数据在磁盘上的二进制日志同步。  
* 另一种方法，创建一个“信号”表，其中包含一个单行。在访问其它表之前，该行每个事务更新。以这种方式，所有的交易发生以串行方式。注意，InnoDB的瞬间死锁检测算法也适用于这种情况下，因为串行化锁是一个行级锁。随着MySQL表级锁，超时方法必须被用来解决死锁。  


4.回答问题1  
####为什么insert表A和insert表B并且select表A会产生死锁？来自[百度百科](http://wenku.baidu.com/view/34f7134b2b160b4e767fcfaa.html)  
在innodb默认的事务隔离级别下，普通的SELECT是不需要加行锁的，但LOCK IN SHARE MODE、FOR UPDATE及高串行化级别中的SELECT都要加锁。有一个例外,这个例外就是我遇到的问题：  
对表A加表锁，表所有行的主键索引（即聚簇索引）加共享锁。默认对其使用主键索引。
锁冲突的产生：  
由于共享锁与排他锁是互斥的，当一方拥有了某行记录的排他锁后，另一方就不能其拥有共享锁，同样，一方拥有了其共享锁后，另一方也无法得到其排他锁。所以，当语句1、2同时运行时，相当于两个事务会同时申请某相同记录行的锁资源，于是会产生锁冲突。由于两个事务都会申请主键索引，锁冲突只会发生在主键索引上.
  


最终，我自己打算尝试的解决方法有几种：  
1.在抛出异常之后，进行commit尝试，尝试一定次数之后，再进行回滚处理  
2.将事务过程缩减，加快提交频率  
3.其实表A的索引有优化的余地，对索引精确优化也可以有效的避免，只是个人mysql水平有限，过段时间尝试联合索引的替换  





