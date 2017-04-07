$(function(){
	var hrefObj = URI(location.href)
    var URIObj = URI(location.href).search(true);
    for (var p in URIObj) {
        if (URIObj[p] === 'undefined' || URIObj[p] === null) {
            URIObj[p] = '';
        }
    }

	/**
 	* 下载排行
 	*/
	$('.common-title-right-ul-time li').click(function(){
		$(".common-title-right-ul-time li").removeClass("common-active");
		$(this).addClass("common-active");
		
		$(".download").hide();
		var id = $(this).attr('dis-only');
		if(id == null){
			id = 'month';
		}
		$("#"+id).show();
	});
	
	/*
	 知识作品  
	 * */
	// $(".knowledge-top-ul li").click(function(){
	// 	$(".knowledge-top-ul li").removeClass("knowledge-active");
	// 	$(this).addClass("knowledge-active");
		
	// 	$(".knowledge-condition").hide();
	// 	var id = $(this).attr("dis-only");
	// 	if(id == null){
	// 		id="works";
	// 	}
	// 	$("#"+id).show();
	// });
	
	/*
	 * 个人简介
	 * 
	 */
	$(".person-title-ul li").click(function(){
		$(".person-title-ul li").removeClass("person-active");
		$(this).addClass("person-active");
		
		$(".person-title-display").hide();
		var id = $(this).attr("dis-only");
		if(id == null){
			id="work";
		}
		$("#"+id).show();
	});


});


/**
 * 全选
 */
function checkedAll(name)
{
	var names=document.getElementsByName(name);
	var len=names.length;
  	if(len>0)
  	{
   		var i=0;
   		for(i=0;i<len;i++){
   			names[i].checked = true;
   		}
  	}
}


