---
layout: post
title: "angularJs"
date: "2015-05-04"
categories: sddtc tech
---

* post请求，需要transFn方法   

```javascript    
transFn = function(data) {  
    return $.param(data);  
};  

postCfg = {  
    headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},  
  	transformRequest: transFn  
};  

```    
* 返回值http-status，success回调函数将status参数添加上即可   

```javascript
$http.post(url, param, postCfg).success(function(response, status){  
    $scope.result = response;  
});  

```    

* error处理，链式回调函数处理    

```javascript
.error(function(){
    ...
});
```

* Angular 实现tableA删除行，行消失，tableB添加行，行出现  
删除,splice方法  

```javascript
    var index = $scope.myConfigList.indexOf(mine);
	    if (index !== -1) {
		    $scope.myConfigList.splice(index, 1);
		}
```

添加,push方法即可  

```javascript
$scope.systemConfigList.push(mine);
```

* foreach  
---javascript
angular.forEach(objToIterator, function(value, key){

});
```
