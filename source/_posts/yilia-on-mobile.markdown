---
layout: post
title: "hexo主题Yilia在移动端适配的一些事"
date: 2015-02-23 12:58
comments: true
tags: 
	- hexo
	- 主题 
---     

[Yilia](https://github.com/litten/hexo-theme-yilia)是我去年9月开发的主题，本来只是想给自己玩，因而开始有许多“任性”的设计。诸如“我本可以兼容ie，但我就不”这种…
结果star数越来越多，半年里，居然成为了搜索“hexo-theme”最多star数的主题。
感慨大家跟我一样任性的同时，也是受宠若惊，万分感谢！

而年前的主要矛盾，是日益增多的star和fork数，与功能还未完善之间的矛盾；以及越来越多的bug被大家发现，与我忙得飞起只好假装没发现这些bug的矛盾…

默默放下抢红包的手机，还是决定先把关于hexo最想解决的三件事之一：移动端适配给做了。

<!--more-->

##三件事

话说这三件事一直有放在心上，是使用hexo时还不够满意的地方。
<br/>             
1. **移动端适配。**就很多主题来看，响应式布局就等同于移动端适配，这是远远不足够的。布局影响的仅仅是视觉，还必须有特有的交互逻辑，以适应大家的操作习惯。
2. **seo。**hexo的seo还比较弱，description需要支持文章自定义比较稳妥，而把标签云塞到keyword里面去是个好想法。
3. **模块化加载。**把fancybox，jiathis，duoshuo这些给延迟加载，移动端和pc端js分离。就瀑布图来看，是有信心提速20%-30%的。
<br/>
                  
##移动端适配

关于适配着重在这些方面：

* 滚动时视觉感官上的流畅性
* 便于单手操作
* 次要信息在左侧边栏的收纳管理

<video controls="" autoplay="" name="media"><source src="/assets/video/yilia-mobile.mp4" type="video/mp4"></video>
