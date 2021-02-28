---
layout: post
title: "[Java] URLDecoder 处理文件的 case 小记。"
date: "2015-12-02"
categories: java
tags: [java]
guid: urn:uuid:46ae0934-607e-49be-b683-bbc330ea4fc5
---

### 情景说明：  

处理日志文件数据，程序会将url解码，解码时抛出异常：URLDecoder: Illegal hex characters in escape (%) pattern For input String '< ' or '= ' or '<a'  
一般我们会将url解码之后持久化，例如、把%23解码为#，把%20解码为空格，或者把%3D解码为等号等. 然而大量的日志会在url加上未知的字符串，更不用说一些想要进行攻击的url形式了，如果单纯的对url进行如下的解码，显然会抛出异常：  
~~~java
import java.net.URLDecoder;
String url = "http://example.com/test?q=%= %20some%20other%20Text";  
url = URLDecoder.decode(url);
~~~
原因：  
解析URL的时候，decode方法会将带有百分号%和后面2个字符连在一起解析，这2个连续的字符是一个16进制数，然而由于url的不规范，百分号%后面变成了诸如%.、%+、%<甚至%= 的时候，会抛出异常。  
我们要做的，就是将这类%不要和后面2位进行解析，而将%编码为'%25',另外由于加号+拥有正则表达式的特殊含义，所以我们也要进行一个转义，然后将加号+编码为'%2B'  ：）  

解决方式如下：  
~~~java
import java.net.URLDecoder;

String url = "http://example.com/test?q=%= %20some%20other%20Text";
url = url.replaceAll("%(?![0-9a-fA-F]{2})", "%25");
url = url.replaceAll("\\+", "%2B");

url = URLDecoder.decode(url, "UTF-8");
~~~
