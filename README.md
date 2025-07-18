# 2023.12.26 域名更名为 sddtc.florist

## homura and lovelive
* homura是魔法少女小圆里面的一个角色  
* lovelive是我14年遇到的，最棒的组合     
* 成长的路略苦闷,但结果还是失败的话,只能说你什么都不是  

## Changelog
* 2023-12-26 domain changed: `homuralovelive.com` -> `sddtc.florist`
* 2021-01-11 new design Using [tmaize-blog](https://github.com/TMaize/tmaize-blog)
* 2020-11-18 Warm theme 😮
* 2019-10-05 Dark theme 🤭
* 2019-01-03 添加鼠标点击爱心效果
* 2016-08-21 添加伪春菜,调教ing
* 2016-03-22 new design Using [lhzhang](http://lhzhang.com/) Jekyll theme
* 2015-04-22 new design Using [lagom](https://github.com/swanson/lagom/) Jekyll theme

## Development
### 准备
安装ruby(保持依赖最新是个好习惯, 不是最新也不会有问题), 运行下方的脚本:
**In Docker**
```bash
auto/start
```

更新: 2025-07-18 本人在docker运行jekyll一直报错, 解决ing.  
缓兵之计可以本地安装`jekyll`并直接运行 `jekyll serve` 然后打开 `localhost:4000`.

### 创建新文章
```bash
./auto/create-new-post.sh {文章的标题}
```
文章的标题同时也是生成的文章链接的 URI 组成部分。 例如:  
```
./auto/create-new-post.sh "hello-word"
```
生成的博客文章地址为: `https://www.sddtc.florist/sddtc/life/2019/12/28/hello-world.html`  
建议: 文章名称为英语并且用 `-` 分隔，请勿使用空格分隔。  
1. 文章名称为英语目的是为了使生成的 URI 部分是英语，后期文章的名称可以在内容页进行修改  
2. 请勿使用空格的原因是脚本(`/auto/create-new-post.sh`)没有进行编码保护，容易产生异常  
## Licence and Copyright
Following files, directories and their contents are copyright sddtc Chang. You may not reuse anything therein without my permission:
* about.html
* images/
* _posts/
*Note: if you have any questions please raise an issue :)*

#### 自用
分类列表:  
生活
碎碎念
数据库
大数据
命令行
软件工程
移动端
算法
爬虫
测试
翻译
机器学习
安全
读书笔记
云平台
身份认证
女性
播客
个人项目
python
js
java
devops
ruby
react
mjml
kotlin