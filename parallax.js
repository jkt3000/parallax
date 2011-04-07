/*
 * Super Simple Parallax Jquery Plugin
 * John Tajima
 * 
 */

(function($) {
  $.fn.parallax = function(options) { 
    var opts = $.extend({}, $.fn.parallax.defaults, options);

    var windowSize = $(window).height();    // store window size
    // update window size if when gets resized
    $(window).resize(function(){
      windowSize = $(window).height();
    });
    
    // cache frames and add event listener for 'inview'
    $.fn.parallax.frames = $('.' + opts.frameClass);
    $($.fn.parallax.frames).bind('inview', frameInViewHandler);

    // init all data-scrollFactor elements and store orig pos & start/stop and factor
    $("[data-scrollFactor]").each(function(i,el){
      $(el).data({
        origPos: $(el).position().top,
        scrollFactor: $(el).attr('data-scrollFactor'),
        scrollStart: $(el).attr('data-scrollStart'),
        scrollEnd: $(el).attr('data-scrollEnd')
      });
    });

    // listen to scrolling
    $(this).scroll(function(e){
      var currPos = $(this).scrollTop();
      var frames = getVisibleFrames(currPos, currPos + windowSize);
      if (frames.length > 0) { 
        $.each(frames, function(i,el){
          $(el).trigger('inview', {'currPos':currPos});
        });
      }
    });
    
    // returns frames which are currently visible in browser window
    function getVisibleFrames(top, bot) {
      return $.map($.fn.parallax.frames, function(el, i){
        var frameTop = $(el).position().top;
        var frameBot = frameTop + $(el).height();
        return ((frameTop < top && frameBot > bot) || (frameTop < bot && frameBot > top) || (frameTop > top && frameBot < bot)) ? el : null;
      });
    }

    // callback when frame is in view
    // repositions scrollable elements by relPos * factor
    function frameInViewHandler(e, params) {
      var $frame   = $(e.target);
      var frameTop = $frame.position().top;
      var relPos   = frameTop === 0 ? params.currPos : params.currPos - frameTop + windowSize;      
      var currPos  = params.currPos;
      
      $frame.find('[data-scrollFactor]').each(function(i,el){
        var data = $(el).data();
        if (relPos < data.scrollStart || relPos > data.scrollEnd) {
          return;
        }

        var newPos = data.origPos + (currPos - frameTop) * data.scrollFactor;
        //$(el).css({'top':newPos + 'px'});
        $(el).animate({'top':newPos+"px"}, 20);
      });
    };

    return this;
  };

  $.fn.parallax.frames = [];
  $.fn.parallax.defaults = {
    frameClass: 'frame'
  };

  /* private functions */

})(jQuery);
