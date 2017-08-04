---
title: "[RailsAdmin]关于RA的一些必须掌握的tips"
layout: post
date: "2017-08-01"
categories: sddtc tech
guid: urn:uuid:035dab89-3c15-48c3-be1e-43961682d17f
tags:
  - rails
---

### 开启白名单

只显示需要的model列表  

```
config.included_models = [Brand, Product, Admin, Store]
```

---

### 修改model的显示title

修改model的title, 修改model下拉框的默认'model #id'名称展示

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

---

### 不显示model的个别action

有些model不需要默认的编辑、删除等action,利用except关键字  

```
  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new do
      except [Brand]
    end
    export do
      except [Brand]
    end
    bulk_delete
    show
    edit do
      except [Brand]
    end
    delete do
      except [Brand]
    end
  end

```

---

### 自定义引入javascript脚本

若需要动态引入js脚本  

1.在项目路径app/assets/javascripts目录下,新建rails_admin/custom目录，即
`app/assets/javascripts/rails_admin/custom`  

2.在1路径里面新建ui.js文件  

ui.js内容:  

```
//=require_tree .
```

3.可新建业务js文件,例如brand.js,和ui.js同级,内容示例:  

```
$(document).on('keyup', '#bundle_set_sale_price', function () {
    var sale_price = numberInputCheck($("#bundle_set_sale_price").val());
    $("#bundle_set_sale_price").val(sale_price);

    var count = $( "#bundle_set_count option:selected" ).text();
    var sale_total_price = (sale_price * count).toFixed(2);
    $("#bundle_set_sale_total_price").val(sale_total_price);
});

```

---

### show页面显示img图片内容  

在model详情页面显示图片  

```
show do
  field :background_img do
    formatted_value do
      bindings[:view].tag(:img, {:src => bindings[:object].background_img, :style => "width:400px;height:300px"})
    end
  end
end
```

---

### show页面field字段的值自定义

在model详情页面,让某个字段展示其它内容,例如从数据库读取  

```
show do
  field :id
  field :store_id do
    formatted_value do
      @store = StoresService.find_by_id(self.value)
      @store.chinese_name + ' ' + @store.name
    end
  end
end
```

---

### model设置枚举  

model的count属性希望展示下拉列表,采用枚举  

```
def count_enum
  [5, 10, 15]
end
```

---

### model编辑时提示信息自定义

默认是Required, 希望多加一些信息  

```
edit do
  include_all_fields
  fields :images do
    help "Required - Please use 'Enter' for split multiple images"
  end
end
```

---

### 建立联合索引, 提交表单时提示失败

bundle_offer_id和count建立唯一联合索引,保证数据库数据不重复


```
validates_uniqueness_of :bundle_offer_id, scope:[:bundle_offer_id, :count]
```

相关参考:  

[Ruby&Rails 风格指导](http://guides.ruby.tw/ruby-rails-style-guides/zhCN/#intro)  
[Rails 程序测试指南](https://doc.bccnsoft.com/docs/rails-guides-4.1-cn/testing.html)