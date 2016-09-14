---
layout: post
title: "网易“聚合阅读”布局的实现"
date: 2013-05-03 10:55
comments: true
tags: 
	- js
---

![聚合阅读](/assets/blogImg/myReader0.jpg)   

网易[聚合阅读](http://news.tag.163.com/)的出现的确让人惊艳了一下。流畅的交互,使碎片化的新闻资讯像报纸一样摊在眼前,这是信息大爆炸的时代产物。不管你能不能接受这种新阅读形式，事实上，每天越来越多的新闻层出不穷，还没被人看到就已成为了“旧闻”。回归报纸的版面设计，堆叠新闻模块，让用户告别一条接一条整齐的新闻链接，而是在一个版面上提供更多的信息，不失为一种尝试。

而抛去产品的层面，从前端方向来看，“聚合阅读”也有许多值得学习的地方。这几天研究了一下源码，谈谈它随机布局的实现，以及一些优化的措施。

##**demo**

点击按钮可以改变布局：
<!--more-->

<iframe id="demoIframe" src="/assets/demo/my_news_reader/index.html" width="600" height="420" scrolling="no"></iframe>

##**一.怎样定义格子对象**

每个格子对象，都至少应该有这5个属性：   

+ left：距离左边界的位置         
+ top：距离上边界的位置           
+ width：格子宽度             
+ height：格子高度            
+ background：格子颜色        

逐个去定义对象无疑是愚蠢的： 
```js 
	function Block(o){
		return{
			left: o.left,
			top: o.top,
			width: o.width,
			height: o.height,
			bg: o.bg
		}
	}
	var block1 = new Block({
		left: 0,
		top: 0,
		width: 50,
		height: 50,
		bg: "#3f3"
	});
	var block2 = …
	…
	var block37 = …
```
这样不仅不利于后期维护，而且构造格子的嵌套关系也相对麻烦。

网易的做法是使用“交替切割”的方式来做：         
1. 将大块先切成两列。         
2. 左列（红色部分）再切成三行，右列（褐，黄，蓝部分）也切成三行。
3. 对形成的6个小块，再进行列的切割

整个做法就是“列-行-列-行-……”这样的交替切割。所以它的对象是这样设置的,其中random属性可以约定同级的cols或rows是否可以随机变换位置，width和height的值是规定一个父级块的分割比例。其设置的形式例如（例子与demo的设定无关）：
```js 
	window.tagConfig.pageLayout = {
		top: 0,
		left: 0,
		width: 100,
		height: 100,
		random: !1,
		cols: [{
			width: 30,
			rows: [{
				height: 40,
				cols: [{
					width: 30,
					rows:[{
						height:100
					}]
				},{
					width: 70,
					rows:[{
						height:100
					}]
				}]
			},
			{
				height: 30
			},{
				height: 30
			}]
		},{
			width: 70,
			rows:[{
				height:100
			}]
		}]
	}
```
##**二.递归调用切割函数**
```js 
	function _getGrids(tag) {
		/*domArr是拥有left,top,width,height,bg等属性的所有dom数组，_getGrids的最终目的就是生成这个数组*/
		var domArr = [],
		_cutGrid(tag.pageLayout,
			function(tag) {
				if (tag.rows || tag.cols) {
					/*假如子级存在rows或者cols，则递归切割*/
					_cutGrid(tag, arguments.callee);
				}
				else {
					/*子级不存在rows或者cols，不再进行切割，构造domArr*/
					…
					domArr.push(xxx)
					…
				}
			}
		);
		return domArr;
	}
```
##**三.切割函数**

切割函数挺有意思的，下次想再用一篇文章来详细写一下，在这里仅贴出参考的源码。
```js 
	/*对象复制函数*/
	function _shadowClone(e) {
		var t = {};
		for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
		return t;
	}

	/*判断子块随机布局与否*/
	(function() {
		function ranOrNot(e, t) {
			var n = [];
			typeof t == "undefined" && (t = e, e = 0);
			for (; e < t; e++) n.push(e);
			return n
		}
		/*随机布局*/
		Array.prototype.randomEach = function(t) {
			console.log(3);
			if (typeof t != "function") throw new TypeError;
			var n = this.length,
			r = ranOrNot(n);
			while (n) {
				var i = Math.floor(Math.random() * n--);
				if (t(this[r[i]]) === !1) break;
				r[i] = r[n]
			}
		},
		/*常规布局*/
		Array.prototype.forEach || (Array.prototype.forEach = function(e) {
			var t = this.length;
			if (typeof e != "function") throw new TypeError;
			var n = arguments[1];
			for (var r = 0; r < t; r++) r in this && e.call(n, this[r], r, this)
		})
	} )();
	
	/*切割函数*/
	function _cutGrid(tag, funcJudge) {
		function a(a) {
			function h(cutLength) {
				/*复制子块对象并计算出子块top,left*/
				var u, a = _shadowClone(cutLength);
				c++,
				u = c === l ? tag[cutType2.measure] - s: Math.floor(cutLength[cutType2.measure] * tag[cutType2.measure] / 100),
				a[cutType1.offset] = i + tag[cutType1.offset],
				a[cutType2.offset] = s + tag[cutType2.offset],
				a[cutType1.measure] = f,
				a[cutType2.measure] = u,
				a.colorPattern = tag.colorPattern,
				/*判断小块是否还需要分割*/
				funcJudge(a),
				s += u
			}
			var f, l = a[cutType2.name].length,
			c = 0;
			u++,
			f = u === cutLength ? tag[cutType1.measure] - i: Math.floor(a[cutType1.measure] * tag[cutType1.measure] / 100),
			a.random === !1 ? a[cutType2.name].forEach(h) : a[cutType2.name].randomEach(h),
			s = 0,
			i += f
		}
		/*根据大块是否有rows属性，定义两种切割方式*/
		var cutType1, cutType2;
		tag.rows ? (cutType1 = {
			name: "rows",
			measure: "height",
			offset: "top"
		},
		cutType2 = {
			name: "cols",
			measure: "width",
			offset: "left"
		}) : (cutType1 = {
			name: "cols",
			measure: "width",
			offset: "left"
		},
		cutType2 = {
			name: "rows",
			measure: "height",
			offset: "top"
		});
		var i = 0,
		s = 0,
		cutLength = tag[cutType1.name].length,
		u = 0;
		/*是否随机布局*/
		tag.random === !1 ? tag[cutType1.name].forEach(a) : tag[cutType1.name].randomEach(a)
	}
```
##**四.最后**
完成到这一步，我已不记得声明对象时出了多少次错误。各种尖括号，方括号，逗号和分号翩翩起舞时，你一定跟我一样很想念coffee的语法糖…