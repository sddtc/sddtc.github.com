---
layout: post
title: "jekyll highlight"
---

jekyll语法高亮之pygments系列：  
1.下载[https://pypi.python.org/pypi/Pygments]Pygments-x.x.tar.gz,解压安装  
```python
sudo python setup.py install
```
2.选择一种喜欢的代码高亮样式，我用的native  
通过命令可以查看支持的样式:  
```python
>>>from pygments.styles import STYLE_MAP
>>>STYLE_MAP.keys()
```
3.应用在jekyll里:  
```vim
cd $path/css
pygmentize -S native -f html > pygments.css
```
4.在layout中引用该pygments.css  
5.修改jekyll的_config.yml  
```vim
markdown: redcarpet
pygments: true
```
