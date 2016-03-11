---
layout: post
title: "EI Capitan jekyll can't run"
date: "2015-10-14"
categories: sddtc work
tags: [jekyll, ruby]
---

EI Capitan是mac目前最新版的系统，作为更新强迫症患者总是第一时间更新  
只是这一次才发现，原来mac也会对用户安装的程序有细微的影响。。  

事情比较简单，更新了系统，jekyll用不了了  
多亏坐在我旁边好奇的lily发现了这个bug。。！  

本来本机安装的ruby的路径(/System/Library/Frameworks/Ruby.framework/Versions/2.0/usr/lib/ruby/gems/2.0.0/gems)下应该是有jekyll组件的  
没了重新安装时，出现了无法写入"/usr/bin/jekyll"的错误，no permission  
安装方式  

```
sudo gem install jekyll
```

而后发现github上有很多人都提出了这个问题，应该是系统更新后，有些方式变了，由于我对ruby了解不多，在此先不做讨论  
解决方法  
1.将jekyll组件安装在用户路径之下  

```
sudo gem install -n /usr/local/bin jekyll
```

2.运行jekyll报错  

```
➜  demo  jekyll serve --trace
Configuration file: /Users/sddtc/Code/Jekyll/demo/_config.yml
            Source: /Users/sddtc/Code/Jekyll/demo
       Destination: /Users/sddtc/Code/Jekyll/demo/_site
      Generating...
                    done.
I, [2015-10-14T16:18:09.163411 #4957]  INFO -- : Celluloid 0.17.2 is running in BACKPORTED mode. [ http://git.io/vJf3J ]
/Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/calls.rb:48:in `check': wrong number of arguments (2 for 1) (ArgumentError)
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/calls.rb:26:in `dispatch'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/call/sync.rb:16:in `dispatch'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/cell.rb:50:in `block in dispatch'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/cell.rb:76:in `block in task'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/actor.rb:339:in `block in task'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/task.rb:44:in `block in initialize'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/task/fibered.rb:14:in `block in create'
	from (celluloid):0:in `remote procedure call'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/call/sync.rb:45:in `value'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-0.17.2/lib/celluloid/proxy/sync.rb:38:in `method_missing'
	from /Library/Ruby/Gems/2.0.0/gems/listen-2.7.9/lib/listen/listener.rb:196:in `_init_actors'
	from /Library/Ruby/Gems/2.0.0/gems/listen-2.7.9/lib/listen/listener.rb:77:in `block in <class:Listener>'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-fsm-0.20.5/lib/celluloid/fsm.rb:176:in `instance_eval'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-fsm-0.20.5/lib/celluloid/fsm.rb:176:in `call'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-fsm-0.20.5/lib/celluloid/fsm.rb:129:in `transition_with_callbacks!'
	from /Library/Ruby/Gems/2.0.0/gems/celluloid-fsm-0.20.5/lib/celluloid/fsm.rb:97:in `transition'
	from /Library/Ruby/Gems/2.0.0/gems/listen-2.7.9/lib/listen/listener.rb:90:in `start'
	from /Library/Ruby/Gems/2.0.0/gems/jekyll-watch-1.1.0/lib/jekyll/watcher.rb:7:in `watch'
	from /Library/Ruby/Gems/2.0.0/gems/jekyll-2.5.3/lib/jekyll/commands/build.rb:68:in `watch'
	from /Library/Ruby/Gems/2.0.0/gems/jekyll-2.5.3/lib/jekyll/commands/build.rb:38:in `process'
	from /Library/Ruby/Gems/2.0.0/gems/jekyll-2.5.3/lib/jekyll/commands/serve.rb:26:in `block (2 levels) in init_with_program'
	from /Library/Ruby/Gems/2.0.0/gems/mercenary-0.3.4/lib/mercenary/command.rb:220:in `call'
	from /Library/Ruby/Gems/2.0.0/gems/mercenary-0.3.4/lib/mercenary/command.rb:220:in `block in execute'
	from /Library/Ruby/Gems/2.0.0/gems/mercenary-0.3.4/lib/mercenary/command.rb:220:in `each'
	from /Library/Ruby/Gems/2.0.0/gems/mercenary-0.3.4/lib/mercenary/command.rb:220:in `execute'
	from /Library/Ruby/Gems/2.0.0/gems/mercenary-0.3.4/lib/mercenary/program.rb:35:in `go'
	from /Library/Ruby/Gems/2.0.0/gems/mercenary-0.3.4/lib/mercenary.rb:22:in `program'
	from /Library/Ruby/Gems/2.0.0/gems/jekyll-2.5.3/bin/jekyll:20:in `<top (required)>'
	from /usr/local/bin/jekyll:23:in `load'
	from /usr/local/bin/jekyll:23:in `<main>'
```

3.解决这个错误也是有人提出修改一下Celluloid的安装版本,用0.16.0  

```
➜  demo  sudo gem install celluloid --version '=0.16.0'
Fetching: timers-4.0.4.gem (100%)
Successfully installed timers-4.0.4
Fetching: celluloid-0.16.0.gem (100%)
Successfully installed celluloid-0.16.0
Parsing documentation for timers-4.0.4
Installing ri documentation for timers-4.0.4
Parsing documentation for celluloid-0.16.0
Installing ri documentation for celluloid-0.16.0
2 gems installed

➜  demo  sudo gem uninstall celluloid --version '=0.17.2'  
Successfully uninstalled celluloid-0.17.2
```

4.可以查看一下本地安装的组件，没用的也可以删掉了  

```
gem list --local
```
