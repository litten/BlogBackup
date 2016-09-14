---
layout: post
title: "统一处理异步的js回调"
date: 2013-10-06 10:55
comments: true
tags: 
	- web 
	- js
---

js编程时经常会用到异步处理，而异步会带了所谓的并发问题。比如，你需要向服务器发出多个ajax请求，然后在返回所有结果后做进一步处理，同时要显示动画。因此我们需要用到以下的方案。
<!-- more -->
###**【定义函数】**
定义Batch函数。参数为函数组成的数组functions，这里面的函数将稍后执行，以及这些函数完成后的回调completionHandler。          
```js
	function Batch(functions, completionHandler) {
		this._functions = functions;
		this._completionHandler = completionHandler;
	}
```
###**【启动请求】**
用this._remaining来记录未执行的函数量，然后执行各个函数。    
```js  
	Batch.prototype.execute = function execute() {
		var i;
	  	var functions = this._functions;
	  	var length = this._remaining = functions.length;
	  	this._results = [];
	  	for (i = 0; i < length; i += 1) {
	      	functions[i](this);
	  	}
	};
```
###**【让Batch知道函数完成】**
用this._results来记录执行结果，当this._remaining为0时，表示所有函数已执行完毕。
```js            
	Batch.prototype.done = function done(result) {
		this._remaining -= 1;
		if (typeof(result) !== 'undefined') {
	    	this._results.push(result);
	  	}
	  	if (this._remaining === 0) {
	      	this._completionHandler(this._results);
	  	}
	};
```
到这里，就完成了Batch这个函数的简单功能了。

###**【使用】**
将Batch应用到实际上。      
```js
	var urls = [
	  	'/api/gists/1000',
	  	'/api/gists/1001',
	  	'/api/gists/1002',
	  	'/api/gists/1003',
	  	'/api/gists/1004',
	  	// ...
	  	'/api/gists/1337',
	  	// etc...
	];

	var i;
	var length = urls.length;
	var batchFunctions = [];

	// 创建需要被batch执行的函数数组
	for (i = 0; i < length; i += 1) {
	  	batchFunctions.push(function (batch) {
	      	$.ajax.get(urls[i], function (response) {
	          	batch.done(response);
	      	});
	  });
	}

	var myBatch = new Batch(batchFunctions, function (results) {
		//返回各个函数的结果数组
	});

	myBatch.execute(); // 开始执行
```
这样的方案其实是参考了“观察者”模式。相关源码推荐nodeJs的Async.js库。

THE END.