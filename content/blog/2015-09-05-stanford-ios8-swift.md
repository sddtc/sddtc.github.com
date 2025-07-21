---
title: 斯坦福大学冬季课程 iOS8 Swift 学习笔记
date: 2015-08-27
tags: mobile
---

昨天偶然看到了一个斯坦福大学的公开课，具体是怎么个偶然法，我已经忘记了...但是iOS是一个很酷的东西,还是很值得学习的. 作为一个工程师，涉猎和理解，是相互的
第1课-第4课：

1. MVC: iOS的设计模式也同样遵循MVC，并且是不提倡M和V通信
2. 方法里面可以嵌套方法，前提是方法是私有的

```swift
init() {
    func learnOp(op :Op) {
        knownOps[op.description] = op
    }

    learnOp(Op.BinaryOperation("×", *))
    knownOps["÷"] = Op.BinaryOperation("÷") {$1 / $0}
    knownOps["+"] = Op.BinaryOperation("+", +)
    knownOps["−"] = Op.BinaryOperation("−") {$1 - $0}
    knownOps["√"] = Op.UnaryOperation("√", sqrt)
}
```

3. 协议（Printable）

```swift
private enum Op: Printable {
    case Operand(Double)
    case UnaryOperation(String, Double -> Double)
    case BinaryOperation(String, (Double, Double) -> Double)

    var description: String {
        get {
            switch self {
            case .Operand(let operand) :
                return "\(operand)"
            case .UnaryOperation(let symbol, _):
                return symbol
            case .BinaryOperation(let symbol, _):
                return symbol
            }
        }
    }
}
```

4. 字典和数组

```swift
private var opStack = [Op]() //栈
private var knownOps = [String:Op]() //字典
```

5. optional
有一种类型叫做optional,应该是在没有强制转化之前，任何一个类型都是optional的. 这一点，在需要强类型的时候转化

6. auto-layout
一个长远的课题，布局总在最后整体使用，auto-layout应该是xcode4之后的新特性. 主要是相对位置的约束: 规定了至少应该有2个约束来固定一个位置

7. 继承和重载
swift是支持重载的，并且是单继承，但是Objective-C不支持，因此当类继承UIViewController（NSObject），swift就不能很好地拥有重载的特性，公开课使用的xcode版本和我本机不一致，因此我暂时写了2个方法，还蛮多人遇到该问题

第8课：
1.多MVC的一个思想，是用了栈
即多个层是放在栈中，例如点击入栈，返回出栈
2.初始化之前就需要使用的实例，需要判nil情况，实例后面添加问号

[斯坦福大学公开课-iOS8](http://www.swiftv.cn/course/i7ahl5gn)
