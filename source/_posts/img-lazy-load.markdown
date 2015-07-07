---
layout: post
title: "说到加载图片，我们可以谈些什么"
date: 2015-04-28 23:54
comments: true
tags: 
	- js
---

![原图 by Denis Perepelenko](/assets/blogImg/lazyload.jpg)    

其实，一开始让我在网页中加载一张图片，我是，是拒绝的…因为实在太简单了。

``<img src="xx.jpg" />``是每个前端开发都会的技能。然而，如果你想做到极致，事情还没有这么简单。

最近实现了个图片加载器，用于大型web前端项目中，关于加载图片这一话题，仔细想来可以加许多的特技。

<!-- more -->

###第一步：滚屏加载

这是最容易想到的点，也是一开始就准备做的。

随web体验的进步，滚屏加载代替分页加载的情形越来越多。也就是先预留图片位置，而不去加载图片，直到这个预留区域滚动到屏幕中，用户能看见了，才去加载图片。如此一来，有“按需加载”的意味，由于图片加载延后，不抢占带宽，在打开页面的首屏会快很多。我们称之为“懒加载(lazyload)”。

其实现也很简单，在html里面写``<img lazy-src="xx.jpg" />``，然后用js去判断这个节点是否出现在屏幕中，如果是，则取出``lazy-src``属性，赋值成``<img lazy-src="xx.jpg" src="xx.jpg"/>``，触发此节点onload，这就实现最简单的滚屏加载了。

###第二步：特殊状态处理

特殊状态有两种：加载中与加载失败。这两种情况的处理逻辑相类似，拿加载中的逻辑做例子。

图片触发加载，到图片加载完成（或失败）之间，肯定会有一段时间。不做处理的话，用户在等待的过程中，就只能看到空白的区域，非常的奇怪。在低网速，以及用户非常快的拉滚动条的情形下，这种现象将更加明显。

那么在触发onload之前，就需要补一些逻辑，展示对应的loading图。
将需要处理的img节点作为参数，调用tempImg函数，克隆一个节点强行插在img之前，用于loading中的展示。

```
	var tempImg = function(target){
	    var w = target.width();
	    var h = target.height();
	    var tempDom = target.clone().addClass("lazy-loding").insertBefore(target);

	    if(w/h == 1){
	        tempDom[0].src = "http://9.url.cn/edu/img/img-loading.png";
	    }else{
	        tempDom[0].src = "http://9.url.cn/edu/img/img-loading2.png";
	    }
	    target.hide();
	}
```

###第三步：上报监控

这一步在大型前端项目中非常重要，也是经常被忽略的地方。尽管需要简易的后台配合，但不算麻烦的上报监控，能让产品更加稳定和健壮。

我在两个地方用到了上报。其一是图片加载失败，触发``onerror``时，这样一来我们能知道每天图片拉取失败的量；其二是图片加载的时间，能够帮助我们分析cdn服务是否异常，分析全国慢速用户比例等等。

而所谓的上报其实就是一个http请求，我会大概把这些信息带上

```
    log({
		'type': 'error',
		'msg': 'lazyload拉取图片失败上报 ',
		'url': window.location.href,
		'pid': 414342  //产品对应的id
	});
```

###第四步：居中截取

这是前端无可避免的一个问题，先来说下此问题的背景。

由于我们是先用一个空白的img标签占位，再去加载图片，如果图片的高度特别长（比如新浪长微博），加载完成时就会撑开节点，引起滚动条的跳动。由于移动端屏幕较PC窄，一个跳动就可能让你找不到前一秒正在浏览的内容，这种体验尤其严重。在移动端的web设计中，可以看到许多知名互联网公司的产品，也经常忽略这一点。

因此我们可以限定占位区域的size，以此区域来做居中截取。当占位区域与图片最终展示同宽同高时，就不会引起跳动，而且也保持了视觉的一致性。

其原理如下，先判断是竖向长型图，还是横向长型图，根据不同的情况，优先让宽或高填充满占位区域，然后通过不同的负margin去实现居中。

```
	var calSize = function($img) {
	    var w = $img.width(), h = $img.height(), width = size[0], height = size[1];
	    if(w+h == 0) return;

	    //如果是长型图，优先适配宽度，高度居中截取
	    if(w/h > width/height){
	        var newWidth = height * w / h;
	        var margin = (width - newWidth)/2;
	        $img.height(height).css({"margin-left": margin});
	    }else{
	        var newHeight = width * h / w;
	        var margin = (height - newHeight)/2;
	        $img.width(width).css({"margin-top": margin});
	    }
	}
```

###第五步：支持webp

webp格式图片是google开发的一种旨在加快图片加载速度的图片格式，压缩提交大概只有jpg的2/3。随chrome的比例越来越多，其实让更多用户体验到webp也是一件好事。

那么问题来了，怎么去判断用户的浏览器是否支持webp呢？
根据ua去判断是个好方法，但不太靠谱，因为chrome中其实也有设置，让它不能去支持webp，而且webkit本身就开源，会衍生出很多你不知道名字的浏览器。

最终我使用的是特性检测：

```
	if(!supportedWebPIsLoading) {
	    supportedWebPIsLoading = true;
	    var images = {
	        basic: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA=="
	    }, $img = new Image();
	    $img.onload = function () {
	        supportedWebPIsLoading = false;
	        $.cookie.set("iswebp" , +supportedWebP);
	    };
	    $img.onerror = function () {
	        supportedWebP = false;
	        supportedWebPIsLoading = false;
	        $.cookie.set("iswebp" , +supportedWebP);
	    };
	    $img.src = images.basic;
	}
```

我们会让浏览器试着加载一张非常小的base64格式的webp图片，如果能够正常加载，说明是支持webp的。

并且，会把测试记录在cookie里，所以第二次直接从cookie里读结果，基本不会影响性能。完成了最重要的检查，我们就可以放心让服务器返回不同格式的图片了。


End.