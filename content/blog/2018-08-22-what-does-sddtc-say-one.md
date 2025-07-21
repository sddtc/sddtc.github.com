---
title: AWS Serverless 应用实践学习(1)
tags: 云平台
date: 2018-08-22
---

## 背景
关于 Serverless 的应用实践学习

## Serverless
Lambda considerations and best practices

### Pattern One: 3-Tier Web Application
关于 3 层 Web 应用的架构如下:

![3-Tier Web-Application](/media/img/serverless/3-tier.png)

### Security
包含认证及安全的实践:

![3-Tier Web-Application Security](/media/img/serverless/3-tier-security.png)

##### **AuthZ** : three ways for identify
* IAM Credentials
* Cognito User pools
* Custom authorizers

### Another Security Strategy

含有一定安全策略的架构实践:

![3-Tier Web-Application Security Strategy](/media/img/serverless/3-tier-security-strategy.png)

### Serverless Monitor
常用监控架构实践:

![Serverless Monitor](/media/img/serverless/serverless-monitor.png)

其中:
##### Custom CloudWatch metrics
* 40 KB per POST
* Default Acct Limit of 150 TPS
* Consider aggregating with Kinesis

### Serverless web app lifestyle management

应用的生命周期:

![Serverless Application lifestyle](/media/img/serverless/serverless-application-lifestyle.png)

