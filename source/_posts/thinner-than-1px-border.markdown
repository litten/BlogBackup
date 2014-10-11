---
layout: post
title: "像素级细节：移动端1px border的实现"
date: 2014-02-22 20:11
comments: true
tags: 
  - css3 
  - html5
brief: "记住，每个尽责的设计师都是处女座"
---       

> 请记住，每个尽责的设计师都是处女座…

这里…没有黑处女座的意思，只是想借题发挥，并由衷的跪倒在强大的“像素眼”之下。
<!-- more -->
###一、你是我的眼

什么是像素眼？                 
就是那些个神奇的存在，他们用余光瞄了你一眼，然后跟你说：我发现啊，你左边眉毛比右边眉毛高了1像素，麻烦你调整下…

在腾讯，我身边的许多设计同学都有这样的眼睛。他们会把细节做到极致，也会因为频繁的修改，把你开发的心情搞得一团糟。但你得承认，他们是对的。

最近在做移动端web开发，按着设计图，toby已在我旁边核对修改了两个多小时。当我觉得已经万事大吉时，toby跟我说，还是觉得不太对——边框好像有点粗？

当时我就傻眼了，因为这已是最细的边框，电脑上清楚的显示，我已经设置了1px的border。于是我去解释，并建议更换个色值，让边框至少“看起来”更细。而toby却不接受，按他给我的说法是：这border看起来不性感…

原来这世界的审美观，都是以瘦为美，从女人到一根线？于是乎，为了寻找性感的border，搜集一堆资料后还真找到了方案：

- **父元素设置**：scale(0.5,0.5)                 
- **子元素设置**：scale(2,2) 还原缩放，origin都是基于左上角（0,0）/left top

这样父元素的border其实被缩放了，无疑更细。

###二、通用方案

用一个css类去为block元素添加更细的border
```css
    .border-1px{
      position: relative;
      &:before, &:after{
        border-top: 1px solid #c8c7cc;
        content: ' ';
        display: block;
        width: 100%;
        position: absolute;
        left: 0;
      }
      &:before{
        top: 0;
      }
      &:after{
        bottom: 0;
      }
    }
```
适应移动设备：
```css
    @media (-webkit-min-device-pixel-ratio:1.5), (min-device-pixel-ratio: 1.5){
      .border-1px{
        &::after, &::before{
          -webkit-transform: scaleY(.7);
          -webkit-transform-origin: 0 0;
          transform: scaleY(.7);
        }
        &::after{
          -webkit-transform-origin: left bottom;
        }
      }
    }

    @media (-webkit-min-device-pixel-ratio:2), (min-device-pixel-ratio: 2){
      .border-1px{
        &::after, &::before{
          -webkit-transform: scaleY(.5);
          transform: scaleY(.5);
        }
      }
    }
```
###三、来个对比

比如，之前我学日语时，自己搞起了个app，这是50音列表界面，可以明显的看出区别：上图是原生方案，下图是…性感方案                
![与原生方案对比](/assets/blogImg/border1px.jpg)      

源码小demo，注意要在手机上才能看到效果：[demo](/assets/demo/border1px.html)。



The End.                 
——litten 2.22 *“写轮眼？弱爆了啊 ←_←”*
