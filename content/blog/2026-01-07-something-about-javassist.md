---
title: Something About Javassist
date: 2026-01-07
tags: [java]
---

Javassist（Java编程助手）简化了Java字节码的操作。它是一个用于编辑Java字节码的类库；它允许Java程序在运行时定义新类，并在JVM加载类文件时对其进行修改。
与其他类似的字节码编辑器不同，Javassist提供了两个级别的API：源代码级别和字节码级别。如果用户使用源代码级别API，他们无需了解Java字节码的规范即可编辑类文件。
整个API仅使用Java语言的词汇表设计。您甚至可以以源代码文本的形式指定要插入的字节码；Javassist会实时编译它。另一方面，字节码级别API允许用户像其他编辑器一样直接编辑类文件。

## 读取和写入字节码
### 获取 CtClass 对象:
```java
// 从类池中获取
final ClassPool classPool = new ClassPool(true);
//通过系统classloader加载类
classPool.appendClassPath(new LoaderClassPath(ClassLoader.getSystemClassLoader()));
//通过自定义classloader加载类
classPool.appendClassPath(new LoaderClassPath(loader));
```
### 修改类定义:
```java
CtClass cc = xxx;
CtField f = new CtField(CtClass.intType, "newField", cc);
cc.addField(f);
```
### ClassPool 的层次结构:
ClassPool 可以组织成层次结构。如果子 ClassPool 在本地找不到类文件，它可以委托父 ClassPool 查找。这种层次结构对于共享类定义很有用。
例如，你可以为每个类加载器创建一个子 ClassPool，并让它们共享一个公共的父 ClassPool。这样，不同类加载器加载的类可以共享相同的 CtClass 对象。
## 类加载器
### CtClass.toClass() 方法
CtClass 的 toClass() 方法将 CtClass 对象转换为 java.lang.Class 对象。转换后的 Class 对象可以由 Java 应用程序使用。
但是，toClass() 要求调用者的类加载器必须能够加载 CtClass 对象所表示的类。如果调用者的类加载器无法加载该类，则会抛出 ClassNotFoundException。
```kotlin
val instance = ctClass.toClass().getDeclaredConstructor().newInstance();
```
### 自定义类加载器:
如果需要更复杂的类加载行为，可以定义自己的类加载器, 例如:
```java
public class MyLoader extends ClassLoader {
    private ClassPool pool;

    public MyLoader(ClassPool pool) {
        this.pool = pool;
    }

    protected Class findClass(String name) throws ClassNotFoundException {
        CtClass cc = pool.get(name);
        // 修改 cc...
        byte[] b = cc.toBytecode();
        return defineClass(name, b, 0, b.length);
    }
}
```
## 定制
### 在方法体开头/结尾插入代码:
CtMethod 和 CtConstructor 提供了 insertBefore()、insertAfter() 和 addCatch() 方法，用于在方法体中插入代码。这些方法接受一个表示 Java 代码块的字符串参数。
```java
CtMethod m = xxx;
m.insertBefore("{ System.out.println(\"start\"); }");
```
插入的代码块可以访问方法的局部变量和参数。  
### 添加新方法
CtClass 的 addMethod() 方法向类中添加一个新方法。例如：
```java
CtClass cc = xxx;
CtMethod newMethod = CtNewMethod.make(
    "public int newMethod(int x) { return x * 2; }",
    cc);
cc.addMethod(newMethod);
```
### 递归方法  
Javassist 支持递归方法调用。但是，如果递归方法调用自身，则插入的代码也会被递归调用，这可能导致无限循环。为了避免这种情况，你可以使用 `$0、$1、$2` 等来引用方法的参数，而不是使用方法名。例如:
```java
m.insertBefore("{ System.out.println($1); }");
```
`$1` 表示方法的第一个参数。
注: Javassist 可以用于在方法调用前后插入代码，这在 J2EE 中用于实现拦截器。
## 生成新类和方法
ClassPool.makeClass() 方法创建一个新的类。例如：
```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.makeClass("Apple");
```
然后你可以使用 CtClass 的方法向类中添加字段和方法:
```java
CtMethod m = CtNewMethod.make(
    "public String getColor() { return color; }",
    cc);
cc.addMethod(m);
```
## 调试 Javassist
如果插入的代码无法编译，Javassist 会抛出 CannotCompileException。你可以通过调用 CannotCompileException.getReason() 来获取编译错误的原因。
此外，可以通过调用 CtMethod 的 instrument() 方法来检查插入的代码的字节码。

## Reference:
[https://www.javassist.org/](https://www.javassist.org/)
