---
layout: post
title: "分享一个IE6，7的CSS hack bug"
date: 2012-12-17 19:43
comments: true
tags: 
	- css
key: "5"
---
###一、分享一个IE6，7的css hack bug。    
![css hack](/assets/blogImg/css_hack.jpg)   
> IE和我们之间，肯定有一个是傻逼，如果它不是，那我们准是。不然很多事情没法解释…  ——多么痛的领悟 

<!-- more -->
先看代码，或者点击看[demo](/assets/demo/hack_demo.html)         
html:     
```html
	<div id="main">
		<div class="box"></div>
		<div class="box"></div>
	</div> 
```
css:     
```css    
	#main{
		width: 200px;
		height: 50px;
		border: 1px solid #000;
		margin: 0 auto;
	}
	#main .box{
		width: 50px;
		height: 50px;
		margin-left: 10px;
		position: relative;
		float: left;
		background: #333;
	}
	#main .box:hover{
		z-index: 999;
		/*background: #333;*/
		/*background: #999;*/
	}
```
.box设置了的四行核心代码是：          
* <code>float:left</code> - 左浮动         
* <code>margin-left: 10px</code> - 左外边距为10px            
* <code>position: relative</code> - 因为在box里面想用一个dom做绝对定位            
* <code>background: #333</code> - 设置background颜色为#333         
当.box触发hover时，做了一步z-index的改变，这时候在IE6，7中出现bug：因margin-left失效，.box会向左移动10px；而且这时候设置margin-left是不起作用的，hover结束后.box也不会回到原来的位置。

###二、淡定解决异次元的bug

诡异的事情最后水落石出：**background属性居然影响了margin**。

将.box:hover多加一行background属性，比如：<code>background: #999</code>，这样子在IE上“看上去”就解决了。    
**但是**，就当你以为解决了bug的时候，如果.box:hover的background颜色设置与hover之前的颜色一样，也就是设置为<code>background: #333</code>，阴魂不散的bug又会重新出现啦。

庆幸你的需求是background颜色不一样吧。如果还真是悲剧到要做成一样的颜色，解决的办法恐怕只能是取消.box的<code>position: relative</code>，然后多加一层dom容器了。
```css
	<div class="box">
		<div style="position: relative">…</div>
		…
	</div>
```

友情link：[xueran的这篇文字](http://xueran.github.com/blog/2012/12/17/csstest-jiugongge/)。