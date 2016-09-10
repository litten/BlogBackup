define([], function (){

	var _collection = [];
	var _count = 0;

	var render = function(res){

		var ulTmpl = "";
		for (var j = 0, len2 = res.list.length; j < len2; j++) {
			var data = res.list[j].arr;
			var liTmpl = "";
			for(var i=0,len=data.link.length;i<len;i++){
				var src = 'http://littendomo.sinaapp.com/ins/' + data.link[i];
				var type = data.type[i];
				var target = (src + (type == 'video' ? '.mp4' : '.jpg'));
				src += '.jpg';

				liTmpl += '<li>\
								<div class="img-box">\
									<a class="img-bg" rel="example_group" href="'+src+'" title="'+data.text[i]+'" data-type="' + type + '" data-target="'+ target + '"></a>\
									<img lazy-src="'+src+'">\
								</div>\
							</li>';
			}
			ulTmpl = ulTmpl + '<section class="archives album"><h1 class="year">'+data.year+'<em>'+data.month+'月</em></h1>\
				<ul class="img-box-ul">'+liTmpl+'</ul>\
				</section>';
		}
		$(ulTmpl).appendTo($(".instagram"));

		$(".instagram").lazyload();
		
		$("a[rel=example_group]").fancybox();
	}

	var replacer = function(str){
		var arr = str.split("/");
		return "/assets/ins/"+arr[arr.length-1];
	}

	var ctrler = function(data){
		var imgObj = {};
		for(var i=0,len=data.length;i<len;i++){
			var y = data[i].y;
			var m = data[i].m;
			var src = replacer(data[i].src);
			var text = data[i].text;
			var key = y+""+((m+"").length == 1?"0"+m : m);
			if(imgObj[key]){
				imgObj[key].srclist.push(src);
				imgObj[key].text.push(text);
			}else{
				imgObj[key] = {
					year:y,
					month:m,
					srclist:[src],
					text:[text]
				}
			}
		}
		render(imgObj);
	}

	var getList = function(url){
		$(".open-ins").html("图片同步自instagram");
		$.ajax({
			url: url,
			type:"GET",
			dataType:"json",
			success:function(re){
				render(re);
			}
		});
	}

	return {
		init:function(){
			getList('/assets/ins/ins_list.json');
		}
	}
});