---
title: "[javascript]Javascript. The Core"
layout: post
categories: sddtc tech
guid: urn:uuid:74071ae4-e14c-4c3d-b8ea-3d2666c187e3
tags:
  - javascript
---

**This article covers ES2017+ runtime system.**

ECMAScript 是一种面向对象的语言, 以 `prototype` 为基本组织形式, 核心表现形式为 *object*.

### *Object*

> Def. 1: Object: An object is a collection of properties, and has a single prototype object. The prototype may be either an object or the null value.

对象是一组 `properties` 的集合, 有唯一的 `prototype` 对象, 该对象要么是 `null`, 要么是另外一个对象.  
例如:

```
let point = {
  x: 10,
  y: 20
};

```
这样, 我们创建了一个对象, 它包含两个显式的属性(x, y)与一个隐式的属性`__proto__`, 这个隐式属性的引用与`point`关联  

*prototype objects* 常常在`ECMAScript`的`dynamic dispatch`机制方面用来实现继承的特性  

### *Prototype*

每个对象在**创建**后便拥有`prototype`属性, 如果没有显式的赋值, 对象会拥有一个`default prototype`.  

> Def. 2: Prototype: A prototype is a delegation object used to implement prototype-based inheritance.(原型是用于实现基于原型的继承的委托对象)

*prototype* 可以被`__proto__`显式的赋值, 或者通过`Object.create`方法.  
例如:  

```
// Base object.
let point = {
  x: 10,
  y: 20,
};
 
// Inherit from `point` object.
let point3D = {
  z: 30,
  __proto__: point,
};
 
console.log(
  point3D.x, // 10, inherited
  point3D.y, // 20, inherited
  point3D.z  // 30, own
);
```

任何对象都可以作为其它对象的`prototype`, 每个对象亦可以拥有自己的`prototype`. 如果对象有`prototype`并且非空, 以此类推可称之为`prototype chain`.  

> Def. 3: Prototype chain: A prototype chain is a finite chain of objects used to implement inheritance and shared properties.  

`a prototype chain`的规则很简单, 如果`object A`没有属性`x`, 那么会查找`object A`的`prototype`有没有属性`x`、 查找`object A`的`prototype`的`prototype`、 以此类推. 直到遍历完整个`chain`.  

**从技术上讲，这种机制被称为`dynamic dispatch`或`dynamic delegation`**  

> Def. 4: Delegation: a mechanism used to resolve a property in the inheritance chain. The process happens at runtime, hence is also called dynamic dispatch.  

若遍历完整个`prototype chain`依然没有找到属性`x`, 那么程序会返回`undefined`.  
例如:  

```
// An "empty" object.
let empty = {};
 
console.log(
 
  // function, from default prototype
  empty.toString,
   
  // undefined
  empty.x,
 
);
```
我们会看到, 当创建一个对象时, 就算是空对象它也永远不是真正的**empty**, 因为它总会从`Object.prototype`上继承些什么. 除非我们显式的将它的`prototype`置为`null`:  
例如:  

```
// Doesn't inherit from anything.
let dict = Object.create(null);
 
console.log(dict.toString); // undefined
```
`The dynamic dispatch`机制允许继承链的完全可变性，提供更改委托对象的能力:  
例如: 
 
```
let protoA = {x: 10};
let protoB = {x: 20};
 
// Same as `let objectC = {__proto__: protoA};`:
let objectC = Object.create(protoA);
console.log(objectC.x); // 10
 
// Change the delegate:
Object.setPrototypeOf(objectC, protoB);
console.log(objectC.x); // 20
```
尽管`__proto__`时至今日已经标准化, 使用方便容易理解, 但我们仍然倾向于使用API来操作对象的`prototype`, 例如方法`Object.create`, `Object.getPrototypeOf`, `Object.setPrototypeOf`.  

我们学习了`Object.prototype`, 知道它的优势是可以在多个对象间共享, 基于这个原则, 让我们来看看JS里面的`"class"`.

### *Class*

当多个对象拥有统一的行为和相同的初始状态时, 他们便可以当成一类对象.  

> Def. 5: Class: A class is a formal abstract set which specifies initial state and behavior of its objects.  

例如:  

```
let letter = {
  getNumber() {
    return this.number;
  }
};
 
let a = {number: 1, __proto__: letter};
let b = {number: 2, __proto__: letter};
// ...
let z = {number: 26, __proto__: letter};
 
console.log(
  a.getNumber(), // 1
  b.getNumber(), // 2
  z.getNumber(), // 26
);
```

这种方式虽然可以实现需求, 但是显得很麻烦, 而类正是为了解决这个问题(语法糖), 构造方法也有同样的效果, 只是在这里类看起来更加的适合.  
例如:  

```
class Letter {
    constructor(number) {
        this.number = number;
    }

    getNumber() {
        return this.number;
    }
}

let letterA = new Letter(1);
let letterB = new Letter(2);
//
let letterZ = new Letter(26);

console.log(
    letterA.getNumber(),
    letterB.getNumber(),
    letterZ.getNumber()
);
```
从技术上来讲, `"class"` = 构造方法 + `prototype`的组合实现. 使用构造方法来创建对象, 该对象会自动被赋予`prototype`的属性, 该属性存储在`<ConstructorFunction>.prototype`.  

> Def. 6: Constructor: A constructor is a function which is used to create instances, and automatically set their prototype.

在以前, 开发人员用以下方式来实现类似于`构造方法`的功能:  
例如:  

```
function LegacyLetter(number) {
    this.number = number;
}

LegacyLetter.prototype.getNumber = function() {
    return this.number;
}

let legacyA = new LegacyLetter(1);
let legacyB = new LegacyLetter(2);
let legacyZ = new LegacyLetter(26);

console.log(
    legacyA.getNumber(),
    legacyB.getNumber(),
    legacyZ.getNumber(),
)
```
虽然创建单层构造函数非常简单, 但父类的继承模式需要更多的模板. 目前, 这个模板作为一个实现细节隐藏起来: 这正是我们在JavaScript中创建一个类时发生的情况.  

*Note* 任何对象的实际原型总是__proto__引用. 而构造函数的显式原型属性只是对其实例原型的引用; 从实例中它仍然被__proto__引用. [具体细节在此](http://dmitrysoshnikov.com/ecmascript/chapter-7-2-oop-ecmascript-implementation/#explicit-codeprototypecode-and-implicit-codeprototypecode-properties)  

到目前为止, 我们已经理解了ECMAScript的对象相关的知识, 接下来让我们学习更深一层的知识: *JS runtime system*  

### *Execution context*

ECMAScript定义了*execution context*来执行和追踪JS code.  *execution context*在逻辑上用一个栈来表示.  

> Def. 7: Execution context: An execution context is a specification device that is used to track the runtime evaluation of the code.  
   
ECMAScript代码有几种类型：the global code, function code, eval code, and module code; 每种都在其*execution context*中进行评估. 不同的代码类型及其适当的对象可能会影响*execution context*的结构: 例如, *generator functions*将其生成器对象保存在*execution context*中.  

例如一个递归函数如下所示:  

```
 function recursive(flag) {
      if(flag === 2) {
          return;
      }
      recursive(++flag);
  }

  recursive(0);
```
当函数被调用时, 一个新的*execution context*被初始化出来, 并被放入栈中, 此时它是一个*active*的*execution context*. 当函数执行完返回时, 它的*context*从栈中退出.  

*context*如果还调用了其它*context*, 我们称之为*caller*, 被调用的那一方我们称之为*callee*. 在上面的例子里, 递归函数`recursive`既是*caller*也是*callee*.  

> Def. 8: Execution context stack: An execution context stack is a LIFO structure used to maintain control flow and order of execution.  
  
*the global context*永远在栈的最底层, 它是在执行任何其他*context*之前创建的.   
 
一般情况下, *context*的代码可运行至完成, 但正如我们上面提到的那样, 某些对象(如*generators*)可能会违反堆栈的LIFO顺序. *generators*可以暂停其*running context*, 并在完成之前将其从堆栈中移除. 一旦*generator*再次激活, 其*context*恢复并再次被压入堆栈:  
例如:  

```
function *gen() {
    yield 1;
    return 2;
  }
   
  let g = gen();
   
  console.log(
    g.next().value, // 1
    g.next().value, // 2
  );

```

接下来, 我们将讨论`execution context`的重要组成部分; 特别是我们应该看到ECMAScript运行时如何管理`variables storage, and scopes created by nested blocks of a code`. 这是一个通用概念, 用于JS存储数据, 并通过闭包机制解决Funarg问题.  

### *Environment* 

每个*execution context*都有一个关联的*lexical environment*.  

> Def. 9: Lexical environment: A lexical environment is a structure used to define association between identifiers appearing in the context with their values. Each environment can have a reference to an optional parent environment  

所以在一个*scope*里, *environment*是变量, 方法, 类的存储空间  
从技术上讲, environment是一组由*environment record*(将*identifiers*映射到值的实际存储表)和对父项的引用(可以为空)组成。 
例如:  

```
let x = 10;
  let y = 20;
  function foo(z) {
      let x = 100;
      return x + y + z;
  }

  console.log(foo(30)); //150;
 ```  
 
从逻辑上讲, 这提醒我们上面讨论过的*prototype chain*。 *identifiers resolution*的规则非常相似: 如果在自己的*environment*中找不到变量，则会尝试在*parent environment*中，父级的父级中查找它, 等等 - 直到*the whole environment*为止.  
 
> Def. 10: Identifier resolution: the process of resolving a variable (binding) in an environment chain. An unresolved binding results to ReferenceError

这解释了为什么变量x被解析为100, 但不是10 - 它直接在foo的自己的*environment*中找到; 为什么我们可以访问参数z - 它也只存储在*activation environment*中; 以及为什么我们可以访问变量y - 它在*parent environment*中找到.  

与*prototypes*类似，几个*child environments*可以共享相同的*parent environment*: 例如, 两个*global functions*共享相同的*global environment*.  

*environment*记录因*type*而异. 有*object environment*记录和*declarative environment*记录. 在*declarative*记录之上还有*function environment*记录和*module environment*记录. 记录的每种类型都只针对它的*properties*. 但是，*identifier resolution*的通用机制在所有*environments*中都很常见，并且不依赖于记录的类型.  

*object environment*记录可以是*global environment*的记录. 这样的记录也有关联的绑定对象, 它可以存储记录中的一些*properties*, 但不是其他属性，反之亦然. 绑定对象也可以作为`this`提供.  
例如:  

```
  var xEnvironment = 10;
  let yEnvironment = 20;

  console.log(
      xEnvironment,
      yEnvironment,
  )

  console.log(
      this.xEnvironment,
      this.yEnvironment,
  )

  this['not valid ID'] = 30;

  console.log(
      this['not valid ID'],
  );

```

请注意，绑定对象的存在是为了覆盖*legacy constructs*, 如`var`-declarations和`with`-statements, 它们也将它们的对象作为绑定对象提供. 当*environment*被表示为简单对象时, 这些都是历史原因. 目前，*environment model*更加优化，但结果我们无法再访问绑定像访问*properties*.  

我们已经看到*environment*是如何通过父链接相关的. 现在我们将看到一个*environment*如何*outlive*创造它的*context*. 这是我们即将讨论的闭包机制的基础.  

### *Closure*

ECMAScript中的函数是一流的。 Functions是函数式编程的基础，它们在JavaScript中被很好地支持。  

> Def. 11: First-class function: a function which can participate as a normal data: be stored in a variable, passed as an argument, or returned as a value from another function.  

与一流的functions的概念相关的是所谓的"Funarg问题"("A problem of a functional argument"), 它出现在functions不得不处理*free variables*时.  

> Def. 12: Free variable: a variable which is neither a parameter, nor a local variable of this function.
  
让我们来分析下Funarg问题:  
例如:  

```
let x = 10;
 
function foo() {
  console.log(x);
}
 
function bar(funArg) {
  let x = 20;
  funArg(); // 10, not 20!
}
 
// Pass `foo` as an argument to `bar`.
bar(foo);
```
对于函数foo，变量x是*free variables*。 当foo函数被激活时(通过funArg参数) - 它应该在哪里解析x的绑定？从创建函数的外部作用域或调用者作用域当函数被调用时？正如我们所看到的，调用者即bar函数也为x提供了绑定 - 值为20。  

上述用例被称为**downwards funarg problem**(向下漏斗问题)，即在确定绑定的正确环境时的模糊性：它应该是创建时的环境还是被调用时的环境？  

这是通过使用*static scope*的协议解决的，也就是创建时的*scope*  

> Def. 13: Static scope: a language implements static scope, if only by looking at the source code one can determine in which environment a binding is resolved.  

*static scope*(静态作用域)有时也被称为*lexical scope*(词法作用域)，而后被称为*lexical environments*。  
从技术上讲，*static scope*是通过捕获*function is created*的环境来实现的。  

> Def. 14: Closure: A closure is a function which captures the environment where it’s defined. Further this environment is used for identifier resolution.  

TBC



