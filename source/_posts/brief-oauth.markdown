---
layout: post
title: "谈谈OAuth1,OAuth2异同"
date: 2013-08-11 10:55
comments: true
tags: 
	- web
---
##**一、写在前面**     
在收集资料时，我查询和学习了许多介绍OAuth的文章，这些文章有好有坏，但大多是从个例出发。因此我想从官方文档出发，结合在stackoverflow上的一些讨论，一并整理一下。整理的内容分为OAuth1.0a和OAuth2两部分。
> OAuth 1.0a：One Leg ->Two Leg -> Three Legged            
> OAuth 2:Two Leg ->Three Legged (附：Refresh Token的方式)

这两种模式都是按箭头从左往右安全性递增，其实现也会相对复杂。关于官方的这种leg（腿？）的说法，在中文翻译中比较少有文章提及。下面分别来介绍OAuth的这5种授权流程。

<!--more-->
##**二、OAuth1.0a**
**2.1 OAuth 1.0a (One Leg)**

1. 应用给服务器发送一个签名请求，附带以下参数：           
	* oauth_token Empty String             
	* oauth_consumer_key                  
	* oauth_timestamp                   
	* oauth_nonce                    
	* oauth_signature                  
	* oauth_signature_method              
	* oauth_version Optional                  
2. 服务验证并授予对资源的访问                 
3. 应用程序利用请求的资源                

**2.2 OAuth 1.0a (Two Legs)**

1. 应用发送一个签名请求，以获取 Request Token：                 
	* oauth_consumer_key                          
	* oauth_timestamp                     
	* oauth_nonce                        
	* oauth_signature                  
	* oauth_signature_method                       
	* oauth_version Optional                      
2. 服务器返回Request Token：                   
	* oauth_token                    
	* oauth_token_secret                  
	* Additional Parameters / Arguments                   
3. 发送签名请求，用Request Token换取Access Token                      
	* oauth_token Request Token                    
	* oauth_consumer_key                   
	* oauth_nonce                 
	* oauth_signature                      
	* oauth_signature_method                    
	* oauth_version                           
4. 服务器返回Access Token和Token Secret    
5. 应用通过Access Token和Token Secret利用请求的资源

**2.3 OAuth 1.0a (Three Legged)**

1. 应用发送一个签名请求，以获取 Request Token：                
	* oauth_consumer_key                       
	* oauth_timestamp                       
	* oauth_nonce                       
	* oauth_signature                       
	* oauth_signature_method                       
	* oauth_version Optional                       
2. 服务器返回Request Token：                       
	* oauth_token                       
	* oauth_token_secret                       
	* oauth_callback_confirmed                       
	* … Additional Parameters / Arguments                       
3. 发送给用户授权的URL                       
	* oauth_token                       
4. 提示用户进行授权                       
5. 用户进行授权                       
6. 授权结束后返回应用，附带上：                       
	* oauth_token                       
	* oauth_verifier                       
7. 发送签名请求，用Request Token换取Access Token                       
	* oauth_token Request Token                       
	* oauth_consumer_key                       
	* oauth_nonce                       
	* oauth_signature                       
	* oauth_signature_method                       
	* oauth_version                       
	* oauth_verifier                       
8. 服务器返回Access Token和Token Secret                       
9. 应用通过Access Token和Token Secret利用请求的资源                       

##**三、OAuth2**         

** 3.1 OAuth 2 (Two Legged)**

3.1.1 客户端凭据方式              

1. 应用发送请求到服务器：                   
	* grant_type = client_credentials                   
如果没有使用Authorization（Authorization: Basic Base64(client_id:client_secret)） 的header，必须附带参数为：                   
	* client_id                   
	* client_secret                   
2. 服务器以Access Token回应                   
	* access_token                   
	* expires_in                   
	* token_type                   

3.1.2 隐式授予方式               

1. 应用发送请求到服务器：                                                
	* response_type = token                      
	* redirect_uri This is a server-side Redirection URI hosted by the provider or yourself.                      
	* scope                      
	* state Optional                      
	* client_id                      
2. 用户可根据需要授权。                      
	* username                      
	* password                      
3. 服务器将响应包含access_token在内的redirect_uri                      
4. 应用程序跳转至redirect_uri                      
5. redirect_uri将响应一段脚本或HTML片段。响应的脚本或HTML片段包含参数access_token，还有您可能需要的任何其他参数。                  

3.1.3 资源所有者密码方式                  

1. 应用向资源所有者请求凭证                   
	* username                   
	* password                   
2. 应用使用凭证，向服务器发送请求                   
	* grant_type = password                   
	* username                   
	* password                   
url看起来会像这样：grant_type=password&username=my_username&password=my_password                   
如果你没有使用Authorization的header，必须附带上参数：                   
	* client_id                   
	* client_secret                   
url看起来会像是：                   
grant_type=password&username=my_username&password=my_password&client_id=random_string&client_secret=random_secret                   
3. 服务器返回Access Toke                   
	* access_token                   
	* expires_in                   
	* token_type                   

** 3.2 OAuth 2 (Three Legged) **

1. 应用重定向用户到授权服务：                    
	* client_id                    
	* redirect_uri                    
	* response_type                    
	* state Optional; Unique identifier to protect against CSRF                    
	* scope Optional; what data your application can access.                    
url看起来会像是：                    
oauth_service/login/oauth/authorize?client_id=3MVG9lKcPoNINVB&redirect_uri=http://localhost/oauth/code_callback&scope=user                    
2. 用户登录服务器并确认授权给应用                    
3. 服务器重定向用户到redirect_url ，附带参数：                    
	* code                    
	* state                    
4. 应用拿到code，并换取Access Token                    
	* client_id                    
	* client_secret                    
	* code                    
	* redirect_uri Optional;                    
	* grant_type = "authorization_code"                    
5. 如果的client_id和client_secret是有效的，服务器将调用一个回调redirect_url，包含ACCESS_TOKEN                    
	* access_token                    
	* expires_in                    
	* refresh_token                    
6. 应用保存ACCESS_TOKEN，在随后的请求中使用。通常这个值被存储在session或或cookie，需要时作为授权请求的参数。   

** 3.3 OAuth 2 (Refresh Token 刷新token) **

在OAuth2中，Token会有过期时间，我们必须去refresh_token，使用其他一些先前获得的参数，生成一个新的token。这是一个容易得多的流程。    

1. 创建刷新令牌请求                  
	* grant_type = "refresh_token"                      
	* scope Optional; Cannot have any new scopes not previously defined.                     
	* refresh_token                     
	* client_id                     
	* client_secret                     
2. 服务验证和响应以下参数：                     
	* access_token                     
	* issued_at                     

##**四、stackoverflow上的一些问答**         
                
**Q**：OpenID和OAuth的区别是什么？                    
**A**：OpenID是有关身份验证（即证明你是谁），OAuth有关授权（即授予访问权限），推荐博文：[从用户的角度来看OpenID和OAuth](http://cakebaker.42dh.com/2008/04/01/openid-versus-oauth-from-the-users-perspective/)                    
                   
**Q**：OAuth2与OAuth1不同的地方是？有人可以简单的解释的OAuth2和OAuth1之间的区别吗？ OAuth1现在已经过时，应实施的OAuth2？我没有看到许多实现的OAuth2，大多数仍在使用OAuth，这让我怀疑的OAuth2的准备使用。是吗？                      
**A**：OAuth2能更好地支持不是基于浏览器的应用。对于不是基于浏览器的应用程序，这是对OAuth的主要挑战。例如，在OAuth1.0，桌面应用或手机应用必须引导用户打开浏览器所需的服务，与服务进行身份验证，并复制令牌从服务返回给应用程序。这里的主要批评是针对用户体验。使用OAuth2.0，可以用新的方式为用户的应用程序获得授权。                     
OAuth2.0不再需要客户端应用程序拥有密钥。这让人回想起老的Twitter认证的API，它并不需要应用得到HMAC哈希令牌和请求字符串。使用OAuth2.0，应用程序可以通过HTTPS获得令牌。                               
OAuth2.0的签名流程简单得多。没有更多的特殊解析，排序，或编码。                           
OAuth2.0的访问令牌是“短命”的。通常情况下，OAuth1.0的访问令牌可以存储一年或一年以上（Twitter从来没有让他们到期）。 OAuth的2.0有刷新令牌的概念。虽然我不能完全肯定这是什么意思，我的猜测是，您的访问令牌可以是短暂存储的（即基于会话），而你可以刷新令牌。你使用刷新令牌获取新的访问令牌，而不是让用户重新授权您的应用程序。                                     
最后，OAuth2.0使得负责处理的OAuth请求的服务器和处理用户的授权服务器之间的角色有一个干净的分离。更多信息，在上述的文章中详述。
                   
**Q**：OAuth2服务器群怎么使用state来防范CSRF？                        
**A**：state只是一个随机的字符串，可以做这样的事情：$state = md5(uniqid(rand(), TRUE));在session中记录satate，以便稍后你能做验证。一些额外的资料：[OAuth2威胁文件模型](http://tools.ietf.org/html/draft-ietf-oauth-v2-threatmodel-00)，[特别CSRF保护](http://tools.ietf.org/html/draft-ietf-oauth-v2-26#section-10.12)                                    
