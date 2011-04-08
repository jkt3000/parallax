/*
 * Super Simple Parallax Jquery Plugin
 * John Tajima
 * 
 */
 
(function($) {
  $.fn.parallax = function(options) { 
    var opts = $.extend({}, $.fn.parallax.defaults, options);
    var prevPos = 0;  // start pos at 0

    // init all data-scrollFactor elements and store orig pos & start/stop and factor
    var $layers = $("[data-scrollFactor]");
    
    // cache some data in each layer
    $layers.each(function(i,el){
      $(el).data({
        origPos: $(el).position().top,
        scrollFactor: $(el).attr('data-scrollFactor'),
        scrollStart: $(el).attr('data-scrollStart'),
        scrollEnd: $(el).attr('data-scrollEnd')
      });
    });

    // listen to scrolling
    $(this).scroll(function(e){
      var currPos = $(this).scrollTop();  // get scroll pos
      log("curr: "+currPos);
      var delta = currPos - prevPos;
      
      // loop through all layers
      $layers.each(function(i,el){
        var params = $(el).data();
        
        // calculate newPos for layer        
        var newPos = params.origPos - currPos;
        // add/sub back in scroll range
        if (currPos > params.scrollEnd) {
          var amt = params.scrollEnd - params.scrollStart;
        } else if (currPos > params.scrollStart) {
          var amt = currPos - params.scrollStart;
        } else {
          var amt = 0;
        }
        newPos += amt * params.scrollFactor;
        $(el).css({'top': newPos+"px"}); // move layer        
        //$(el).animate({'top':newPos+"px"}, 10);
      });

      prevPos = currPos;
    });

    return this;
  };

  $.fn.parallax.defaults = {};

  /* private functions */
  function log(msg) {
    if (window.debug === true && console && console.log) {
      console.log(msg);
    } 
  }
})(jQuery);
