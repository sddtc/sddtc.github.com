---
layout: post
title: "[algorithm]解读 word2vec 项目。"
date: "2015-11-26"
categories: algo
tags: [algorithm]
guid: urn:uuid:52104d1f-308e-4afa-973f-6d5d695f1e1e
---

### 什么是[word2vec](https://code.google.com/p/word2vec/) 

在2013年8月20日，google将该工具发布在https://code.google.com/p/word2vec/上  
它用来在使用深度学习算法之前预处理文本,把文本变成深度学习能够理解的向量形式  
结果采用余弦值的形式，越接近1表示词语相似度越高  


Word2vec的赞誉极高，被称为2013年最重要的自然语言处理工具，相信搞NLP的没有不知道word2vec的。在我看来，Word2vec最重要的贡献是提供了一个基础，也就是把词转换为实数值向量，在这个基础上可以玩很多花样。当然，可以站在一个更高的角度来看，这里的词其实并不一定真的就是单词，完全可以是具有一定意义的单元块，比如[国外音乐网站](http://erikbern.com/?p=340)就用word2vec来训练用户的听歌记录，这里的单元块就是歌曲编号，如果用户对音乐类型的喜好是一致的，那么训练后就能找到与某个歌曲相似的歌曲，这样就能给用户进行推荐了，相信类似这样的例子还有很多。  

word2vec有两种结构:continuous bag-of-words and continuous skip-gram  
命令参数-cbow可以从2中算法中做一个选择  

训练的原料越大，结果会越准确  

demo-phrases.sh对于短语的结果会更准，例如输入san_francisco  

### Performance
'-threads N'参数可以并行多个线程进行训练  
参数配置和选择  
* architecture: skip-gram (slower, better for infrequent words) vs CBOW (fast)  
* the training algorithm: hierarchical softmax (better for infrequent words) vs negative sampling (better for frequent words, better with low dimensional vectors)  
* sub-sampling of frequent words: can improve both accuracy and speed for large data sets (useful values are in range 1e-3 to 1e-5)  
* dimensionality of the word vectors: usually more is better, but not always  
* context (window) size: for skip-gram usually around 10, for CBOW around 5  


参考资料:  
1.[再谈word2vec](http://blog.csdn.net/zhaoxinfan/article/details/27352659)  
