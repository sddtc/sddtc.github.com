---
layout: post
title: "maven学习"
categories: sddtc tech
tags: [maven]
---


### 根据assembly.xml打包出文件  

```

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

```

## assembly.xml文件内容     

```

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


```


### 打包指定配置文件  

```

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
	
```