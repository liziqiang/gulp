/**
 * Created by zhaoning on 2015/9/15.
 */

//查看更多交互
;(function() {
    var lastScrollTop = 0;
    var timer         = 0;
    var __init        = function() {
        clearTimeout( timer );
        timer = setTimeout( function() {
            var $seeAllBtn = $( '#seeAllBtn' );
            var scrollTop  = $( window ).scrollTop();
            if ( scrollTop > lastScrollTop ) {
                $seeAllBtn.show().animate( {
                    'height' : '36px'
                }, 100 );
            } else {
                $seeAllBtn.animate( {
                    'height' : '0'
                }, 100, function() {
                    $seeAllBtn.hide();
                } );
            }
            lastScrollTop = scrollTop;
        }, 200 );
    };
    __init();
    $( window ).off( 'scroll', __init ).on( 'scroll', __init );
})();
__inline( 'stream.js' );
F.ready( setupStreamPlayer );