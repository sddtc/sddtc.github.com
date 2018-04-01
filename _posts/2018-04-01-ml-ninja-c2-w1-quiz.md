---
title: "[ML Ninja]Coursera第二阶段第一课Quiz"
layout: post
categories: sddtc tech
guid: urn:uuid:b3ef70bd-be67-4b87-88da-a0ed6739f361
tags:
  - ML Ninja
---

<br>
### 1.If you have 10,000,000 examples, how would you split the train/dev/test set?  
<br>
&emsp;&emsp;- **98% train . 1% dev . 1% test**    
<br>
### 2.The dev and test set should:  
<br>
&emsp;&emsp;- **Come from the same distribution**  
<br>
### 3.If your Neural Network model seems to have high variance, what of the following would be promising things to try?
<br>
&emsp;&emsp;- Get more training data  
&emsp;&emsp;- Add regularization  
&emsp;&emsp;~~Increase the number of units in each hidden layer~~  
&emsp;&emsp;~~Make the Neural Network deeper~~  
&emsp;&emsp;~~Get more test data~~  
<br>
### 4.You are working on an automated check-out kiosk for a supermarket, and are building a classifier for apples, bananas and oranges. Suppose your classifier obtains a training set error of 0.5%, and a dev set error of 7%. Which of the following are promising things to try to improve your classifier? (Check all that apply.)  
<br>
&emsp;&emsp;- Increase the regularization parameter lambda  
&emsp;&emsp;- Get more training data  
&emsp;&emsp;~~Decrease the regularization parameter lambda~~  
&emsp;&emsp;~~Use a bigger neural network~~  
<br>
### 5.What is weight decay?  
<br>
&emsp;&emsp;- **A regularization technique (such as L2 regularization) that results in gradient descent shrinking the weights on every iteration.**
<br>
### 6.What happens when you increase the regularization hyperparameter lambda?
<br>
&emsp;&emsp;- **Weights are pushed toward becoming smaller (closer to 0)**
<br>
### 7.With the inverted dropout technique, at test time:
<br>
TBD  
<br>
### 8.Increasing the parameter keep_prob from (say) 0.5 to 0.6 will likely cause the following: (Check the two that apply)
<br>
&emsp;&emsp;- Causing the neural network to end up with a lower training set error  
&emsp;&emsp;- Reducing the regularization effect  
&emsp;&emsp;~~Causing the neural network to end up with a higher training set error~~  
&emsp;&emsp;~~Increasing the regularization effect~~  
<br>
### 9.Which of these techniques are useful for reducing variance (reducing overfitting)? (Check all that apply.)  
<br>
&emsp;&emsp;Dropout  
&emsp;&emsp;L2 regularization  
&emsp;&emsp;Data augmentation  
&emsp;&emsp;~~Xavier initialization~~  
&emsp;&emsp;~~Vanishing gradient~~  
&emsp;&emsp;~~Gradient Checking~~    
&emsp;&emsp;~~Exploding gradient~~  
<br>
### 10.Why do we normalize the inputs x?  
<br>
&emsp;&emsp;**It makes the cost function faster to optimize**