---
layout: post
title: "爱上一匹二维马可我家里没有草原…"
date: 2014-08-01 23:52
comments: true
tags: 
	- html5 
	- 前端 
	- js 
	- github
---       

#Kael-Qrcode 

> 基于html5 canvas，灵活轻巧，美观多变的二维码生成库                   

一直觉得二维码长得太单一，抽空做了一个生成库：[github here](https://github.com/litten/Kael-Qrcode)。              
取名卡尔，缘由dota英雄Kael；一生二，二生三，三生万物 ，简单地配置Kael-Qrcode，帮助你变换出无穷样式的二维码。        

二维码不应只是那只黑白的斑马，它还可以是骏马野马海马河马草泥马…   
<!-- more -->
### 使用 Usage:

**1、入手**

**Demo Base - 基本**

```js
	var kaelBase = new KaelQrcode();
	kaelBase.init(document.getElementById("qr-base"), "hello KaelQrcode");
```

**2、进阶**

随手可配，变化无穷！           

**Demo Pic - “有图有真相”**

关键词：附图，图片边框，尺寸            

![demo](http://littendomo.sinaapp.com/kaer-qrcode/qrcode-pic.jpg)
```js
	var kaelPic = new KaelQrcode();
	kaelBase.init(document.getElementById("qr-pic"), {
		text : "hello KaelQrcode",
		size: 300,
		img: {
			src : "kael-ico.jpg",
			border: "#fff"
		}
	});
```
**Demo Sae - “如果大海能够带走我的哀愁”**        

关键词：圆角，前景色，背景色，渐变           

![demo](http://littendomo.sinaapp.com/kaer-qrcode/qrcode-sea.jpg)
```js
	var kaelSea = new KaelQrcode();
	kaelSea.init(document.getElementById("qr-sea"), {
		text : "hello KaelQrcode",
		size: 300,
		color: {
			'0': 'rgb(1, 158, 213)',
			'0.2': 'rgb(30, 169, 224)',
			'0.6': 'rgb(0, 120, 191)',
			'1': 'rgb(1, 119, 255)'
		},
		background: "#d3e3f0",
		type: "round"
	});
```

**Demo Iron - “钢铁是怎样炼成的”**     

关键词：阴影            

![demo](http://littendomo.sinaapp.com/kaer-qrcode/qrcode-iron.jpg)
```js
	var kaelIron = new KaelQrcode();
	kaelIron.init(document.getElementById("qr-iron"), {
		text : "hello KaelQrcode",
		size: 300,
		color: {
			'0': 'rgb(30, 30, 30)',
			'0.2': 'rgb(100, 100, 100)',
			'1': 'rgb(40, 40, 40)'
		},
		background: {
			'0': 'rgb(233, 233, 233)',
			'0.2': 'rgb(246, 246, 246)',
			'1': 'rgb(212, 212, 212)'
		},
		shadow: true
	});
```
**Demo Iron - “万紫千红总是春”**      

关键词：单点        

![demo](http://littendomo.sinaapp.com/kaer-qrcode/qrcode-point.jpg)
```js
	var kaelPoint = new KaelQrcode();
	kaelPoint.init(document.getElementById("qr-point"), {
		text : "hello KaelQrcode",
		size: 300,
		color: "#50528f",
		background: "e7e0cf",
		pointColor: "#ee256c",
		type: "round"
	});
```

### 正在做 Todo：

1. 阴影效果优化
2. 高光
3. 正方形识别
4. 动画