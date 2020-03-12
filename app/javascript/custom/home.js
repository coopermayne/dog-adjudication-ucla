(function() {
  jQuery(function($) {
    var citToggle;
    return citToggle = false;
  });

  $(document).ready(function() {
    new ClipboardJS('.button');
    $('span').on("click", function(e) {
      var el, startTime;
      el = $(e.target);
      startTime = el.data('start');
      $('audio').prop("currentTime", startTime);
      return $('audio').get()[0].play();
    });
    return $(document).on("mouseup", function(e) {
      var ed, edF, selObj, selRange, st, stF, str;
      console.log("mouseup");
      selObj = window.getSelection();
      selRange = selObj.getRangeAt(0);
      st = selRange.startContainer.parentElement.dataset.start;
      ed = selRange.endContainer.parentElement.dataset.end;
      console.log(st);
      console.log(ed);

      stF = moment("2015-01-01").startOf('day').seconds(st).format('H:mm:ss');
      edF = moment("2015-01-01").startOf('day').seconds(ed).format('H:mm:ss');
      str = "[" + stF + "-" + edF + "]";
      return $('#cit').val(str);
    });
  });

}).call(this);