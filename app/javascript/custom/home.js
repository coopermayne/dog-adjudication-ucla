$(document).on('turbolinks:load', function() {
	//$(document).ready(function() {

	$('span').on("click", function(e) {
		var el, startTime;
		el = $(e.target);
		startTime = el.data('start');
		$('audio').prop("currentTime", startTime);
		return $('audio').get()[0].play();
	});

	window.TinyQ.init();
  
});
