/*
 * Super Simple Parallax Jquery Plugin
 * by John Tajima
 */

// <div id="xyz" class="foreground" data-scrollStart="100px" data-scrollStop="500px" data-scrollFactor="1">some content</div>
// <div id="xyz" class="foreground" data-scrollStart="500px" data-scrollStop="1000px" data-scrollFactor="2">some content</div>
//
// $(document).parallax({ frameClass: 'frame' })



(function($) {
  $.fn.parallax = function(options) { 
    var opts = $.extend({}, $.fn.parallax.defaults, options);

    // set windowSize
    var windowSize = parseInt($(window).height(), 10);
 
    // update windowSize on window resize event 
    $(window).resize(function(){
      windowSize = parseInt($(window).height(), 10);
    });
    
    // cache all frames
    $.fn.parallax.frames = $('.' + opts.frameClass);
    $($.fn.parallax.frames).bind('inview', frameInViewHandler);
    
    // get curr pos
    var prevPos = $(this).scrollTop();
    
    // listen to scrolling
    $(this).scroll(function(e){
      var currPos = $(this).scrollTop();
      var windowBottom = currPos + windowSize;
      
      var frames = getVisibleFrames(currPos, windowBottom);
      if (frames.length > 0) { 
        $.each(frames, function(i,el){
          $(el).trigger('inview',  {'prevPos':prevPos, 'currPos':currPos, 'windowSize':windowSize});
        });        
      }
      // update old pos
      prevPos = currPos;
    });
    
    function getVisibleFrames(top, bot) {
      return $.map($.fn.parallax.frames, function(el, i){
        var frameTop = $(el).position().top;
        var frameBot = frameTop + $(el).height();
        return ((frameTop < top && frameBot > bot) || (frameTop < bot && frameBot > top) || (frameTop > top && frameBot < bot)) ? el : null;
      });
    }

    // callback when frame is in view
    function frameInViewHandler(e, data) {
      console.log("in view "+ e.target.id);
      var $frame     = $(e.target);
      var currPos    = data.currPos;
      var prevPos    = data.prevPos;
      var delta      = data.currPos - data.prevPos;
      var windowSize = data.windowSize;      
      var relPos;
      if ($frame.position().top === 0) {
        relPos = currPos;
      } else {
        relPos = currPos - $frame.position().top + windowSize;
      }

      console.log("top: " + $frame.position().top + " currPos: "+currPos + " prevPos " + prevPos + " Delta: "+delta + " relPos " + relPos);
      
      $frame.children('[data-scrollFactor]').each(function(i,el){
        var moveby      = delta * $(el).attr('data-scrollFactor');
        var scrollStart = $(el).attr('data-scrollStart');
        var scrollEnd   = $(el).attr('data-scrollEnd');
        console.log("start: " + scrollStart + " end: " + scrollEnd + " by: " + moveby);
        if (relPos < scrollStart || relPos > scrollEnd) {
          return;
        }
        console.log("el top is now "+($(el).position().top + moveby))
        $(el).css('top', $(el).position().top + moveby + "px");
      });
    };

    return this;
  };

  $.fn.parallax.frames = [];
  $.fn.parallax.defaults = {
    frameClass: 'frame',
    objectClass: 'obj'
  };

  /* private functions */

})(jQuery);
