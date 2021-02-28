---
title: "[Javascript] The Core (2)"
layout: post
categories: js
guid: urn:uuid:74071ae4-e14c-4c3d-b8ea-3d2666c187e4
tags:
  - javascript
---
**This article covers ES2017+ runtime system.**

[丨- Environment](#Environment)  
[丨- Closure](#Closure)  
[丨— This](#This)  

# Environment {#Environment} 

每个*execution context*都有一个关联的*lexical environment*.  
> ### Def. 9: Lexical environment: A lexical environment is a structure used to define association between identifiers appearing in the context with their values. Each environment can have a reference to an optional parent environment  

所以在一个*scope*里,  *environment*是变量,  方法,  类的存储空间. 从技术上讲,  environment是一组由*environment record*(将*identifiers*映射到值的实际存储表)和对父项的引用(可以为空)组成.  
例如:  
~~~
let x = 10;
let y = 20;
function foo(z) {
  let x = 100;
  return x + y + z;
}

console.log(foo(30)); //150;
~~~  
从逻辑上讲,  这提醒我们上面讨论过的*prototype chain*. *identifiers resolution*的规则非常相似: 如果在自己的*environment*中找不到变量, 则会尝试在*parent environment*中, 父级的父级中查找它,  等等 - 直到*the whole environment*为止.  
> ### Def. 10: Identifier resolution: the process of resolving a variable (binding) in an environment chain. An unresolved binding results to ReferenceError

这解释了为什么变量x被解析为100,  但不是10 - 它直接在foo的自己的*environment*中找到; 为什么我们可以访问参数z - 它也只存储在*activation environment*中; 以及为什么我们可以访问变量y - 它在*parent environment*中找到. 与*prototypes*类似, 几个*child environments*可以共享相同的*parent environment*:  
  
例如,  两个*global functions*共享相同的*global environment*. *environment*记录因*type*而异. 有*object environment*记录和*declarative environment*记录. 在*declarative*记录之上还有*function environment*记录和*module environment*记录. 记录的每种类型都只针对它的*properties*.  
  
但是, *identifier resolution*的通用机制在所有*environments*中都很常见, 并且不依赖于记录的类型. *object environment*记录可以是*global environment*的记录. 这样的记录也有关联的绑定对象,  它可以存储记录中的一些*properties*,  但不是其他属性, 反之亦然. 绑定对象也可以作为`this`提供.  
例如:  
~~~
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
~~~
请注意, 绑定对象的存在是为了覆盖*legacy constructs*,  如`var`-declarations和`with`-statements,  它们也将它们的对象作为绑定对象提供. 当*environment*被表示为简单对象时,  这些都是历史原因.  
  
目前, *environment model*更加优化, 但结果我们无法再访问绑定像访问*properties*. 我们已经看到*environment*是如何通过父链接相关的. 现在我们将看到一个*environment*如何*outlive*创造它的*context*. 这是我们即将讨论的闭包机制的基础.  

# Closure {#Closure}

ECMAScript中的函数是一流的. Functions是函数式编程的基础, 它们在JavaScript中被很好地支持.  
> ### Def. 11: First-class function: a function which can participate as a normal data: be stored in a variable,  passed as an argument,  or returned as a value from another function.  

与一流的functions的概念相关的是所谓的"Funarg问题"("A problem of a functional argument"),  它出现在functions不得不处理*free variables*时.  
> ### Def. 12: Free variable: a variable which is neither a parameter,  nor a local variable of this function.
  
让我们来分析下Funarg问题:  
例如:  
~~~
let x = 10;
 
function foo() {
  console.log(x);
}
 
function bar(funArg) {
  let x = 20;
  funArg(); // 10,  not 20!
}
 
// Pass `foo` as an argument to `bar`.
bar(foo);
~~~
对于函数foo, 变量x是*free variables*. 当foo函数被激活时(通过funArg参数) - 它应该在哪里解析x的绑定？从创建函数的外部作用域或调用者作用域当函数被调用时？正如我们所看到的, 调用者即bar函数也为x提供了绑定 - 值为20.  
上述用例被称为**downwards funarg problem**(向下漏斗问题), 即在确定绑定的正确环境时的模糊性：它应该是创建时的环境还是被调用时的环境？ 这是通过使用*static scope*的协议解决的, 也就是创建时的*scope*  
> ### Def. 13: Static scope: a language implements static scope,  if only by looking at the source code one can determine in which environment a binding is resolved.  

*static scope*(静态作用域)有时也被称为*lexical scope*(词法作用域), 而后被称为*lexical environments*. 从技术上讲, *static scope*是通过捕获*function is created*的环境来实现的.  
> ### Def. 14: Closure: A closure is a function which captures the environment where it’s defined. Further this environment is used for identifier resolution.  

在*a new fresh activation*环境中调用函数,  该环境存储局部变量和参数. *the activation environment*的*parent*环境设置为函数的闭包环境, 从而产生*the lexical scope*语义.  
例如:  
~~~
function fooFoo() {
  let x = 10;

  function bar() {
    return x;
  }
  
  return bar;
}

let xFoo = 20;
let barFoo = fooFoo();

barFoo();// 10,  not 20!
~~~
同样, 从技术上讲, 它与捕获*the definition environment*的机制没有区别. 就在这种情况下, 如果我们没有关闭, fooFoo的*the activation environment*将被*destroyed*.  
  
但是我们捕获了它, 所以它不能被*deallocated*, 并且被保留 - 以支持*static scope*语义.  
  
通常对闭包有一个不完全的理解 - 通常开发人员只依照*upward*的funarg问题来考虑闭包(实际上它确实更有意义).但是, 正如我们所看到的, *upward*和*downwards*的funarg问题的技术机制完全相同 - 并且是*the static scope*的机制.  
  
如上所述, 与*prototypes*类似, 可以跨多个闭包共享相同的父环境. 这允许访问和改变共享数据,  
例如：  
~~~
function createCounter() {
  let count = 0;

  return {
    increment() {count++; return count;}, 
    decrement() {count--; return count;}, 
  };
}

let counter = createCounter();
console.log(
  counter.increment(),  //1
  counter.decrement(),  //0
  counter.increment(),  //1
);
~~~
由于在包含count变量的作用域内创建了闭包 *increment*和*decrement*, 因此它们*share this parent scope*. 也就是说, 捕获总是"by-reference"发生 - 意味着存储了对整个父环境的引用.  
某些语言可以捕获"by-value", *making copy of* 被捕获的*variable*, 并且不允许在父作用域中更改它.  
  
但是在Javascript中, 要记得, 它始终是对父作用域的引用. *implementations*可以优化该步骤, 不捕获整个*environment*. 捕获*used free-variables*, 但它们仍然保持*parent scopes*中可变数据的不变性.    
  
所有*identifiers*都是*statically scoped*.但是有一个值在ECMAScript中是*dynamically scoped*.它就是*this*

# This {#This}
TBC
