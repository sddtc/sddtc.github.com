---
layout: post
title: "[Log4j]业务日志输出规则实践。"
date: "2015-09-08"
categories: sddtc tech
tags: [log4j]
guid: urn:uuid:672b9275-5b41-441a-b94b-6f71a1ee0cf0
---

### log4j 业务日志打印配置

日志通常分为两种：系统日志和业务数据日志  
Log4j由三个重要的组件构成：日志信息的优先级，日志信息的输出目的地，日志信息的输出格式。  

其中，Log4j提供的appender有以下几种：   
org.apache.log4j.ConsoleAppender（控制台），   
org.apache.log4j.FileAppender（文件），   
org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件），  
org.apache.log4j.RollingFileAppender（文件大小到达指定尺寸的时候产生一个新的文件），   
org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）    
　　

```vim
//## ------------------rootLogger ------------------  ##
//日志记录的优先级，分为OFF、FATAL、ERROR、WARN、INFO、DEBUG、ALL或者您定义的级别。
//Log4j建议只使用四个级别，优先级从高到低分别是ERROR、WARN、INFO、DEBUG。
//E,D代表了appenderName
log4j.rootLogger = info, E, D

//## ------------------Console------------------------ ##
log4j.appender.stdout = org.apache.log4j.ConsoleAppender
log4j.appender.stdout.Target = System.out
log4j.appender.stdout.layout = org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern =  %d{ABSOLUTE} %5p %c:%L - %m%n

//## ------------------File------------------ ##

//debug
log4j.appender.D = org.apache.log4j.DailyRollingFileAppender
log4j.appender.D.File = /data/soft/kafka-tool/logs/debug.log
log4j.appender.D.Append = true
log4j.appender.D.Threshold = DEBUG
log4j.appender.D.layout = org.apache.log4j.PatternLayout
log4j.appender.D.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n

//error
log4j.appender.E = org.apache.log4j.DailyRollingFileAppender
log4j.appender.E.File = /data/soft/kafka-tool/logs/error.log
log4j.appender.E.Append = true
log4j.appender.E.Threshold = ERROR
log4j.appender.E.layout = org.apache.log4j.PatternLayout
log4j.appender.E.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss}  [ %t:%r ] - [ %p ]  %m%n

//## --------------------自定义logger----------------------##
//用于为不同的业务建立独立的日志 .使用自定义日志尽量不设置根日志rootLogger
//logger名：demoOneLog   logger输出器 demoOneAppender
log4j.logger.demoOneLog=DEBUG,demoOneAppender
log4j.additivity.demoOneLog=false
log4j.appender.demoOneAppender=org.apache.log4j.DailyRollingFileAppender
log4j.appender.demoOneAppender.File=/data/soft/kafka-tool/logs/demoOneLog/demoOneLog.log
log4j.appender.demoOneAppender.DatePattern='.'yyyy-MM-dd
//##定义独立的日志级别  类似于filter
log4j.appender.demoOneAppender.Threshold = DEBUG
log4j.appender.demoOneAppender.layout=org.apache.log4j.PatternLayout
log4j.appender.demoOneAppender.layout.ConversionPattern=[%-5p][%d{yyyy-MM-dd HH:mm:ss}] %m%n

//...可以配置多个自定义logger


//没有实际尝试，但应该也很有用
//把重要的业务日志异步批量写入数据库
log4j.logger.business=INFO,db
log4j.appender.db=org.apache.log4j.jdbc.JDBCAppender
//#注意：bufferSize可以缓存日志，设置为>1后，缓存满后再插入数据库。但如果程序终结有可能缓存未输出。
//需要在程序结束前调用LogManager.shutdown()
log4j.appender.db.BufferSize=100
log4j.appender.db.URL=jdbc://
log4j.appender.db.driver=
log4j.appender.db.user=root
log4j.appender.db.password=
log4j.appender.db.sql=
	INSERT INTO
	log4j_log (PRIORITY,LOGDATE,CLASS,METHOD,MSG)
	VALUES('%p','%d{yyyy-MM-dd HH:mm:ss}','%C','%M','%m')
log4j.appender.db.layout=org.apache.log4j.PatternLayout
```

在java项目中使用时，需要引入的pom  

```vim
<dependency>
	<groupId>commons-logging</groupId>
	<artifactId>commons-logging</artifactId>
	<version>1.2</version>
</dependency>

//或者用

<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-api</artifactId>
	<version>1.7.12</version>
</dependency>
```

程序中使用:  

```vim
//除了当前log的输出外，还有rootLogger的两个输出器也同时产生了输出(除非设置该日志的additivity=false)
Log dempOneCustomLog = LogFactory.getLog("demoOneLog");

dempOneCustomLog.info(message);
dempOneCustomLog.debug(message);

```

主要参考：[日志框架（一）----- log4j使用](http://houfeng0923.iteye.com/blog/1264849)  
关于日志框架的源码参考：[java日志，需要知道的几件事(commons-logging,log4j,slf4j,logback)](http://singleant.iteye.com/blog/934593)
