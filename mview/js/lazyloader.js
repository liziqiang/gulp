;(function($){
	$.fn.lazyLoad = function(settings){
		var elements = this;

		elements.each(function(){

			if(this.nodeName != 'IMG') return;

			var options = {
				attr : 'data-src'
			};
			$.extend(options, settings);

			var img = $(this);
			var imgSrc = img.attr(options.attr);

			if( !imgSrc ) return;

			img.addClass( 'lazy-alpha-start' );
			img.on( 'load', onImageLoad ).on( 'error', onImageError ).attr( 'src', imgSrc );
			img.removeAttr( options.attr );
			$.isFunction( options.onlazyload ) && options.onlazyload( img[0] );

		});

		return this;
	};

	function onImageLoad(){
		var me = $( this );
		me.removeClass( 'lazy-alpha-start' );
		me.removeClass( 'lazy-alpha-end' );
		me.off( 'load', onImageLoad ).off( 'error', onImageError );
	}

	function onImageError(){
		var me = $( this );
		me.off( 'load', onImageLoad ).off( 'error', onImageError );
	}

})(Zepto);

;(function() {
    F.page = F.page || {};
    //计算需要加载图片的页面高度
    var options = {}, targets = [], delayTimer = 0;

    //处理延迟加载
    var loadNeeded = function() {
        clearTimeout( delayTimer );
        var viewOffsetLeft = 0,
            viewOffsetRight = 0,
	        viewOffsetTop = 0,
	        viewOffsetBottom = 0,
            img = null,
	        imgSrc,
	        finished = true,
	        i = 0,
	        len = targets.length,
	        target = null,
	        offset = null,
	        isInVerView = false,
	        isInHorView = false;

	    var $root = $( options.root );
	    if( !$root.length ) return;
	    if( options.root == window ){
		    viewOffsetLeft = $root.scrollLeft() - options.preloadHeight;
		    viewOffsetRight = viewOffsetLeft + $root.width() + options.preloadHeight;
		    viewOffsetTop = $root.scrollTop() - options.preloadHeight;
		    viewOffsetBottom = viewOffsetTop + $root.height() + options.preloadHeight;
	    }else{
		    viewOffsetLeft = $root.offset().left - options.preloadHeight;
		    viewOffsetRight = viewOffsetLeft + $root.width() + options.preloadHeight;
		    viewOffsetTop = $root.offset().top - options.preloadHeight;
		    viewOffsetBottom = viewOffsetTop + $root.height() + options.preloadHeight;
	    }
//console.log('viewOffsetLeft, viewOffsetRight,viewOffsetTop,viewOffsetBottom', viewOffsetLeft, viewOffsetRight,viewOffsetTop,viewOffsetBottom);
        for ( ; i < len; ++i ) {
            target = targets[ i ];
            img = $( target );
            imgSrc = target.getAttribute( options.attr );
            imgSrc && (finished = false);
            offset = img.offset();
            isInVerView = offset['top'] < viewOffsetBottom && (offset['top'] + offset.height > viewOffsetTop),
            isInHorView = offset['left'] < viewOffsetRight && (offset['left'] + offset.height > viewOffsetLeft);
//console.log( $root, img, offset['top'],  offset['left'], isInVerView, isInHorView);
            if ( img.width() && imgSrc && isInVerView && isInHorView ) {
	            $( img ).lazyLoad();
            }
        }

        //当全部图片都已经加载, 去掉事件监听
        if ( finished ) {
            F.page.lazyLoadDispose();
        }
    };

	var delayLoad = function() {
		clearTimeout( delayTimer );
		delayTimer = setTimeout( loadNeeded, 100 );
	};
	F.page.lazyLoadImage = function( option ) {
		this.lazyLoadDispose();
		options = option || options;
		options.preloadHeight = options.preloadHeight || 0;
		options.attr = options.attr || 'data-src';
		options.root = option && option.root || window;
		var wrap  = options.root == window ? document : options.root;
		var imgs = $( wrap ).find( 'IMG' ),
			len = imgs.length,
			i = 0;
		targets = [];
		var item = null;
		for ( ; i < len; ++i ) {
			item = $( imgs[ i ] );
			if ( item.attr( options.attr ) && !item.data('ignore') ) {
				targets.push( imgs[ i ] );
			}
		}
		loadNeeded();
		$( options.root).off( 'scroll', delayLoad ).on( 'scroll', delayLoad );
		$( options.root).off( 'resize', delayLoad ).on( 'resize', delayLoad );
	};
    F.page.lazyLoadDispose = function() {
        clearTimeout( delayTimer );
        //var i = 0, len = targets.length, target = null;
        //for ( ; i < len; ++i ) {
        //    target = targets[ i ];
        //    if($(target).hasClass('lazy-alpha-start')){
	     //       return;
        //    }
        //    $( target ).off( 'load', onImageLoad );
        //    $( target ).off( 'error', onImageError );
        //}
        targets = [];
    };
})();

F.ready( function() {
    F.page.lazyLoadImage( { preloadHeight : 100 } );
} );