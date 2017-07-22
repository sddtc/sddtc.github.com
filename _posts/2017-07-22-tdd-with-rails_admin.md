---
title: "[TDD]用TDD进行rails_admin开发"
layout: post
date: "2017-07-22"
categories: sddtc tech
guid: urn:uuid:7f274e1d-2d32-4eba-835b-b75e2005fbb8
tags:
  - rails
---

### 背景

最近在做一个小而有趣的项目, 用到了rails去搭建后台.  
在RailsAdmin和ActiveAdmin中选择了前者, 理由除了RA的全自动化之外, 还有它本身作为管理后台的核心思想: 既是提供一套UI, 并使所有模块可直接使用. 在我看来, ActiveAdmin需要二次开发的灵活性更大所以开发工作更多.  

那么这次就用TDD的思想来做一次完整的功能开发ヾ(=･ω･=)o

### 说明

首先, 我们创建两个model: brand&product  
其次, 引用了mocha这个测试框架:  
```
require 'mocha/test_unit'
```


### Model Test

```
test 'should return nil when brand not exist' do
  Brand.expects(:find_by).with(1).returns(nil)
  assert_nil  Brand.find_by(1)
end
  
test 'should return brand object when brand exist' do
  brand = Brand.new 
  Brand.expects(:find_by).with(2).returns(brand)
  assert_equal(brand, Brand.find_by(2))
end
  
test 'should not save brand without english_name' do
	brand = Brand.new :headline=>'example', :description=>'example', :logo_img=>'log.jpg', :background_img=>'back.jpg'
	assert_not brand.save
end
```

这里涉及到对Brand的方法测试, 涉及到对Brand必填项的测试

### Service Test

```
test 'should return nil when brand not exist' do
  BrandsService.expects(:find_by_id).with(1).returns(nil)
  assert_nil BrandsService.find_by_id(1)
end
```


service部分的测试我没有写很多, 这里只会举一个这样简单的🌰, 关于场景的期望后面会补充些更完整的测试用例. 大部分人包括我, 习惯于功能的实现先于测试的实现, 然而我之所以努力朝着先测试后实现的方向走, 确实是因为可以提前暴露有关于需求的问题. 就好比好的设计总是会优先于好的实现.

### Migration
关于rails的migration数据库集成这部分确实很强大, 集成的非常完美. 我遇到了一个小问题: 在对某个model做修改的时候, 因为方便我会使用redo操作, 而这样很容易让测试环境和他人的开发环境不能通过一条```rake db:migrate```就完成各种修改.  

我的初衷是为了方便和减少脚本的创建, 然而沟通的代价较大. 所以, 在
```rake db:migrate:redo```和```rake db:migrate```中还是要选择后者, 不需要在意脚本的多少. 一切改动有历史轨迹也是一种王道.  

### belongs_to & has_many

RailsAdmin的多对一配置:  

```
class Product < ApplicationRecord
  belongs_to :brand
end

class Brand < ApplicationRecord
  has_many :products
end

```

这样在后台会直接在创建表单的时候, 出现下拉框选择, 美中不足的是下拉框的value是'Brand #id'这种以主键为展示方式的选项, 这时候如果你想展示名称, 只需要在rails_admin.rb文件里做一下修改: 
 

```
config.model Brand do
  object_label_method do
    :custom_label_method
  end
end

Brand.class_eval do
  def custom_label_method
    "#{self.english_name}"
  end
end

```

真是完美的解决了问题.

### 其它

最近西安很热, 希望父上下下周能平安出院.  


以上.