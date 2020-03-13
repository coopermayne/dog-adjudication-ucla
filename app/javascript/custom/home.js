$(document).on('turbolinks:load', function() {
	//$(document).ready(function() {

	$('span').on("click", function(e) {
		var el, startTime;
		el = $(e.target);
		startTime = el.data('start');
		$('audio').prop("currentTime", startTime);
		return $('audio').get()[0].play();
	});

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
