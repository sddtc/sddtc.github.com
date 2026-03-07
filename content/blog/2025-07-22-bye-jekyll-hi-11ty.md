---
title: 博客静态页面生成工具从jekyll切换为11ty, 告别ruby 拥抱js
date: 2025-07-22
tags: [js, ruby]
categories: [工程实践, 技术开发]
---

从我知道github自带`gh-pages`特性那会儿, 便把个人博客从自建服务器迁移到了这里,也快11年了(第一篇文章发布于2014年), 后来知道了一些便宜的域名服务, 换过2个域名. 从GoDaddy平台换成了[porkbun](https://porkbun.com/). 然而静态页面生成器一直使用github官方推荐的jekyll, 也用爱发电换了好几个主题, 最近的[tmaize](https://github.com/TMaize/tmaize-blog)主题确实是我一直很喜欢的.. 但是!! 这两天还是谨慎思考(花了一个下午的时间), 彻底放弃jekyll, 也是要从一个一直困惑我的报错开始...  
容器化启动项目是一个习惯, 它可以不依赖电脑本地的环境, 用一个docker image文件, 包含着项目需要的依赖, 运行环境, 很方便的让你快速启动. 一直以来我用了jekyll的image在本地启动博客:  

```yml
services:
  jekyll:
    image: jekyll/jekyll:latest
    command: "jekyll serve"
    working_dir: /app
    container_name: sddtc_blog
    volumes:
      - $PWD:/srv/jekyll
      - .:/app
    ports:
      - "4000:4000"
    environment:
      JEKYLL_UID: 1001
      JEKYLL_GID: 1001
```

这一段我也不得不吐槽, `JEKYLL_UID`和`JEKYLL_GID` 还是后来加上的, 因为一些ruby升级还是gem升级啥的导致权限问题之类的, 当时也花了好多时间解决. 然而那还是解决了的, 然而这一次的错误:  

```shell
/usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/conflict.rb:47:in `conflicting_dependencies': undefined method `request' for nil:NilClass (NoMethodError)
    [@failed_dep.dependency, @activated.request.dependency]
                                       ^^^^^^^^
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/exceptions.rb:61:in `conflicting_dependencies'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/exceptions.rb:55:in `initialize'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver.rb:193:in `exception'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver.rb:193:in `raise'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver.rb:193:in `rescue in resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver.rb:191:in `resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/request_set.rb:411:in `resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/request_set.rb:423:in `resolve_current'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:230:in `finish_resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:287:in `block in activate_bin_path'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:285:in `synchronize'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:285:in `activate_bin_path'
	from /usr/local/bin/bundle:25:in `<main>'
/usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb:317:in `raise_error_unless_state': Unable to satisfy the following requirements: (Gem::Resolver::Molinillo::VersionConflict)
- `bundler (= 2.7.0)` required by `user-specified dependency`
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb:299:in `block in unwind_for_conflict'
	from <internal:kernel>:90:in `tap'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb:297:in `unwind_for_conflict'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb:682:in `attempt_to_activate'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb:254:in `process_topmost_state'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolution.rb:182:in `resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver/molinillo/lib/molinillo/resolver.rb:43:in `resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/resolver.rb:190:in `resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/request_set.rb:411:in `resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems/request_set.rb:423:in `resolve_current'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:230:in `finish_resolve'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:287:in `block in activate_bin_path'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:285:in `synchronize'
	from /usr/local/lib/ruby/site_ruby/3.1.0/rubygems.rb:285:in `activate_bin_path'
	from /usr/local/bin/bundle:25:in `<main>'
```

首先想到了升级bundle, 升级本地依赖, 定位这依赖冲突到底冲突在了哪里. <--- 至少从这个堆栈里根本看不出来谁和谁冲突了. 所以没定位出来哈哈哈哈QAQ. 然后开始病急乱投医整自己本地的ruby版本, 发现又有3.1.0又有3.3.0但是`gem env`又展示了多版本, 于是安装了rbenv(ruby的多版本管理工具), 配置进了.zshrc还是报错. 其实写到这里我想, 或许把bunde再降回2.5.x或许和ruby 3.1.0就兼容了, 但是这种对于ruby的缺乏兴趣与理解让我太痛苦了. 一想到未来还要解决这些乱七八糟的问题, 我宁愿被js折磨. 于是决定拥抱js工具.  

那么那么, 切换一个新的静态页面生成工具需要几步呢?  

## 第一步, 选择一个工具🔧
基于JS的静态页面生成工具有很多,Gatsby, Astro, 11ty, next, etc. 且快速确定了目标: [Eleventy](https://www.11ty.dev/). 毕竟它的slogan:  
> Eleventy is a simpler static site generator.  

简单这个词一下子就击中了我的心.  
或者稍微对比一下也会发现:  
* For large, content-rich sites with a React focus, Gatsby is a strong contender. 
* Astro excels at building content-driven websites where minimal JavaScript and fast performance are crucial. 
* 11ty is a great choice for simpler static sites that value speed and flexibility with various templating languages. 
* Next.js offers a balance between static site generation and dynamic rendering, making it suitable for a wide range of projects. 

## 第二步, 本地调试新工具  
如果类似的经验不多, 建议使用新工具开启新的github分支, 在能保证自己现有博客一直能运行的前提下尝试新东西. 否则可能会出现进退两难的情况, 有一些挫败感.  
在梳理了[eleventy-base-blog](https://github.com/11ty/eleventy-base-blog)的博客结构之后我在主分支直接操作了.  
- 初始化package.json, 安装eleventy-base-blog里面的依赖
- 创建/复制eleventy-base-blog相关的文件夹和文件: _config, _data, _includes, css, public, .nojekyll, eleventy.config.js 和 netlify.toml
- 创建/复制eleventy-base-blog的content文件夹和文件: content的blog是真实的博客文章, 因此我把自己的143篇文章全部复制到blog文件夹下, 删除示例文章
- 本地运行: `npx @11ty/eleventy --serve`

__开始处理错误:__  
1. 每篇文章的开头保持统一格式, 有title, date和tags(tags必须是英文,不能是中文, 否则会报错<--这也贼坑), 例如:  
```
{% raw %}
---
title: 该网站在某些区域被阻止, 例如 中国
date: 2025-07-03
tags: self-talking
---
{% endraw %}
```
2. 文章内容的"#" 需要处理一下

2个错误处理完就能启动成功了, 只不过只有在这个时候我才发现文章多也不好, 至少开头之前用jekyll的时候就不一致, 大量的体力工作, 心里全是恨, 想写脚本的心情此刻来到了最高峰.  

## 第三步, 自定义样式  
11ty默认的博客样式是[蓝色调](https://demo-base-blog.11ty.dev/), 在参考了[colorhunt](https://colorhunt.co/)之后选择了绿色调于是添加了自定义css文件[customized-theme.css](https://github.com/sddtc/sddtc.github.com/blob/main/css/customized-theme.css). 这个文件会覆盖默认样式, 保持独立. 在软件工程领域里, 对修改关闭, 对扩展开放是好实践.  
因为`base.njk`文件是博客系统的基础文件, css文件自然要在这里进行额外的声明来保证它的加载, 因此添加一行:  
```html
{% raw %}
<style>{% include "css/customized-theme.css" %}</style>
{% endraw %}
```
它保证了自定义的css文件内容会被打包到统一的css文件里.  
而css文件夹也是在根目录下  

## 第四步, 添加自定义js脚本  
google页面统计和一些俏皮的脚本(鼠标点击出现二十四字社会主义核心价值观😉)也需要迁移. 类似于css脚本方式. 具体可以参考[代码片段](https://github.com/sddtc/sddtc.github.com/blob/main/_includes/layouts/base.njk#L51)

## 第五步, 部署!  
部署之后就404了, 于是紧急查看文档: [Deploy an Eleventy project to GitHub pages](https://www.11ty.dev/docs/deployment/#deploy-an-eleventy-project-to-git-hub-pages)  
快速修复之后上线了.  

之后再研究研究css, 让博客好看一些  
再研究研究11ty, 看看有什么好玩的插件  

谢谢大家的观看! 鞠躬!