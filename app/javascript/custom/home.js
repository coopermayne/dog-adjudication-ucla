$(document).on('turbolinks:load', function() {
	//$(document).ready(function() {

	$('span').on("click", function(e) {
		var el, startTime;
		el = $(e.target);
		startTime = el.data('start');
		$('audio').prop("currentTime", startTime);
		return $('audio').get()[0].play();
	});

	var okToUpdate=true

  //$('audio').bind('timeupdate', function(){
	//if (okToUpdate) {
		//var that = this
		//var $x = $('span').filter(function() { 
			//return $(this).data("start") > that.currentTime - 0.2
			////return ($(this).data("start")<this.currentTime && $(this).data("end")>this.currentTime)
		//}).slice(0,8)
    //$('span').css("text-decoration", "none")
    //$x.css("text-decoration", "underline")

		//okToUpdate = false
		//setTimeout(function(){okToUpdate=true},2000);
		
	//}
  //})

	$("#zoom").click(function() {
		var cTime = $('audio').prop('currentTime')

		var $x = $('span').filter(function() { 
			return $(this).data("start") >= cTime
		}).first()

		$x.delay(500).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).delay(500).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).delay(500).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)

		$([document.documentElement, document.body]).animate({
			scrollTop: $x.offset().top -100
		}, 1000);
	});



	window.TinyQ.init();
  
});
