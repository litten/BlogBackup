---
layout: post
title: "instagram图片拉取小经验"
date: 2014-03-03 22:52
comments: true
tags: 
	- web 
	- 经验 
	- 产品
---

最近喜欢上了instagram，分享一下获取照片的经验。
<!-- more -->
###一、三“步”曲
instagram开放了API，授权遵循Oauth2.0协议。        
####1、注册client id
到[管理客户端页面](http://instagram.com/developer/clients/manage/)，选择“注册新客户端”。   
这时会提示你填手机号，接着会收到短信验证码。经过验证，就到达了下面的界面：
![填写信息](/assets/blogImg/instagram1.jpg)         
按照字面意思填写完毕，client id就注册完毕了。                 

![获得client_id](/assets/blogImg/instagram2.jpg)         

####2、用client_id去换取token
在浏览器中请求：
```
    https://instagram.com/oauth/authorize/?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=token
```
花括号里面的值，对应上一步最终得到的`client_id`和自己设定的`redirect_uri`。          
请求到的是一个授权页面，授权完毕后，则重定向到你的redirect_uri。注意看授权成功后的url，hash部分会附带给你的token。至此，token成功获取。

####3、用token去调用API

拿到token，就等于拿到仓库的钥匙了！  
赶紧试着用token调用api查看自己的图片吧：
```
    https://api.instagram.com/v1/users/{USER_ID}/media/recent/?access_token={TOKEN}
```
这时，你会发现似乎…被instagram api坑了一道。user_id是个啥？机智如我，果断填上了自己的用户名。
结果错了。

后来发现有这个的网站：[lookup-user-id](http://jelled.com/instagram/lookup-user-id)，通过此业界良心，成功获取到user_id，摆平了上面的请求。

###二、参考
1. 更多功能可参考[api文档](http://instagram.com/developer/endpoints/users/)
2. 如果想了解Oauth授权，[点此](/blog/2013/08/20/oauth-rabbit/)

###三、再说两句
图片分享的网站万万千，instagram却只有一个。我不是此产品的脑残粉，只是觉得社区氛围这种东西，可意会而不可言传，它是社交产品的灵魂。不是每个功能相近的产品都能营造的。

事实上，instagram有很多限制，或者大家称之“功能不完善”的地方。比如，在pc上浏览网站，居然不能发图片，不能看自己关注的人，或者有哪些粉丝。这都限制死了，何以称为社交？但换个角度来想，这样就“强迫”用户去用手机操作instagram，因为产品最想想表达的，就是用摄影去快速记录生活，而已。

不用拓展业务的噱头去损坏产品的思想表达，不刻意向老板汇报我们新增了多少用户量。

**“你想做什么，你就会进入什么样的圈子”**，这句话，不单单是对用户而言，每个创造者心中都应有这样的思考。

the end.        
litten 2014.3.3