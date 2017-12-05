(function(){
	$.extend({
		bookTurn:function(obj){
			$(obj.pageClass).css({
				position: 'relative',
				transform: 'rotateX(30deg)',
				transformStyle: 'preserve-3d'
			})
			$(obj.pageClass).find('.page').css({
				transition:'all linear '+ obj.durTime,
				transformOrigin:'left center'
			})
			var totalNum = $('.page').length - 1;
			var n = $('.page').length - 1;
			$('#nexBtn').on('click',function(){
				initIndex(n,totalNum)
				$('.page').eq(n).css({transform:'rotateY(-160deg)',zIndex:99})
				n = --n <= 0 ? 0 : n;
			})
			$('#preBtn').on('click',function(){
				initIndex(n,totalNum)
				$('.page').eq(n).css({transform:'rotateY(0deg)',zIndex:99})
				n = ++n >= totalNum ? totalNum : n;
			})
			function initIndex(n,totalNum){
				for(var i = totalNum; i > n; i-- ){
					$('.page').eq(i).css({zIndex:9-i});
				}
				for(var j = 0; j < n; j++ ){
					$('.page').eq(j).css({zIndex:j});
				}
			}
		}
	})
})()

	