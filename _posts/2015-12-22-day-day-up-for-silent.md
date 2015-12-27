---
layout: post
title: "学而不思则罔，思而不学则殆:)"
date: "2015-12-22"
categories: sddtc tech
tags: [java]
---

沉迷于jdk1.8甚至1.9带给我的快感，却把jdk1.5的新特性全部抛弃了，活该  

#### java泛型的优势  
说来惭愧，虽然享受着泛型带来的便利，却不知泛型的优点是什么  

泛型的好处是在编译的时候检查类型安全，确保你只能把正确类型的对象放入集合中，避免了在运行时出现ClassCastException。  

泛型是通过类型擦除来实现的，编译器在编译时擦除了所有类型相关的信息，所以在运行时不存在任何类型相关的信息。例如List<String>在运行时仅用一个List来表示。这样做的目的，是确保能和Java 5之前的版本开发二进制类库进行兼容。你无法在运行时访问到类型参数，因为编译器已经把泛型类型转换成了原始类型。  

限定通配符对类型进行了限制。有两种限定通配符，一种是<? extends T>它通过确保类型必须是T的子类来设定类型的上界，另一种是<? super T>它通过确保类型必须是T的父类来设定类型的下界。泛型类型必须用限定内的类型来进行初始化，否则会导致编译错误。另一方面<?>表示了非限定通配符，因为<?>可以用任意类型来替代。  

你可以把List<String>传递给一个接受List<Object>参数的方法吗？  
乍看起来String是一种Object，所以List<String>应当可以用在需要List<Object>的地方，但是事实并非如此。真这样做的话会导致编译错误。如果你再深一步考虑，你会发现Java这样做是有意义的，因为List<Object>可以存储任何类型的对象包括String, Integer等等，而List<String>却只能用来存储Strings。


```java

List<Object> objectList;
List<String> stringList;     
objectList = stringList;  //compilation error incompatible types

```

Java中List<Object>和原始类型List之间的区别?  
原始类型和带参数类型<Object>之间的主要区别是，在编译时编译器不会对原始类型进行类型安全检查，却会对带参数的类型进行检查，通过使用Object作为类型，可以告知编译器该方法可以接受任何类型的对象，比如String或Integer。  它们之间的第二点区别是，你可以把任何带参数的类型传递给原始类型List，但却不能把List<String>传递给接受List<Object>的方法，因为会产生变异错误。  


####SpringAOP




  


