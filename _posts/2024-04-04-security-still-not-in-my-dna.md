---
title: "安全并没有被刻入到我的DNA里面"
layout: post
categories: 安全
date: "2024-04-04"
guid: urn:uuid:d450756b-2392-41ce-84b9-c6910d9a5c75
tags:
  - tech
---

在学习专业的服务客户的第一课, 就有一个很响亮的口号, 叫做“把安全刻入你的DNA里”. 没想到过去了7年, 咱还是没刻进去. 就算已经把多账号切换做成了脚本灵活使用从不犯错, 把 `gapa(git add --patch)` review 代码的习惯养成.
知道使用一些工具([gitleaks](https://github.com/gitleaks/gitleaks))来在代码提交前扫描 token, secrets. 知道不能信任所有云平台, 要谨慎对待代码输出的每行日志信息, 必要时进行PII过滤, 
连异常堆栈信息也要严格清理. 也很了解扫描代码中关键字的流程: 即收集所有相关人员的开源账号, 定期在开源平台搜索关键字, 通知当事人及时处理或者开启事故处理响应流程.      
  
当我准备自信满满开启security之路时, 咱就是说以身试法整了个incident.  
在docker的yaml文件里暴露了私人docker images repo domain.  

回想当时应该是在搭建个人学习项目的过程里, 人为错误的上传了那行代码. 并没有意识到那行代码意味着什么, 因为对于那个domain实在是有些陌生.  
后来想想, 为了避免这种情况, 除了个人维护一个关键字清单, 在提交个人项目的使用自动检查, 也可以尽量将自己学习项目设计为 private. 避免麻烦, 虽然但是private并不能解决根本问题.  

开始维护一份清单🧾  
以身试法更加了解如何进行安全事故响应了  
人之所以为人, 还是因为会犯错吧

在完成事故报告的时候, 看到了一个链接, 是关于`YOKOTENKAI`的. 并不知道这个词是什么东西, 但是报告里面的说法是拥抱它. 于是在 [Reddit 找到了](https://www.reddit.com/r/translator/comments/5uhgvt/japanese_english_what_does_yokoten_means/):    
> You won't find yokoten (横展) in a dictionary because it's an abbreviation for yokotenkai (横展開). Its literal meaning is "horizontal deployment" but it's a term coined by Toyota so the actual meaning is dependent on how they actually used it in practice.  
翻译过来就是: 
> 你不会在字典中找到 yokoten，因为它是 yokotenkai的缩写。 它的字面意思是“horizontal deployment”，但这是丰田创造的一个术语，因此实际含义取决于他们在实践中如何实际使用它。

所以拥抱`YOKOTENKAI` 所拥抱的就是  
> 这是 Anthony O'Connell 最喜欢的短语之一，也是任何活动中最具挑战性的活动之一组织。在小型组织中，知识和经验的共享是相对容易的。 人们在物理上靠得很近，存在时间短暂、紧密通信闭环。
> 随着组织变得越来越大，就像不断膨胀的宇宙一样，团体和个体彼此远离（或被推开）。这使得分享信息和想法，无论多么伟大，都更加困难。 `Yokoten` 是文化的一部分，是“Kaizen”或持续改进的基础。
> “Yoko” 可被翻译为 “sideways” 或“lateral”。 当问题发生在组织层面，大量的精力和努力常常投入到解决问题上: 问题定义、问题验证、根本原因分析、永久的被纠正和预防措施等. 
> 纠正和预防措施所确定的方法也通常适用于组织的其他领域。所以通过学习总结, 我们可以找到改进其他领域的机会。实际上，解决好一次，便能够运用多次。所以本质上来说，就像免费的午餐一样具有高性价比!  
> “Tenkai” 可被翻译为“develop”或“deploy”。 这并不是在说要通过电子邮件发送报告或向每个人通过PPT进行演示. 也并不意味着我们一旦接受一个想法或解决方案, 那么就只做到形式上的复刻。 这一点非常重要。
> 这意味着我们鼓励组织的其他领域“去看看”已经做了什么，了解行动和学习成果，并收回信息进行应用在自己的领域和工作范围内。这是任何组织能保持长久成功的秘诀.

又学到了呢. 丰田的精益方法论真不错. reddit 的网站内容也真不错, 啥都有.  

中午吃饭在看剧, 有句台词真是让我眼前一亮, 
> 做什么呢你？在背后不停地说人坏话，正因为你自己也有这些缺点，才不理解别人的缺点，少在这里装清高，丢人。——《小森林·冬春篇》· 森淳一

我是一个有很多缺点的人, 但希望不会因此自己蒙蔽了自己.  
又是一年清明节.
