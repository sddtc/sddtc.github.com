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

* error,finally 处理，链式回调函数处理    

```javascript
.error(function(){
})
.finally(function(){
};
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

* foreach相关  

```javascript
angular.forEach(objToIterator, function(value, key){});
```

* 操作dom的div,添加div的id  

```javascript
var divId = obj.widgetRender.substr(1, obj.widgetRender.length);
$scope.div = obj.divContent;
$scope.div = angular.element($scope.div).attr('id', divId);
angular.element(document.getElementById('dashboardDiv')).append($scope.div);
```
