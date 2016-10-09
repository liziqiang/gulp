//define( function( require, exports, module ) {
/**
 * 需设置viewport，<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=0,minimal-ui" />
 # @pargam win 窗口window对象
 # @pargam option{
 designWidth: 设计稿宽度，可选，默认640
 designFontSize: 设计稿宽高下用于计算的字体大小，默认20，可选
 callback: 字体计算之后的回调函数，可选
 }
 # return Boolean;
 # ps:请尽量第一时间运行此js计算字体
 */
!function( win, option ) {
    option             = option || {};
    var settings       = { designWidth : 720, designFontSize : 100, handleResize : true, maxCount : 20, maxWidth : 480 },
        MAX_COUNT      = option.maxCount || settings.maxCount,
        handleResize   = option.handleResize || settings.handleResize,
        designWidth    = option.designWidth || settings.designWidth,
        designFontSize = option.designFontSize || settings.designFontSize,
        callback       = option.callback || null,
        root           = document.documentElement,
        maxWidth       = option.maxWidth || settings.maxWidth,
        rootWidth, newSize, t, self;
    //返回root元素字体计算结果
    function _getNewFontSize() {
        var w = win.innerWidth;
        if ( F.platform.isIpad && (w > maxWidth) ) {
            w                = maxWidth;
            root.style.width = maxWidth + 'px';
        } else {
            root.style.width = '100%';
        }
        return w / designWidth * designFontSize;
    }

    !function() {
        rootWidth = root.getBoundingClientRect().width;
        self      = self ? self : arguments.callee;
        //如果此时屏幕宽度不准确，就尝试再次获取分辨率，只尝试20次，否则使用win.innerWidth计算
        if ( rootWidth !== win.innerWidth && MAX_COUNT > 0 ) {
            win.setTimeout( function() {
                --MAX_COUNT;
                self();
            }, 0 );
        } else {
            newSize = _getNewFontSize();
            //如果css已经兼容当前分辨率就不管了
            if ( newSize + 'px' !== getComputedStyle( root )[ 'font-size' ] ) {
                root.style.fontSize = newSize + "px";
                return callback && callback( newSize );
            }
        }
    }();
    //横竖屏切换的时候改变fontSize，根据需要选择使用
    if ( handleResize ) {
        win.addEventListener( "resize", function() {
            clearTimeout( t );
            t = setTimeout( function() {
                self();
            }, 200 );
        }, false );
    }
}( window );