---
layout: post
title: "一个文件夹的自我介绍"
date: 2014-07-25 08:52
comments: true
tags: 
	- tools 
	- js 
	- github
---       

#folder2tree

> 用字符展示文件夹结构

### 前言 Before:
如何介绍一个文件夹，简直纠结。 

要么**图片**，如果在截图前，你真的愿意，一层一层一层的剥开我的心。你会鼻酸你会流泪；                 
要么**靠说**，那么你可能得这么说：从前，有一个文件夹，文件夹里有两张图片；大图片在跟小图片讲故事…讲个什么故事额          

**因而，用纯字符描述文件夹的小工具必须得有呀。**[github here](https://github.com/litten/folder2tree).
<!-- more -->
### 使用 Usage:

```js
@param {Dom} 父级dom节点               
@param {Array} 描述文件夹层级关系对象

folder2tree.init(document.getElementById("ctn"), [
	{
		"img" : [
			"sprite.png",
			"bg.png"
		]
	},{
		"js": [{
			"common": [
				"jquery.js",{
					"highcharts": [{
						"modules": ["exporting.js"]
					},
					"highcharts.js"
				]}
			]
		},{
			"index": [
				"mian.js",{
					"modules": ["mod.video.js"]
				}
			]
		}]
	},{
		"css": [
			"base.css",
			"index-main.css",
			"index-video.css"
		]
	},
	"index.html",
	"favicon.ico"
]);
```

### 展示 Show:
```
├─img
│ ├─sprite.png
│ └─bg.png
├─js
│ ├─common
│ │ ├─jquery.js
│ │ └─highcharts
│ │    ├─modules
│ │    │ └─exporting.js
│ │    └─highcharts.js
│ └─index
│    ├─mian.js
│    └─modules
│       └─mod.video.js
├─css
│ ├─base.css
│ ├─index-main.css
│ └─index-video.css
├─index.html
└─favicon.ico
```
