---
layout: post
title: "Nginx能为前端开发带来什么？"
date: 2015-11-03 21:30
comments: true
reward: true
tags: 
	- 前端
---

Nginx那么好，我想去看看。              
接连逛了两个书城后，我发现并没有Nginx相关的书籍。             
这就很奇怪！

![](/assets/blogImg/nginx0.jpg)

Nginx，一名**网红**（网络服务器红人…），就算没有自传和回忆录，争着介绍它的花边新闻也该有吧。

后来找到仅有的一两本书籍，也直接深入到“源码剖析”的阶段。写得并不十分满意，况且我还不需要这些。     
后来发现了原因，大概是因为**“使用太简单了，都不值得出书”**。           
是的，Nginx把纷繁复杂的功能，浓缩成一份简单的配置，极易上手。          
当它呈现到你面前时，感觉独具匠心。

<!-- more -->

### Nginx与NodeJs

（这里的标题有点歧义。此处的NodeJs，皆引申为NodeJs所搭建的服务器。）

有人说，作为一名前端，**我的真爱是NodeJs**。             
同时也认同，抛去性能之类的比较，单纯从实现的角度，NodeJs编写的服务器也能实现Nginx的各种功能。                

这些我都赞成，但使用Nginx并不意味着抛弃NodeJs。事实上，它们并不冲突，还可以在一起愉快的玩耍。              

在业内，这样的模型已很常见：资源转发，反向代理，静态资源处理，负载均衡，这些事情扔给Nginx来处理，只是几行配置的事情；同时在上游，让NodeJs去处理它最擅长的I/O等事情。               

合理分配各自**擅长**的事情，这样的思路，同样可以运用于前端开发中。                

以前用NodeJs几百行实现的服务器功能，在npm与github的海洋里花尽心思去寻找的模块，也许在Nginx里是一条成熟的配置。它能帮其分担很多事情，节约了成本。                  



### 场景一：环境切换

前端开发中，经常面临多个部署环境切换的问题。           
我们通常用配hosts的方式去实现。更优化些，我们将机器的服务绑定了不同的域名：比如正式环境是a.qq.com，测试环境是test.a.qq.com。 

然而在拓展性和易用性方面，还不足够好。             
而Nginx作为反向代理，就很容易处理资源转发的问题。                 

思路很简单：
> 1. 读取请求里的cookie，如果键名host_id有值，则代理到这个IP地址；
> 2. 如果没有，则代理到默认的正式环境（此处举例为1.1.1.1）;

```
set $env_id "1.1.1.1";
if ( $http_cookie ~* "host_id=(\S+)(;.*|$)") {
    set $env_id $1;
}

location / {
    proxy_set_header Host $host;
    proxy_pass   http://$env_id:80;
}
```
那接下来的事情，就是**怎样用最简便的方式，把IP种在cookie里？**                 
我们应用了nginx-http-footer-filter模块，html文件经过代理时，都注入了一小段js代码。

这段代码，会帮我们展示小菜单，点击某个环境时，则将IP种到cookie里，同时刷新页面，让Nginx完成环境切换。    
![](/assets/blogImg/nginx1.jpg)

切换环境，如今只需点击一次。

 

### 场景二：SourceMap

在线上环境调试Js代码是件麻烦的事情，因为目前合格的前端部署，代码都应经过压缩。性能问题是优化了，debug可不怎么方便。

而SourceMap正好可以解决此问题。

在最新的各版本浏览器里，如果满足：
1. 压缩后的js文件后面有``//# sourceMappingURL=xxx.map``格式的注释
2. 浏览器能正常访问到sourceMappingURL

那么，就能把压缩过的代码还原。
要实现这样的功能，就必须：
1. 现网环境不带以上形式的注释，同时访问不到sourceMap（安全性考虑）
2. 测试环境带注释，能访问sourceMap

这样的模型，用``反向代理+内容纂改``的思路再合适不过。                
每次构建编译时，我们会把sourceMap文件存放到一台机器（举例为1.1.1.1），命名为js文件名后加``.map``后缀。随后，使用Nginx，通过这几行配置就能把此功能实现：

```
location ~ \.js$ {
    footer "\n//# sourceMappingURL=$request_uri.map";
    footer_types "*";
}
```
只要经过代理，在chrome里，我们能看到每份被压缩过的js文件，都有一个对应的源码文件。               
你可以直接使用它来做打断点之类的操作，大大的提升了调试质量。      
![](/assets/blogImg/nginx2.jpg)



### 场景三：内容纂改

其实在以上两个场景里，都涉及了“内容纂改”。              
无论是说“纂改”还是“劫持”，大家的印象都不是什么好事情，但另一方面，他们又可以让事情有趣起来。

统一介绍下，Nginx涉及纂改的模块有：
* [nginx_http_footer_filter](https://m.oschina.net/blog/156826)：往文件的底部添加文字，可包含Nginx的内置变量；
* [nginx_http_addition_module](http://nginx.org/en/docs/http/ngx_http_addition_module.html)：从一个url去读取内容，将之添加到文件的头部或顶部；
* [nginx_http_sub_module](http://nginx.org/en/docs/http/ngx_http_sub_module.html)：替换字符

除去上面两种场景，合理运用这些模块对应的配置，可以做出许多小工具，这是很有想象力的事情。            
单单针对移动web前端开发，就可以实现： 
> 1. 将[weinre](http://people.apache.org/~pmuellr/weinre-docs/latest/)脚本插入到html里，让移动web调试更加便捷。
> 2. 移动web经常用到localStorage优化首屏，但debug时又会受到干扰，通过一个按钮很方便的清除本地缓存。
> 3. 手机APP内嵌页面，很难将其网址分享给另一个人。通过一个按钮就能生成url对应的二维码等



### 场景四：本地映射

在Windows下的前端抓包调试，Fiddler+Willow的能力毋庸置疑。                
而脱离了.NET体系的Linux和Mac，即使有一些代替工具，但某些方面还是略显不足。   

比如：**线上接口映射到本地文件**。            
想到Fiddler的本质也是一个代理，而开启一个有这样能力的Nginx服务，并不是太难的事情。           

而且，我们可以做得更灵活，比如：
* 同时支持慢速调试
* 同时支持目录层级映射
* 同时支持正则匹配
* JSON返回的数据有可能是变化的（比如分页时候），同时支持动态数据

这些场景，只运用到Nginx里的“[rewrite规则](http://www.linuxidc.com/Linux/2014-01/95493.htm)”。                
从参考的文档可以大致看到，rewrite规则非常灵活，能完成各种场景的转发。 

最简单的模型中，我们把所有带``cgi-bin``路径的请求，rewite到本地的一个服务，同时带上请求的所有参数，      
仅需这三行配置即可：
```
location ~ /cgi-bin/* {
    rewrite ^(.*)$ http://127.0.0.1:8080/cgi-bin/ last;
}
```
后续的事情，可以在本地创建一个cgi-bin文件夹，在里面放置需要映射的文本，并开启服务到8080端口即可。 

### 场景五：移动侧调试

`Fiddler` 有一个勾选项 `Allow remote computers to connect`，并可以指定 `listen port` 可以使得手机/其它终端通过将本机设为代理而访问本机环境，与 `hosts` 配合会很实用。

这个功能，用Nginx也很容易做到。           
通过 `default_server` 作为代理，手机终端通过设置网络代理为本机IP和相应的 `listen port`，从而可以访问本机的 Web 服务。

其中也是用到了[ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)模块的配置：
```
 server {
    listen  80 default_server;
    server_name  localhost;
    resolver 8.8.8.8;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://$host;
    }
}

server {
    listen  80;
    server_name  ke.qq.com;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-Ip $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://127.0.0.1:9091/;
    }
}
```

### 边角料

除去特定场景，Nginx的一些配置也跟前端息息相关。以下简单罗列，作为边角材料。

1.[nginx_http_concat](https://github.com/alibaba/nginx-http-concat)               
资源合并，处理CDN combo。例如通过这样的方式``http://example.com/??style1.css,style2.css,foo/style3.css``访问合并后的资源。

2.[ngx_http_image_filter_module](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html)                  
图片处理。提供图片缩放，jpg压缩，旋转等特性。

3.适配PC与移动web                              
总体可运用[ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)，去实现路径转发。判断平台类型的Nginx配置，在开源项目[detectmobilebrowsers](http://detectmobilebrowsers.com/)中可以找到。

### 后记

学习Nginx，我本身只是出于开开眼界的目的。而的确发现了一些很有启发性的特质。   
于前端开发，无论线上线下，熟练掌握基本配置，可以做出许多提高效率的工具。    
**但既然是工具，熟手就好**。 


比如Fiddler直观，但Nginx更底层，更灵活，应当按照实际选择即可。



话说回来，后来心情有些惆怅。            
想起之前，我用NodeJs写过一个八百行的本地调试服务，如今更习惯用Nginx的几行配置。            
不过我又想，**既然我已经花了时间去写，为什么还要花时间去用？！** 
 
 
 
心情又好起来了。（等等有什么不对，管它呢…）

______________

END.     
15.11.03 Litten.

