---
layout: post
title: "模式应用小分享——中介者模式(mediator)"
date: 2013-01-02 12:36
comments: true
tags: 
	- coffeescript 
	- 模式
---
![实况足球](/assets/blogImg/mediator1.jpg)   
> 你需要一种设计模式，一定是哪里出问题了。这问题是指语言天生缺陷，不得不去寻找一种通用的解决方案。

程序设计最后的终点，就是要找到一种解决方案来解决问题。这句话正确无疑。但我又想起有个冷笑话，A对B说：我教你怎么去赢这盘象棋，B问怎样，A回答说：吃掉对方的“帅”就赢了啊。略去中间的过程，直接描述到结果，这其实是毫无意义的。而设计模式，又恰恰关乎中间解决问题的过程。
<!-- more -->
现在关于模式的文章与书籍层出不穷，我自己也在看。但当我将理论回归应用的时候，一下子就懵了。这么多的模式，就像是一张又一张的棋谱教学，它告诉你要这么那么做，但你很少知道如何对症下药。也许到最后你东拼西凑总可以把“帅”吃掉，但遇到一个问题，如何选择下一步的模式见招拆招，已达到最有效率的胜利呢？

因此我想写一些模式在应用方面的小分享。

##**中介者，你想到了什么？**
我们可以从实况足球谈起。一场足球比赛，进球加分，犯规处罚，控制时间，这些事件都由一个人来处决，我们叫他裁判，其实他就是比赛的中介者。裁判童鞋，代表了一种**“控制集中化”**的理念，这就是中介者模式的关键。试想一下，我们平时打球一般没有裁判，比分多少，是否犯规等都是由运动员我们自己来记录的，而我们往往都会有记错比分或者犯规纠纷的经验吧。这反应到程序上，就可以说是交互的复杂性带来的混乱。因此，我们在正规的比赛中必须要有裁判，运动员才可以把全部精力放到比赛上面去。于是中介者的引入，把运动员自己的复杂性变成了中介者的复杂性。

再深入一点，为什么有了裁判后，运动员的精力可以更集中呢？原因很简单，我们不需要记对方的分数了，犯规了也用不着自己去跟对方辩论。也就是说，两个队伍之间完全不用有比赛信息的直接交流了，取而代之的是把自己的信息转交给了裁判，让裁判去衡量两个队伍的信息，再进行加分，去判定是否犯规。这时我们可以说，这两个队伍对象解耦了，队伍对象之间的解耦，在客户端程序设计上的效果是很显著的，你很容易再引入一个队伍对象进行管理。试想一下如果有一场奇怪的球赛是有三个，四个队伍一起进行的，有了裁判这个中介者，运动员还是可以集中精力去比赛，否则他们就要去再多记比分了。

##**一个例子**
<iframe id="demoIframe" src="/assets/demo/mediator/demo.html" width="500" height="314" scrolling="no"></iframe>
或者点这里弹出看[demo](/assets/demo/mediator/demo.html)         
三国无双游戏中，有个经典的桥段，大家称为“拼刀”。当两个武将触发拼刀时，武将用武器相互抵着，玩家需要疯狂的按攻击键，一定时间内，谁按的次数多，谁就能赢得拼刀的胜利。其实这就是一个中介者模式的好例子。

其实不止是像这种“比赛”，想想像电力公司，将各家的电力进行集中管理，像给大家批阅试卷，给出成绩的老师，像一下子可以灭所有灯的寝室楼阿姨，像中国人民代表大会…额好吧，总之就是这么回事。

##**demo代码解析 coffeescript实现（50行）**

首先我们设定<code>Player</code>对象，它有points和name属性，同时有一个prototype的属性play，使自己的分数加以，并将这信息通知中介者mediator：
```coffeescript
	Player = (name)->
		@points = 0
		@name = name

	Player::play = ->
		@points++
		mediator.played()
```
然后我们设定<code>scoreboard</code>对象，这是一个得分板，在MVC模式当中，充当了V(view)，视图。它的使命就是update，将传递给它的数据score展示出来。因为裁判是mediator，它判定队伍得分后(得到score)，他必须通知电视台(对应scoreboard)，让他们把分数展示出来：
```coffeescript
	scoreboard = 
		element:
			document.getElementById "results"
		update:(score)->
			msg = ''
			for key,value of score 
				if score.hasOwnProperty key
					msg = msg+"<span><strong>#{key}</strong>:#{value}</span>"
			@element.innerHTML = msg
			diff = score.Home - score.Guest
			if diff > 15 
				alert "Home Win!"
				location.reload();
			else if diff <-15
				alert "Guest Win!"
				location.reload();
			else
				document.getElementById('barGuest').style.width = 150 + (diff*10) + 'px'
```
最后的片段就是中介者，<code>mediator</code>。它首先要决定开始比赛，也就是setup，新建了一个名称为Home，一个名称为Guest的Player model。当两个player得分时，mediator执行played，收集两方的分数，构造成score对象，并将这score对象交由scoreboard展示。keypress则是用于判断怎样才算得分：
```coffeescript
	mediator = 
		players:{}
		setup:->
			players = @players
			players.home = new Player 'Home'
			players.guest = new Player 'Guest'
		played:->
			players = @players
			score = 
				Home: players.home.points
				Guest:players.guest.points
			scoreboard.update score
		keypress:(e)->
			e = e|| window.event
			keycode = e.which
			if keycode is 102
				mediator.players.home.play()
				return
			if keycode is 106
				mediator.players.guest.play()
				return
```
最后执行，运行程序：
```coffeescript
	mediator.setup()
	window.onkeypress = mediator.keypress
```

##**小分享心得**
中介者模式将控制集中化，colleague对象之间解耦，不必维护各自之间的网状通信，但mediator承受了所有colleague提供过来的信息，肯定会相对复杂。如何优化mediator也会成为一个课题。中介者模式有点像一对多的模型，一个mediator对应多个colleague，而如果现实模型是多对多的，中介者模型视复杂度来说不一定适合。