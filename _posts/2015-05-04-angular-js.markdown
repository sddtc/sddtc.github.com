---
layout: post
title: "angularJs"
date: "2015-05-04"
categories: sddtc tech
---

* post请求，需要transFn方法
``` 
transFn = function(data) {
	    return $.param(data);
};
postCfg = {
	    headers : {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'},
				  	transformRequest: transFn
};
``` 
* 返回值http-status，success回调函数将status参数添加上即可
``` 
$http.post(url, param, postCfg).success(function(response, status){
	    $scope.result = response;
		})；
```
* error处理，链式回调函数处理
```
.error(function(){
	    ...
		});
```
