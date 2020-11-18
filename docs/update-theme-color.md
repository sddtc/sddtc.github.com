# 更新博客主题颜色

css 主题文件: [style.css](https://github.com/sddtc/sddtc.github.com/blob/master/media/css/style.css)  
配色网站推荐: [colorhunt](https://colorhunt.co/)  

### 博客背景色和默认字体颜色

```
body {
    color: #002b36;
    min-height: 100%;
    background-color: #f3eac2;
    position: relative;
    font-family: telexregular, Hiragino Sans GB, Microsoft YaHei, Courier, sans-serif;
    line-height: 2.4em;
}
```

* 背景色: `background-color`
* 字体默认颜色: `color`

### 博客标题和文章内容页面标题配色

```
a {
    color: #ec524b;
}

hr {
    border: 0.1em dashed #ec524b;
    border-radius: 0.1em;
}

h2 {
    color: #16697a;
}

h3 {
    color: #db6400;
}

h4 {
    color: #ffa62b;
}
```
 
* 链接配色: `a`
* 标题配色: `h2, h3, h4`
* 分隔符配色: `hr`

### 博客底部相关配色

```
.footer {
    position: absolute;
    bottom: 15px;
    width: 100%;
    height: 20px;
    text-align: center;
    color: #f5b461;
}

.footer a {
    color: #ec524b;
}
```

### 博客列表页相关配色

```
ul.listing li.listing-item time {
    color: #f5b461;
}

ul.listing li.listing-seperator {
    margin: 1em 0;
    color: #f5b461;
}

ul.listing li.listing-seperator a {
    color: #f5b461;
}

ul.listing li.listing-seperator:before {
    content: "♥ ";
    color: #f5b461;
}
```
