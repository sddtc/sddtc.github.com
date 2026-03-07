---
title: Why typescript ?
date: 2018-08-05
tags: [js, Typescript]
categories: [语言生态]
---

### 背景
使用 JS 有一定时间了, 最近开始学习并使用 Typescript, 而我们可爱的 Tomasz 分享了一个很棒的书, 正所谓万事皆有因果, 今日先分享一切的**因** 🎧

> Typescript 最终会编译为 Javascript, 于是程序执行时的语言是 Javascript (不论是在浏览器端亦或是服务器端).

### 那么, 为什么要用 TypeScript ？
TypeScript 语言有两个主要的目标:

* 为 JavaScript 提供 **Optional** 的类型体系
* 提供从未来 JavaScript 发行版本到当前 JavaScript engines 的计划功能

对以上两个目标的渴望, 是建立在以下特点之上:

### The TypeScript type system
也许你会问, 为什么要给 Javascript 添加"类型" ?

类型已经被广泛证明能够提高代码质量, 增强可阅读性. 大型团队(谷歌, 微软, Facebook)不断得出这个结论. 特别:

* 在进行重构时, 类型可以提高您的敏捷性. 编译器捕获错误比在运行时失败更好.
* 类型是您可以拥有的最佳文档形式之一. 函数签名是一个定理, 而函数体是证明.

然而, 类型有一种低调的方式实现. TypeScript 非常讲究保持入门门槛尽可能低.

那么怎么实现这一目标呢?

#### JavaScript 即 TypeScript
TypeScript 为 JavaScript 代码提供编译时类型安全性. 鉴于它的名字, 这并不奇怪. 最棒的是这些类型是完全可选的. 您的 JavaScript 代码 `.js` 文件可以重命名为 `.ts` 文件, TypeScript 仍然会返回与原始 JavaScript 文件等效的有效 `.js` 文件. TypeScript 是有意且严格地是 JavaScript 的超集, 具有可选的类型检查.

#### 类型可以是隐式的
TypeScript 将尝试尽可能多地推断出类型信息, 以便在代码开发过程中以最小的生产成本为您提供类型安全性. 例如, 在下面的示例中, TypeScript 推断出 `foo` 的类型是 `number`, 并将在第二行显示错误, 如下所示:

```javascript
var foo = 123;
foo = '456'; // Error: cannot assign `string` to `number`

// Is foo a number or a string?
```

这种类型推断很有用. 如果您运行以上代码, 则在代码其他部分, 您无法确定 `foo` 到底是数字类型还是字符串类型. 这些问题经常出现在大型代码库里. 我们稍后将深入探讨类型推断规则.

#### 类型可以是显式的
正如我们之前提到的, TypeScript 会尽可能安全地推断, 但是您可以显式的指定类型:

1. 帮助编译器识别类型, 更重要的是为下一个必须阅读代码的开发人员提供更多的信息(可能是未来的你！）
2. 强制执行编译器看到的内容, 就是您认为应该看到的内容.  这就是您对代码的理解与代码的算法分析(由编译器完成)相匹配.

TypeScript 使用后缀类型注释.

```javascript
var foo: number = 123;

var foo: number = '123'; // Error: cannot assign a `string` to a `number`
```

#### 类型是结构型的
在某些语言中, 静态类型会强迫你做没有必要的定义, 即使您知道代码可以正常工作, 语言语义也会迫使您复制内容. 在 TypeScript 中, 因为我们希望它对于具有最小认知过载的 JavaScript 开发人员来说很容易, 所以类型是结构性的. 例如:

```javascript
interface Point2D {
    x: number;
    y: number;
}
interface Point3D {
    x: number;
    y: number;
    z: number;
}
var point2D: Point2D = { x: 0, y: 10 }
var point3D: Point3D = { x: 0, y: 10, z: 20 }
function iTakePoint2D(point: Point2D) { /* do something */ }

iTakePoint2D(point2D); // exact match okay
iTakePoint2D(point3D); // extra information okay
iTakePoint2D({ x: 0 }); // Error: missing information `y`
```

#### 类型错误不会阻塞 JavaScript
为了便于您将 JavaScript 代码迁移到 TypeScript, 即使存在编译错误, 默认情况下 TypeScript 也会尽可能地编译为有效的 JavaScript. 例如:

```javascript
var foo = 123;
foo = '456'; // Error: cannot assign a `string` to a `number`
```

也会被编译为:

```javascript
var foo = 123;
foo = '456';
```

因此, 您可以将 JavaScript 代码逐步升级为 TypeScript. 这与其他语言编译器的工作方式有很大不同, 也是转向 TypeScript 的另一个原因.

#### 类型可以是 ambient 的
TypeScript 的主要设计目标是使您能够安全、 轻松地使用 TypeScript 中的现有 JavaScript 库. TypeScript 通过 `declaration` 来做到这一点. TypeScript 为您提供了一个 `sliding scale`, 表明您希望在 `declaration` 中投入多少, 您付出的努力越多, 您获得的类型安全 + 代码就越多. 请注意, 大多数流行的 JavaScript 库的定义已经由 DefinitelyTyped 社区为您编写, 因此对于大多数用途:

1. 定义文件已存在.
2. 或者至少, 您已经拥有大量经过深思熟虑的 TypeScript 声明模板列表.

作为如何编写自己的声明文件的快速示例, 请考虑 `jquery` 的一个简单示例. 默认情况下(正如预期的良好 JS 代码). TypeScript 要求您在使用变量之前声明(即在某处使用 `var`):

```javascript
$('.awesome').show(); // Error: cannot find name `$`
```

若要快速修复, 你可以告诉 TypeScript 确实存在一个名为 `$` 的东西:

```javascript
declare var $: any;
$('.awesome').show(); // Okay!
```

如果您愿意, 可以基于此基本定义构建并提供更多信息以帮助保护您免受错误的影响:

```javascript
declare var $: {
    (selector:string): any;
};
$('.awesome').show(); // Okay!
$(123).show(); // Error: selector needs to be a string
```

#### Future JavaScript => Now
TypeScript 提供了许多针对当前 JavaScript 引擎(仅支持 `ES5` 等)在 `ES6` 中规划的功能. `The typescript team` 正在积极地添加这些功能, 这个列表只会随着时间的推移而变大, 我们将在其自己的部分中介绍. 一个关于 `class` 的示例:

```javascript
class Point {
    constructor(public x: number, public y: number) {
    }
    add(point: Point) {
        return new Point(this.x + point.x, this.y + point.y);
    }
}

var p1 = new Point(0, 10);
var p2 = new Point(10, 20);
var p3 = p1.add(p2); // { x: 10, y: 30 }
```

可爱的橘猫般的 `=> ` 功能：

```javascript
var inc = x => x+1;
```

译自:
[basarat.gitbooks.io/typescript](https://basarat.gitbooks.io/typescript/content/docs/why-typescript.html)

