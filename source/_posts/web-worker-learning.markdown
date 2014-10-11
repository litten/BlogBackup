---
layout: post
title: "web worker简易入门"
date: 2013-09-25 10:55
comments: true
tags: 
	- web 
	- html5
---       
js是单线程的语言，由于此特性，我们在处理并发时需要用到一些技巧，如setTimeout()，setInterval()，调用XMLHttpRequest等。
但这里的并发只是非阻塞（参照John Resig的文章[How JavaScript Timers Work](http://ejohn.org/blog/how-javascript-timers-work/)），真正的多线程编程则需要HTML5的web worker。
<!-- more -->
###**【worker的使用】**
web worker的使用非常简单，线程之间通讯的api与html5 postmessage或node.js里面的socket.io方法类似。

通讯：      

1. 发送方：postMessage(data)      
2. 接收方：onmessage(event)

终止web worker:        

1. 子线程: self.close()
2. 父线程: worker.terminate()

按照目前w3c规范，web worker分为两种：专用worker(Dedicated Worker)和共享worker(Shared Worker)。
<!--more-->
###**【专用worker】**
实例化一个web worker对象，异步加载子线程文件worker.js，其中的代码将执行。

    var worker = new Worker("worker.js");

给worker增加侦听

    worker.onmessage = function (event) {
        alert(event.data);
    };

在worker.js里，发送消息给父线程     

	postMessage('hello，imweb');
    
在父线程页面就能看到发送过来的信息了。

同时，在web worker标准中，是支持对象参数的，也就是说我们能够传递json数据。再看一个稍微复杂点的例子，父线程：

	var worker = new Worker("worker.js");
	worker.onmessage = function (event) {
		document.getElementById("result").innerHTML=event.data;
	};

	function start(){
		worker.postMessage({'cmd': 'start', 'msg': 'start'});
	}

	function pause(){
		worker.postMessage({'cmd': 'pause', 'msg': 'pause'});
	}

	function stop(){
		worker.postMessage({'cmd': 'stop', 'msg': 'stop'});
	}

	function msg(){
		worker.postMessage({'msg': 'hello imweb'});
	}

worker.js：

	self.onmessage = function (e) {
		var data = e.data;
	  	switch (data.cmd) {
	    case 'start':
	    	taskStart(); //大量数据处理
	      	postMessage('WORKER DO: ' + data.msg);
	      	break;
	    case 'pause':
	    	taskPause();
	      	postMessage('WORKER DO: ' + data.msg);
	      	break;
	    case 'stop':
	      	postMessage('WORKER DO: ' + data.msg);
	      	self.close(); //终止web worker
	      	break;
	    default:
	      	postMessage('MESSAGE: ' + data.msg);
	  	};
	};

从上面的例子可以看到，一是利用对象参数，进程之间能够较灵活的实现控制；二是当woker执行taskStart()处理大量数据时，只在子进程处理，不会给主页面带来阻塞，通常，处理大量数据会消极影响程序的响应能力，而web worker通过这样的方式，能提供一个更流畅更实时的UI。

###**【共享worker】**
共享worker允许线程在同源中的多个页面间进行共享，例如：同源中所有页面或脚本可以与同一个共享线程通信。它的实例化与事件侦听的写法与专用worker略有不同,主页面：

	var worker = new SharedWorker('shared-worker.js');
	worker.port.onmessage = function(e) {
	    msg = 'Someone just said "' + e.data.message + '". That is message number ' + e.data.counter;
	    console.log(msg);
	};
	worker.port.postMessage('hello shared worker!');

shared-worker.js:        

	var counter = 0;
	var connections = [];
	onconnect = function(eConn) {
   		var port = eConn.ports[0]; // 此连接的特有port

   	//当有消息的时候通知所有的连接
   	port.onmessage = function(eMsg) { 
       	counter++;
       	for (var i=0; i < connections.length; i++) {
           	connections[i].postMessage({
               	message: eMsg.data,
               	counter: counter
           	});
       	}
   	}
   	port.start();
   	connections.push(port);

用两个窗口打开这个页面，第一个显示：**Someone just said "Hello shared worker!" This is message number 1**，第二个也收到一样的信息，
但是后面是**message number 2**。

###**【安全性和错误检查】**
出于安全性的考虑，web worker必须遵守同源策略。同时，它的全局对象是worker对象本身，this和self引用的都是worker对象。   
只能访问：

1. navigator 对象（仅限appName, appVersion, platform, userAgent）
2. location 对象（只读）
3. XMLHttpRequest
4. setTimeout(), setInterval(), clearTimeout()和clearInterval()方法

不能访问：

1. DOM(不是线程安全的)
2. window 对象
3. document 对象
4. parent 对象

worker内部出现错误时，可以用worker.onerror侦听到，error的事件有三个属性：      

1. filename: 发生错误的文件名
2. lineno: 代码行号
3. message: 完整的错误信息

如：

	worker.onerror = function(e) {
		console.log(e.filename+"ERROR on line"+e.lineno+",msg:"+e.message);
	}

###**【web worker的其他尝试】**
对于比较消耗时间的操作，我们可看到web worker能够发挥它的作用。比如：大量数据排序，精确到像素的canvas计算等。而我们又知道，jsonp加载数据时，动态创建script标签，加载和执行这些过程都是阻塞式的，而web worker正好可以异步加载，这会是更快的方式吗？带着这个疑问我做了下面的试验，分别用jsonp和worker的方式去加载文件，计算数据返回时延：

	function tryJsonp(){
		var d = (new Date()).valueOf();
		var jsonp=document.createElement("script");  
	    jsonp.type="text/javascript";  
	    jsonp.src="worker.js?_="+d;  
	    document.getElementsByTagName("head")[0].appendChild(jsonp);
	    jsonp.onload = jsonp.onreadystatechange = function(){  
		   	if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){  
		   		console.log('jsonp: '+ ((new Date()).valueOf() - d));
			}  
		}
	}
	function tryWorker(){
		var d = (new Date()).valueOf();
		var worker = new Worker("worker.js");
		worker.postMessage({'cmd': 'start', 'msg': 'start'});
		worker.onmessage = function (event) {
			console.log('web worker: '+ ((new Date()).valueOf() - d));
		};
	}

第一次加载是一份1k大小的文件，每个方法重复5次，返回结果为:         
![1k文件重复5次](/assets/blogImg/web_worker1.png)  
第二次加载1800k大小的文件，返回结果为：             
![1800k文件重复5次](/assets/blogImg/web_worker2.png)  
可以看到对于较小的数据，jsonp还是比web worker要快，这可能是实例化worker对象时带来的影响；而数据偏大时，web worker的加载将会更优，而且它可以异步加载。

THE END.