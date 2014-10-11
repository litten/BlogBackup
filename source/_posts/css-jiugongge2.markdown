---
layout: post
title: "css实现九宫格(二)"
date: 2012-12-21 13:54
comments: true
tags: 
	- css
---
书接上回，[上回在这](http://litten.github.com/2012/12/14/css-jiugongge/)。

> 9个元素，每个50*50px，排成九宫格
> 默认是border颜色为blue，hover到格子上变成red（兼容到IE6）

![css题目](/assets/blogImg/jiugongge1.jpg)     

题目的关键是解决“公用边”，上次我主要做了两个方面的尝试：
> 用负margin使元素的border叠加
> 用table的border-collapse实现边框合并

这一次的思路则更加简明，也是个人认为是更好的方法。感谢[队长](http://weibo.com/u/1666828424)提供的思路。

<!-- more -->
##**能不能不用border？**
![一个格子的透视图，a其实充当了div的“边框”](/assets/blogImg/jiugongge10.jpg)      
如果不用border，怎么实现hover后，格子四周变红呢？那肯定是两个dom嵌套在一起，一大一小，小的dom作为“格子”，大的dom作为格子的红色“边框”。先看我初始化的一个格子设定：         
html：     
```html
	<div id="test">
		<a href="#"><div>1</div></a>
	</div>
```
初始css:
```css
	#test div{
		width: 50px;
		line-height: 50px;
		text-align:center;
		background: #AAA;
	}
	#test a{
		width: 55px;
		line-height: 55px;
		float: left;
	}
	#test a:hover{
		background: red;
	}
```css
由于a标签设置了宽度为55px，div标签设置了宽度为50px，这时候格子hover看起来只露出了**右边**的5px红色部分。          

接下来，div添加属性<code>margin-top:5px;margin-right:5px</code>，这时可以显示**上部**的5px边框。再接着，在div的容器，也就是a标签设置<code>padding-left:5px;padding-bottom:5px;</code>，使格子**左边框**和**下边框**都显示出来。

![完成一个格子的设置步骤](/assets/blogImg/jiugongge8.jpg)      

那么为什么要将a标签设置为55px，再进行一系列关于margin和padding的设置呢，原因我们最后再说。

因此修改后的css为：
```css
	#test div{
		width: 50px;
		line-height: 50px;
		text-align:center;
		background: #AAA;
		margin-right:5px;
		margin-top:5px;
	}
	#test a{
		width: 55px;
		line-height: 55px;
		float: left;
		margin-right: -5px;
		margin-bottom: -5px;
	}
	#test a:hover{
		background: red;
	}
```
##**九个格子会怎样？**
将a标签左浮动，同时添加到九个格子，这时候的效果是：两个格子之间会有10px的距离。

为解决“公用边”问题，在a标签添加负值的margin：<code>margin-right:-5px;margin-bottom:-5px;</code>。最后将最外层的容器#test的宽度和高度设置为170px(50*3+5*4)，背景设置为蓝色。这时候大功告成了。

![完成九个格子的设置步骤](/assets/blogImg/jiugongge9.jpg)      

最终的代码是：       
html：      
```html     
	<div id="test">
		<a href=""><div>1</div></a>
		<a href=""><div>2</div></a>
		<a href=""><div>3</div></a>
		<a href=""><div>4</div></a>
		<a href=""><div>5</div></a>
		<a href=""><div>6</div></a>
		<a href=""><div>7</div></a>
		<a href=""><div>8</div></a>
		<a href=""><div>9</div></a>
	</div>
```
css：   
```css          
	#test{
		width: 170px;
		height:170px;
		background: blue;
		margin: 0 auto;
	}
	#test div{
		width: 50px;
		line-height: 50px;
		text-align:center;
		background: #AAA;
		margin-right:5px;/*这句不要也可以*/
		margin-top:5px;
	}
	#test a{
		width: 55px;
		line-height: 55px;
		float: left;
		text-decoration: none;
		padding-left: 5px;
		padding-bottom: 5px;
		margin-right: -5px;
		margin-bottom: -5px;
	}
	#test a:hover{
		background: red;
	}
```
##**巧妙在哪里？**
+ a标签hover前不设置背景色，露出最外层#test的蓝色背景，看起来格子有蓝色的边框；a标签hover时背景色设置为红色，充当了格子的红色边框；       
+ a标签设置为55px是最关键的一点。按照此思路和题目要求，格子是50px大小，边框的dom应该是60px大小。而此时a设置为55px，因为a要设置<code>padding-left:5px;padding-bottom:5px;</code>，刚好a就有60px大小了；而a里面的div要设置<code>margin-top:5px;margin-right:5px</code>（其实margin-right也可以不加）,这时候margin和padding就达到了一个“中和”的效果，使布局不发生偏差。

点此看[demo](/assets/demo/jiugongge_demo2.html)。