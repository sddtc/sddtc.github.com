---
title: "[Sidekiq] How to autoscale instances depending upon Sidekiq queue size"
layout: post
guid: urn:uuid:3c128d5d-dd95-4bec-8c55-99e33d49da06
date: "2017-11-27"
categories: sidekiq
tags:
  - aws
  - sidekiq
---

### 背景
事情的起因是Jerry给过我一个Comment, 当我们的程序实现了AWS的Scaling-Policy时, Sidekiq能否在收缩时优雅的停止保证数据不丢失呢?  
于是查阅了一些资料, 看到了一些有趣的东西  

### 解决方法
Auto Scaling supports sending Amazon SNS notifications when instance launch or terminate events occurs.  
We used the same method to detect the autoscale instance is terminating and we have to stop Sidekiq gracefully.  

`Auto Scaling` 可以支持我们当运行程序的实例 `launch` 或者 `terminate` 时发送消息做一些事情.      
那么我们可以使用类似的方法去观察我们运行着 `Sidekiq` 的实例来做些事情让它能够优雅的停止.  

We have followed the following method:  

1) We have configured SNS for autoscale group for the autoscaling: EC2_INSTANCE_TERMINATE event.  

2) We have put the lifecycle hook. A lifecycle hook tells Auto Scaling that you want to perform an action on an instance that is not actively in service; for example, either when the instance launches or before the instance terminates.  

When you add a lifecycle hook, you have the option to be notified when the instance enters a wait state so that you can perform the corresponding custom action.  
So we put the autoscaling: EC2\_INSTANCE\_TERMINATE hook.  

```
@client.put_lifecycle_hook(
   auto_scaling_group_name: AUTO_SCALING_GROUP_NAME,
   lifecycle_hook_name: 'Auto-Scale-Ec2-Termination',
   lifecycle_transition: "autoscaling:EC2_INSTANCE_TERMINATING",
   notification_target_arn: 'arn:aws:sns:us-west-2:496361111699:Auto-Scale-EC2-Termination',
   role_arn: 'arn:aws:iam::492361111699:role/sns-publish'
)
```

3) When a Autoscale instance is terminating, it will send an SNS notification to our API server.   
The notification sends JSON response which contains Instance Id, LifecycleActionToken etc.   

When the server got the notification we do the following the steps from code:  
a. We find the IP address from instance id.   
b. We login to server using ssh.c.  
Then we send USR1 signal to sidekiq.  
The USR1 command tells to sidekiq don’t accept new jobs, so sidekiq will not accept any new jobs from the enqueued jobs.  
For example:ps -ef | grep sidekiq | grep -v grep | awk ‘{print $2}’ | xargs kill -USR1  
Then we will calculate the sum of busy jobs.d.   
If the the sum is greater than 0 then we are again following step c and d until the sum becomes 0.   
When the busy jobs sum becomes 0 then we will call complete lifecycle action hook of autoscale group, it means that Auto Scaling can continue terminating the instance. Now the instance will terminate.  

### Conclusion:
We have achieved more concurrency in less time by auto scaling Sidekiq instances as per our queue size.  


转自: [How to autoscale instances depending upon Sidekiq queue size](http://www.cuelogic.com/blog/how-to-autoscale-instances-depending-upon-sidekiq-queue-size/)




