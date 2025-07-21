---
title: 请不要再使用字段注入依赖的方式啦
date: 2017-12-08
tags: translation
---

### 背景

使用字段直接依赖注入的方式非常流行, 从使用Spring框架开始到现在, 我们大概都是从: 写配置文件(xml) -> 写`setter`方法 -> 添加`@Autowired` 一路走到现在.
然而, 字段注解依赖有一些不方便的地方和缺点, 从你明白的那一刻开始, 或许我们可以改掉这个习惯.

### 注解方式

通常有三种比较主流的依赖注入方式: 构造函数, `setter`方法注入, 字段添加注解注入.
让我们看下实现方式, 如下:
#### Constructor
```java
private DependencyA dependencyA;
private DependencyB dependencyB;
private DependencyC dependencyC;

@Autowired
public DI(DependencyA dependencyA, DependencyB dependencyB, DependencyC dependencyC) {
    this.dependencyA = dependencyA;
    this.dependencyB = dependencyB;
    this.dependencyC = dependencyC;
}
```
#### Setter
```java
private DependencyA dependencyA;
private DependencyB dependencyB;
private DependencyC dependencyC;

@Autowired
public void setDependencyA(DependencyA dependencyA) {
    this.dependencyA = dependencyA;
}

@Autowired
public void setDependencyB(DependencyB dependencyB) {
    this.dependencyB = dependencyB;
}

@Autowired
public void setDependencyC(DependencyC dependencyC) {
    this.dependencyC = dependencyC;
}
```
#### Field
```java
@Autowired
private DependencyA dependencyA;

@Autowired
private DependencyB dependencyB;

@Autowired
private DependencyC dependencyC;
```

### 发现什么了吗?

字段注解的方式实现起来是三种里面最简单明了的, 可读性高 你的类只需要专注于自己的实现, 仅仅需要添加一个`@Autowired`即可
没有多余代码的干扰: 没有构造函数, 没有`setter`函数的实现方式, 哪怕`Java`本身是一个非常`重`的语言, 字段注解的方式看起来那么友好和干净

### 或许违背了单一职责原则?

字段注解注入依赖太容易实现了以至于你在不知不觉中添加了更多的依赖, 你可以添加6个, 10个甚至一打 如果当初你选择了构造函数的注入方式, 那么想象一下拥有12个参数的构造函数会多么的惊悚?
那个时候你会发现似乎有点问题了: 当一个类的依赖膨胀, 说明它自己背负了太多职责. 这样违反了我们希望每个类只有单一职责的初衷. 当问题暴露, 我们可以通过重构的方式拆分、 分解出多个符合条件的类来完成我们想完成的事.
然而不幸的是, 当我们使用了字段注解注入, 这个问题不是那么容易暴露出来

### 隐式依赖

使用DI容器意味着类不再负责管理自己的依赖关系. `DI`容器从类中获取依赖关系. 其它类负责提供相关性 - `DI`容器或在测试中手动分配它们. 当类不再负责获得它的依赖时, 它应该使用接口 - 方法或构造函数清楚地传达它们. 这样就很清楚这个类需要什么以及它是可选的(`setters`)还是强制的(构造函数).

### DI容器的耦合性

`DI`框架的核心思想之一是: 托管类不应该依赖所使用的`DI`容器. 换句话说, 它应该只是一个普通的`POJO`, 可以独立实例化, 只要你传递了所有必需的依赖关系即可. 这样, 你可以在单元测试中实例化它, 而无需启动`DI`容器并单独进行测试(容器将更多的是集成测试). 如果没有容器耦合, 则可以将该类用作托管或非托管, 甚至可以切换到新的`DI`框架.

**但是**, 当直接注入字段时, 不提供实例化具有所有必需依赖项的类的方法. 这意味着:

* 有一种方法(通过调用默认构造函数)在缺少某些依赖的情况下使用 new 创建对象, 则将导致`NullPointerException`.
* 这样的类不能在`DI`容器(测试，其他模块)之外重复使用, 因为除了反射之外, 没有办法为它提供所需的依赖关系.

### 不可变性

与构造函数不同的是, 我们不能使用字段注入将依赖关系定义为`final`类型, 于是对象是可变的.

### 使用构造函数还是使用Setter?

如果舍弃字段依赖注入的方式, 那么我们选择构造函数还是`setter`? 这是一个好问题:)

#### Setters

应该使用Setter来注入可选的依赖关系. 类没有提供时也能够正常运行. 对象实例化后, 依赖关系可以随时更改. 视情况而定, 这可能不是一个绝妙的方式. 因为有时我们需要拥有一个不可变的对象.
然而, 有时在运行时更改对象的协作者是很好的 - 比如`JMX`托管的`MBean`.

`Spring 3.x` 的[官方文档](https://docs.spring.io/spring/docs/3.1.x/spring-framework-reference/html/beans.html#d0e2778) 鼓励我们尽量使用`setter`方法:

> #### "The Spring team generally advocates setter injection, because large numbers of constructor arguments can get unwieldy, especially when properties are optional. Setter methods also make objects of that class amenable to reconfiguration or re-injection later. Management through JMX MBeans is a compelling use case.

> #### Some purists favor constructor-based injection. Supplying all object dependencies means that the object is always returned to client (calling) code in a totally initialized state. The disadvantage is that the object becomes less amenable to reconfiguration and re-injection."

#### Constructors

构造函数注入对强制性依赖是有利的. 我们认定那些依赖是对象所必须需要的功能. 通过在构造函数中提供这些对象, 可以确保该对象在构建时立即使用. 在构造函数中分配的字段也可以是`final`类型的，允许对象完全不可变或至少保护其必需的字段.
使用构造函数提供依赖关系的一个后果是: 以这种方式构造的两个对象之间的循环依赖不再可能(与setter注入不同). 这实际上是一个好事而不是限制. 我们应该避免循环依赖, 这通常是一个糟糕的设计的标志. 因此这样做可以防止这种现象产生.

另一个优点是, 如果使用`spring 4.3+`, 你可以完全分离你的类与DI框架. 原因是`Spring`现在支持一个构造函数的[隐式构造函数注入](https://spring.io/blog/2016/03/04/core-container-refinements-in-spring-framework-4-3). 这意味着你不再需要在你的类中使用DI注解.
当然, 你可以通过在给定类的`spring`配置中明确地配置`DI`来达到同样的效果, 这样做可以使整个过程变得简单.

有趣的是, 在`Spring 4.x`中, [官方文档](https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/beans.html#beans-constructor-injection)不再给我们建议尽量使用`setter`而不用构造函数了:)

> #### "The Spring team generally advocates constructor injection as it enables one to implement application components as immutable objects and to ensure that required dependencies are not null. Furthermore constructor-injected components are always returned to client (calling) code in a fully initialized state. As a side note, a large number of constructor arguments is a bad code smell, implying that the class likely has too many responsibilities and should be refactored to better address proper separation of concerns.

> #### Setter injection should primarily only be used for optional dependencies that can be assigned reasonable default values within the class. Otherwise, not-null checks must be performed everywhere the code uses the dependency. One benefit of setter injection is that setter methods make objects of that class amenable to reconfiguration or re-injection later."


## 总结

综上所述, 我们应该尽量避免通过字段注解的方式注入依赖. 作为替代, 您应该使用构造函数或`setter`方法来注入您的依赖关系.
两者都有其优点和缺点, 具体选择取决于具体的情况.
但是, 由于这些方法可以混合使用, 所以这两种方法并不互斥, 你可以在一个类中同时使用`setter`和构造函数注入. 构造函数更适合于强制性的依赖关系, 并且在不变性的时候. `Setter`更适合可选的依赖关系.

本文译自[Field Dependency Injection Considered Harmful](http://vojtechruzicka.com/field-dependency-injection-considered-harmful/)
