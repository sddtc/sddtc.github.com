# homura and lovelive  

* homura是魔法少女小圆里面的一个角色  
* lovelive是我14年遇到的，最棒的组合     
* 成长的路略苦闷,但结果还是失败的话,只能说你什么都不是  

## Changelog
* 2021-01-11 new design Using [tmaize-blog](https://github.com/TMaize/tmaize-blog)
* 2020-11-18 Warm theme 😮
* 2019-10-05 Dark theme 🤭
* 2019-01-03 添加鼠标点击爱心效果
* 2016-08-21 添加伪春菜,调教ing
* 2016-03-22 new design Using [lhzhang](http://lhzhang.com/) Jekyll theme
* 2015-04-22 new design Using [lagom](https://github.com/swanson/lagom/) Jekyll theme


## Development

### 准备

需要安装 Ruby 版本管理工具, 本人使用的是 rvm
之后安装 Ruby 2.6: `rvm install 2.6`
最后运行下方的脚本

**In Docker**
```bash
auto/start
```

### 创建新文章

```bash
./auto/create-new-post.sh {文章的标题}
```

文章的标题同时也是生成的文章链接的 URI 组成部分。 例如:

```
./auto/create-new-post.sh "hello-word"
```

生成的博客文章地址为: `https://www.homuralovelive.com/sddtc/life/2019/12/28/hello-world.html`  
建议: 文章名称为英语并且用 `-` 分隔，请勿使用空格分隔。  
1. 文章名称为英语目的是为了使生成的 URI 部分是英语，后期文章的名称可以在内容页进行修改  
2. 请勿使用空格的原因是脚本(`/auto/create-new-post.sh`)没有进行编码保护，容易产生异常  

## Licence and Copyright
Following files, directories and their contents are copyright sddtc Chang. You may not reuse anything therein without my permission:

* about.html
* images/
* _posts/

*Note: if you have any questions please raise an issue :)*
