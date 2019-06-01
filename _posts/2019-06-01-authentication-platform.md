---
title: "[Authentication] 7大平台的第三方登录参考手册"
layout: post
categories: sddtc tech
date: "2019-06-01"
guid: urn:uuid:3ee54bdf-b400-4c33-bcb2-38d5b79dbd44
tags:
  - authentication platform
---

## Facebook

开发者平台: [developers.facebook.com](https://developers.facebook.com/apps/)
Facebook 登录说明文档: [Facebook-login](https://developers.facebook.com/docs/facebook-login)

优点：
1. 国外受众用户非常多，易于使用
2. 支持 iOS, Andriod, Websites & Mobile websites. Windows Phone 使用 SDK 集成
3. 支持 Manually Build a Login Flow, 也就是不使用官方提供的 SDK
4. 文档非常完备：
    4.1 Facebook Login Best Practices 最佳实践
    4.2 Login Security 登录安全指导说明
    4.3 Testing a Login Flow 可测试的文档说明
    4.4 User Experience Design 用户体验设计

缺点：
1. 需要梯子，国内用户使用受限

## Wechat

微信不支持个人注册开发者平台，产品的重点应该是将个人开发者聚集在小程序这类年轻的生态环境里。  

优点：
1. 国内受众用户非常多，易于推广使用

缺点：
1. 不支持个人开发者注册开发者账号，无法使用微信第三方登录

## Douban

豆瓣关闭了开发者平台还是有些意外，在几年前，豆瓣的豆邮，阿尔法城，吸引了非常多有文艺气息需要归属感的人。  
包括有文化气息的开发者。  

优点：
1. 豆瓣是一家口碑在音乐、电影、书籍方面较有权威的站点，如果个人APP偏向于此类可以支持豆瓣登录

缺点：
1. 豆瓣API已经注册不了了，已经不开放了


## Weibo

开发者平台: [open.weibo.com](https://open.weibo.com/)
微博登录: [使用 Weibo 账号登录](https://open.weibo.com/wiki/Connect/login)

优点：
1. 国内受众用户较多，易于使用
2. 支持 iOS, Android, Websites 使用 SDK 集成， 丰富的 SDK 集成方式
3. 文档主要讲解了怎么调用接口，返回token, 偏向使用级别

缺点：
1. 目前暂无发现

## Google

Google Identity Platform 说明文档: [Google Identity Platform](https://developers.google.com/identity/) and [Choose-auth](https://developers.google.com/identity/choose-auth)

优点：
1. 受众用户非常多，易于使用
2. 拥有支持 iOS, Andriod, Websites, TVs & Devices 的登陆说明文档和不同样式的登陆展现样式
3. 支持的开发语言有Go, Java, .Net, Node.js, PHP, Python, Ruby
4. 文档非常完备
  4.1 移动端和浏览器端的最佳实践
  4.2 OAuth2, OpenID Connect 等协议相关的说明文档

缺点：
1. 需要梯子

## QQ

QQ登陆的开发文档说明: [QQ OAuth2.0](http://wiki.open.qq.com/wiki/website/%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C_OAuth2.0)

优点：
1. 95后几乎都在用QQ，并且可能有多于2个号，别问我怎么知道的qvq
2. 文档说明简单粗暴，可以满足需求

缺点：
1. 暂时还未发现

## Github

关于Github Apps & OAuth Apps 的区别说明: [About-Apps](https://developer.github.com/apps/about-apps/)
OAuth Apps说明文档: [authorizing-oauth-apps](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
创建一个第三方应用: [New Applications Settings](https://github.com/settings/applications/new)

优点：
1. 程序员必备，开发Geek向的APP可以考虑支持Github账号登陆
2. 文档说明简单粗暴

缺点：
2. 受众群体有限制，程序员使用较多

事实证明，Facebook & Google 这两家公司的文档做得太完备了，出乎我的意料，满满的友好度和诚意， 尤其是对比了一下国内的一些开发说明文档。
想自己开发APP的开发者，可以根据自己的APP风格，选择合适的第三方登陆平台。
