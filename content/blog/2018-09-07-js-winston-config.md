---
title: winston 日志设置指南
date: 2018-09-07
tags: [js]
categories: [工程实践]
---

### 背景
为了清晰的定位出错误堆栈, 我们通常会将 `Error` 的 `stack` 信息输出, 那么使用强大好用的 winston 组件时, 如何优雅的设置呢?

### 思路
我们的日志输出是 `json` 格式的, 但是直接将 `Error` Json化会隐藏 `stack` 的信息, 于是, 我们希望能将 `Error.stack` 附加到结果中, 组成一个 `json` 结构的结果

我能想到最优雅的办法, 就是在 winston 的 `format` 方法里加一个 `converter` 的方法, 对 `Error` 做一个处理:

```javascript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    formatErrorConverter(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});
```

而 `converter` 的方法:

```javascript
const formatErrorConverter = winston.format((info) => {
  return info instanceof Error
    ? Object.assign({ stack: info.stack }, info)
    : info;
});
```

结果很简单, 但是坑的地方有两点:
1.winston 的文档里根本没有**示例**告诉你这种 `custom format` 怎么写
2.`combine`的顺序非常重要, `winston.format.json()` 一定必须要放在你自己实现的`formatErrorConverter()` 函数之后

突然发现搜到的**示例**就是人家 `winston` 家自己的 `examples` 🌚...
[示例里面有一段话格外瞩目](https://github.com/winstonjs/winston/blob/master/examples/format-mutate.js):

```
// Order is important here, the formats are called in the
// order they are passed to combine.
```

对不起 `winston` 我误会你了, 只是你的 `README` 太 `emmmmm`🌝

当然, 还搜到了一种可行的实现方式:

```javascript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json({ replacer: replaceErrors })
  ),
  transports: [new winston.transports.Console()]
});


function replaceErrors(key, value) {
    if (value instanceof Buffer) {
        return value.toString('base64');
    } else if (value instanceof Error) {
        var error = {};

        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });

        return error;
    }

    return value;
}
```

鉴于 `replacer` 这个关键字也无从文档可以查取, 并且也不如上面那个方案简单, 于是这个实现就仅此记录了.

### 下一步
使用 `filter` 特性去做敏感信息加星的实现方式


[感谢所有在 issues 里热心讨论的开发者](https://github.com/winstonjs/winston/issues/1243)
