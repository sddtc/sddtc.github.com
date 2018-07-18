---
layout: post
title: "[Maven]集成打包配置说明。"
categories: sddtc tech
tags: [maven]
guid: urn:uuid:82e6670e-8ad4-4ef9-972f-8ebe821ca3b0
---

场景一：  
替换配置文件的参数信息  
采用maven的build标签，在编译时替换  
配置文件: src/main/resources/config.properties  
代替换spring-\*.xml文件:src/main/resources/spring-context.xml  

在maven的pom.xml里配置:  
通过在build节点中添加filter和resource来实现的,在<build>标签下有一个<filters>标签，用于定义指定filter属性的位置，例如filter元素赋值filters/filter1.properties,那么这个文件里面就可以定义name=value对，这个name=value对的值就可以在工程pom中通过${name}引用，默认的filter目录是${basedir}/src/main/fiters/

~~~xml
<build>
    <finalName>wechat-alarm</finalName>
    <filters>
        <filter>src/main/resources/config.properties</filter>
    </filters>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
        <resource>
            <directory>${project.basedir}/src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
~~~

#### 根据assembly.xml打包出文件  

~~~xml
<build>
    <sourceDirectory>src/</sourceDirectory>
    <testSourceDirectory>src/test/</testSourceDirectory>
    <resources>
        <resource>
            <directory>${basedir}/src/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>

    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>2.2.1</version>
            <configuration>
                <descriptors>
                    <descriptor>src/main/assembly/assembly.xml</descriptor>
                </descriptors>
            </configuration>
            <executions>
                <execution>
                    <id>make-assembly</id>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
~~~

#### assembly.xml文件内容     

~~~xml
<assembly>
  <id>bin</id>
  <formats>
    <format>zip</format>
  </formats>
  <dependencySets>
    <dependencySet>
      <useProjectArtifact>true</useProjectArtifact>
      <outputDirectory>lib</outputDirectory>
    </dependencySet>
  </dependencySets>
  <fileSets>
    <fileSet>
      <outputDirectory>/</outputDirectory>
      <includes>
        <include>README.txt</include>
      </includes>
    </fileSet>
    <fileSet>
      <directory>src/main/scripts</directory>
      <outputDirectory>/bin</outputDirectory>
      <includes>
        <include>startup.sh</include>
        <include>shutdown.sh</include>
      </includes>
    </fileSet>
  </fileSets>
</assembly>
~~~

#### 打包指定配置文件  

~~~xml
<build>
    <sourceDirectory>src/</sourceDirectory>
    <testSourceDirectory>src/test/</testSourceDirectory>
    <resources>
        <resource>
            <directory>${basedir}/src/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>2.2.1</version>
            <configuration>
                <descriptors>
                    <descriptor>src/main/assembly/assembly.xml</descriptor>
                </descriptors>
            </configuration>
            <executions>
                <execution>
                    <id>make-assembly</id>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
~~~
