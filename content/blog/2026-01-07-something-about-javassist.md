---
title: Something About Javassist
date: 2026-01-07
tags: [java]
---

## 什么是 Javassist？

Javassist（Java 编程助手）是一个用于编辑 Java 字节码的类库。它允许 Java 程序在运行时定义新类，并在 JVM 加载类文件时对其进行修改。

### 两种 API 级别

Javassist 提供两种 API 级别：

- **源代码级别 API**：使用 Java 语言词汇表，无需了解字节码规范即可编辑类文件。可以以源代码文本形式指定要插入的字节码，Javassist 会实时编译。
- **字节码级别 API**：直接编辑类文件，与其他字节码编辑器类似。

## 读取和写入字节码

### 获取 CtClass 对象

使用 `ClassPool` 获取 `CtClass` 对象：

```java
// 创建类池
final ClassPool classPool = new ClassPool(true);
// 通过系统类加载器加载类
classPool.appendClassPath(new LoaderClassPath(ClassLoader.getSystemClassLoader()));
// 通过自定义类加载器加载类
classPool.appendClassPath(new LoaderClassPath(loader));
```

### 修改类定义

向类中添加新字段：

```java
CtClass cc = xxx;
CtField f = new CtField(CtClass.intType, "newField", cc);
cc.addField(f);
```

### ClassPool 的层次结构

`ClassPool` 支持层次结构。如果子 `ClassPool` 在本地找不到类文件，它会委托父 `ClassPool` 查找。

**使用场景**：为每个类加载器创建一个子 `ClassPool`，并让它们共享一个公共的父 `ClassPool`。这样，不同类加载器加载的类可以共享相同的 `CtClass` 对象。

## 类加载器

### 使用 toClass() 方法

`CtClass.toClass()` 方法将 `CtClass` 对象转换为 `java.lang.Class` 对象，供 Java 应用程序使用。

**注意**：调用者的类加载器必须能够加载 `CtClass` 对象所表示的类，否则会抛出 `ClassNotFoundException`。

```kotlin
val instance = ctClass.toClass().getDeclaredConstructor().newInstance();
```

### 自定义类加载器

如果需要更复杂的类加载行为，可以定义自己的类加载器：

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

## 修改现有类

### 在方法体中插入代码

`CtMethod` 和 `CtConstructor` 提供以下方法用于在方法体中插入代码：

- `insertBefore()`：在方法体开头插入代码
- `insertAfter()`：在方法体结尾插入代码
- `addCatch()`：添加异常处理代码

这些方法接受一个表示 Java 代码块的字符串参数：

```java
CtMethod m = xxx;
m.insertBefore("{ System.out.println(\"start\"); }");
```

**重要**：插入的代码块可以访问方法的局部变量和参数。

### 添加新方法

使用 `addMethod()` 方法向类中添加新方法：

```java
CtClass cc = xxx;
CtMethod newMethod = CtNewMethod.make(
    "public int newMethod(int x) { return x * 2; }",
    cc);
cc.addMethod(newMethod);
```

### 引用方法参数

在插入的代码中，使用以下符号引用方法参数：

- `$0`：`this` 对象（实例方法）或 `null`（静态方法）
- `$1`：第一个参数
- `$2`：第二个参数
- 以此类推

示例：

```java
m.insertBefore("{ System.out.println($1); }");
```

**注意**：对于递归方法，使用参数引用（如 `$1`）而不是方法名，可以避免插入的代码被递归调用导致无限循环。

**应用场景**：Javassist 可用于在方法调用前后插入代码，在 J2EE 中用于实现拦截器。

## 生成新类和方法

### 创建新类

使用 `ClassPool.makeClass()` 方法创建新类：

```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.makeClass("Apple");
```

### 添加字段和方法

创建类后，使用 `CtClass` 的方法添加字段和方法：

```java
CtMethod m = CtNewMethod.make(
    "public String getColor() { return color; }",
    cc);
cc.addMethod(m);
```

## 调试

### 处理编译错误

如果插入的代码无法编译，Javassist 会抛出 `CannotCompileException`。调用 `CannotCompileException.getReason()` 获取编译错误的原因。

### 检查字节码

调用 `CtMethod` 的 `instrument()` 方法检查插入代码的字节码。

## 参考资源

- [Javassist 官方网站](https://www.javassist.org/)
