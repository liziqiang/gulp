(function() {
    // ------------------------------全屏遮罩------------------------------
    function __addShadow( top, callback ) {
        var $shadow = $( '#__shadow' );
        if ( typeof top === 'function' ) {
            callback = top;
            top      = 0;
        }
        if ( !$shadow.length ) {
            $shadow = $( '<div id="__shadow" style="opacity: 0.2; width: 100%;height: 100%;background-color: #000;position: fixed;top: 0;left: 0;" class="z-act-pop"></div>' );
            $shadow.appendTo( 'body' );
            $.send( F.EventCenter.PLAYER_HIDE );
        } else {
            $shadow.show();
            $.send( F.EventCenter.PLAYER_HIDE );
        }
        var docH = $( document ).height(), winH = $( window ).height(), h = Math.max( docH, winH );
        $shadow.height( h ).css( 'top', top ).off( F.EventCenter.CLICK ).on( F.EventCenter.CLICK, function( e ) {
            e.preventDefault();
            e.stopPropagation();
            callback && callback();
            $shadow.hide();
            $.send( F.EventCenter.PLAYER_SHOW );
            // 避免点击穿透到后面的元素
            return false;
        } );
        return $shadow;
    }

    F.shadow             = F.shadow || {
        show : __addShadow,
        hide : function() {
            $( '#__shadow' ).hide();
        }
    };
    // ------------------------------全屏loading------------------------------
    var showLoadingTimer = 0;

    function __showLoading( delay ) {
        clearTimeout( showLoadingTimer );
        var $loading = $( '#__loading' );
        if ( !$loading.length ) {
            var tpl  = [
                '<div id="__loading" class="spinner z-loading">',
                '<div class="rect1"></div>',
                '<div class="rect2"></div>',
                '<div class="rect3"></div>',
                '<div class="rect4"></div>',
                '<div class="rect5"></div>',
                '</div>'
            ].join( '' );
            $loading = $( tpl );
            $loading.appendTo( 'body' );
        }
        if ( delay ) {
            showLoadingTimer = setTimeout( function() {
                $loading.show();
            }, delay );
        } else {
            $loading.show();
        }
    }

    function __hideLoading() {
        clearTimeout( showLoadingTimer );
        $( '#__loading' ).hide();
    }

    F.loading = F.loading || {
        show : __showLoading,
        hide : __hideLoading
    };
    // ------------------------------加载进度------------------------------
    /**
     * 在页面顶部显示加载进度条
     * @param progress 目标进度(0-1)
     * @param duration 动画时长
     * @param callback 完成进度后，可选择执行的回调函数
     * @private
     */
    function __showProgress( progress, duration, callback ) {
        var $wrap = $( '#_progress_wrap' ), $progress = null;
        if ( !$wrap.length ) {
            var tpl = [
                '<div class="progress-wrap z-root" id="_progress_wrap">',
                '<div class="progress" id="_progress"></div>',
                '</div>'
            ].join( '' );
            $wrap   = $( tpl );
            $wrap.appendTo( 'body' );
        }
        $progress = $( '#_progress' );
        if ( progress ) {
            $wrap.show();
            $progress.animate( { width : progress * 100 + '%' }, duration, function() {
                if ( progress == 1 ) {
                    __reset();
                }
                callback && callback();
            } );
        } else {
            __reset();
            callback && callback();
        }
        function __reset() {
            $wrap.hide();
            $progress.width( 0 );
        }
    }

    F.progress = F.progress || __showProgress;
    // ------------------------------错误提示------------------------------
    function _showTip( msg, timeout ) {
        var $dom = null, timer = null;
        timeout  = timeout || 3000;
        if ( !msg ) { return; }
        function __init() {
            $dom = $( '<div></div>' );
            $dom.addClass( 'tip_error z-root' ).html( '<span>' + msg + '</span>' ).on( 'click', __close ).appendTo( 'body' );
            timer = setTimeout( __close, timeout );
        }

        function __close() {
            clearTimeout( timer );
            $dom.animate( { opacity : 0 }, 300 ).off( 'click' );
            timer = setTimeout( __remove, 500 );
        }

        function __remove() {
            clearTimeout( timer );
            $dom.remove();
        }

        __init();
    }

    F.showTip = F.showTip || _showTip;
})();
__inline( '/common/inlinejs/tplAjax.js' );
// ------------------------------tab相关------------------------------
(function() {
    // 保存页面的tab组件
    function __setTab( id, scroll ) {
        window[ '__tabs_scroll' ]   = window[ '__tabs_scroll' ] || {};
        var scrolls                 = window[ '__tabs_scroll' ];
        scrolls[ '__scroll_' + id ] = scroll;
    }

    function __getTab( id ) {
        var scrolls = window[ '__tabs_scroll' ] || {};
        return scrolls[ '__scroll_' + id ] || null;
    }

    function __getAll() {
        return window[ '__tabs_scroll' ] || {};
    }

    /**
     * data-tab-wrap tab元素，可以获取tab的总数量
     * data-tab-item 具体的tab
     * data-tab-switch data-tab-item对应的要显示的内容，值要与其一一对应
     * data-tab-scroll 如果tab需要滑动操作，需要在该容器上设置宽度
     */
    function initTabs() {
        var $tabs = $( '[data-tab-wrap]' ), cls = 'current';
        if ( !$tabs.length ) {return;}
        $.each( $tabs, function() {
            var $tabWrap = $( this ), type = $tabWrap.attr( 'data-tab-wrap' );
            if ( $tabWrap.attr( 'data-bind-scroll' ) == 1 ) { return; }
            // tab是否支持滑动切换
            switch ( type ) {
                case 'swipe':
                    var width  = 0, idx = 0, ele = null, $tab = null, $scroll = $tabWrap.find( '[data-tab-scroll]' ), id = $scroll.attr( 'data-tab-scroll' );
                    var $items = $( '[data-tab-item]', $tabWrap );
                    if ( !$items.length ) { return; }
                    $items.each( function( key, val ) {
                        $tab = $( this );
                        // fixme: iphone5宽度计算BUG，同事样式里面设置了nowrap
                        $tab.width( $tab.width() );
                        width += $tab.width();
                        if ( F.config.ctrlname == 'retrieve_' ) {
                            var $item = $tab.find( '[data-filter-code]' );
                            var code  = $item.data( 'filter-code' ), id = $item.data( 'filter-id' );
                            if ( F.url.getQueryValue( code ) == id ) {
                                idx = key;
                                ele = this;
                                $items.find( '[data-filter-code]' ).removeClass( cls );
                                $item.addClass( cls );
                            }
                        } else {
                            if ( $tab.hasClass( cls ) ) {
                                idx = key;
                                ele = this;
                            } else {
                                if ( $tab.find( '.' + cls ).length ) {
                                    idx = key;
                                    ele = this;
                                }
                            }
                        }
                    } );
                    $scroll.width( width );
                    var scroll = new IScroll( this, {
                        scrollX          : true,
                        scrollY          : false,
                        eventPassthrough : true,
                        preventDefault   : false
                    } );
                    F.tabs.set( id, scroll );
                    //部分页面要求支持定位至某一个tab-item
                    this.scrollInstance = scroll;
                    if ( idx > 0 ) {
                        scroll.scrollToElement( ele, null, true, true );
                    }
                    break;
                case 'switch':
                    // 点击切换
                    $tabWrap.on( F.EventCenter.CLICK, '[data-tab-item]', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var $tab = $( this ), cls = 'current', tab = $tab.attr( 'data-tab-item' );
                        $( '[data-tab-item]', $tabWrap ).removeClass( cls );
                        $tab.addClass( cls );
                        $( '[data-tab-switch]', $tabWrap ).hide();
                        $( '[data-tab-switch="' + tab + '"]', $tabWrap ).show().trigger( F.EventCenter.TAB_SHOW );
                        F.page.lazyLoadImage();
                    } );
                    break;
            }
            // 标识已经初始化为IScroll组件了
            $tabWrap.attr( 'data-bind-scroll', 1 );
        } );
    }

    F.tabs = F.tabs || {
        set  : __setTab,
        get  : __getTab,
        all  : __getAll,
        init : initTabs
    };
})();
// ------------------------------列表横向滑动------------------------------
(function() {
    function _swipe( wrap ) {
        wrap = $( wrap )[ 0 ];
        if ( !wrap || !wrap.children[ 0 ] ) { return; }
        var $items = $( '[data-list-item]', wrap ), w = 0;
        $items.each( function() {
            w += $( this ).width() + (parseInt( $( this ).css( 'margin-right' ) ) || 0);
        } ).parent().width( w );
        var scroll  = new IScroll( wrap, {
            scrollY          : false,
            scrollX          : true,
            eventPassthrough : true,
            preventDefault   : false
        } );
        var current = $( '.current', wrap )[ 0 ];
        if ( current ) {
            scroll.scrollToElement( current, 0, true, true );
        }
        _ladyLoad( wrap );
        scroll.on( 'scrollStart', function() {
            _ladyLoad( wrap, $( wrap ).width() );
        } );
        scroll.on( 'scrollEnd', function() {
            _ladyLoad( wrap );
        } );
        wrap.iScroll = scroll;
        return scroll;
    }

    function _ladyLoad( wrap, scrollX ) {
        scrollX       = scrollX || 0;
        var viewLeft  = $( wrap ).offset().left + scrollX - 200;
        var viewRight = viewLeft + $( wrap ).width() + 200;
        $( 'img', wrap ).each( function() {
            if( !$(this).attr('data-src') ) return;
            var offsetLeft = $( this ).offset().left;
            if ( offsetLeft < viewRight && offsetLeft + $( this ).width() > viewLeft ) {
                $( this ).lazyLoad();
            }
        } );
    }

    function _destroy( scroll ) {
        if ( !scroll ) { return; }
        scroll.destroy();
        $( scroll.scroller ).removeAttr( 'style' );
    }

    F.scroll = F.scroll || { swipe : _swipe, destroy : _destroy };
})();
F.ready( function() {
    // ------------------------------返回按钮------------------------------
    $( '[data-head-back]' ).on( F.EventCenter.CLICK, function() {
        if ( window.history && $.isFunction( history.back ) ) {
            history.back();
        }
    } );
    // ------------------------------加载更多------------------------------
    /**
     * data-card-item 资料卡元素
     * data-list-item 资料卡内容元素
     * data-btn-expand 展开/收起按钮
     * data-ajax-path 异步接口alias
     * data-ajax-count 获取数据数量
     */
    $( '[data-ajax-len]' ).each( function() {
        if ( $( this ).attr( 'data-ajax-len' ) > 3 ) {
            $( this ).removeClass( 'f-none' );
        }
    } );
    $( 'body' ).on( 'click', '[data-btn-expand="1"]', function( ev ) {
        var $this = $( this ), $card = $this.parent(), count = +$this.attr( 'data-ajax-count' ) || 10;
        if ( $this.attr( 'data-btn-expand' ) != 1 ) { return true; }
        var $next = $card.find( '[data-list-item].f-none' );
        $.each( $next, function( key, val ) {
            if ( key < count ) {
                $( this ).removeClass( 'f-none' );
            }
        } );
        F.page.lazyLoadImage( { preloadHeight : 100 } );
        if ( !$card.find( '[data-list-item].f-none' ).length && $this.attr( 'href' ) === 'javascript:;' ) {
            var url = $card.attr( 'data-more-url' );
            if ( url ) {
                $this.attr( 'href', url ).attr( 'data-btn-expand', 0 ).text( '更多' );
            } else {
                $this.hide();
            }
        }
        return false;
    } );
    F.tabs.init();
    // ------------------------------描述展开/收起------------------------------
    /**
     * data-plugin-item 插件元素
     * data-btn-expand 展开/收起按钮
     * data-info-full 完整的信息
     * data-info-part 剪切过的信息
     */
    $( '[data-plugin-item]' ).on( F.EventCenter.CLICK, '[data-btn-expand="plugin"]', function() {
        var $this = $( this ), $parent = $this.parent(), $full = $parent.find( '[data-info-full]' ), $part = $parent.find( '[data-info-part]' );
        if ( $parent.hasClass( 'ml' ) ) {
            $full.hide();
            $part.show();
            $parent.removeClass( 'ml' );
            $this.find( 'span' ).text( '展开' );
            $this.find( 'i' ).removeClass( 'i-up' ).addClass( 'i-down' );
        } else {
            $parent.addClass( 'ml' );
            $full.show();
            $part.hide();
            $this.find( 'span' ).text( '收起' );
            $this.find( 'i' ).removeClass( 'i-down' ).addClass( 'i-up' );
        }
    } );
    // ------------------------------头部按钮------------------------------
    /**
     * 头部按钮点击行为
     * data-h-toggle 按钮，对应的值为需要显示的元素
     * data-h-wrap 需要显示的元素，值为data-h-toggle对应的值
     * data-h-cls 为需要在按钮上添加的样式
     * data-h-offset 用于控制遮罩层的位置
     */
    // 头部按钮需要执行的逻辑
    var toggleFun = { history : historyHandler };
    (function( global, funs ) {
        var $mask = null, hide = 'f-none';
        $( '[data-h-toggle]' ).on( 'click', function() {
            var $btn      = $( this ),
                toggleCls = $btn.attr( 'data-h-toggle' ),
                $target   = $( '[data-h-wrap="' + toggleCls + '"]' ),
                cls       = $btn.attr( 'data-h-cls' ),
                fun       = $btn.attr( 'data-h-fun' ),
                $arw      = $( '.i-arr', $target ),
                $offset   = $( $btn.attr( 'data-h-offset' ) || '.g-hd' );
            if ( F.config.ctrlname == 'search_' && toggleCls == '__h_search' ) {
                return false;
            }
            if ( F.platform.isIpad ) {
                // 设置箭头位置，transform导致的计算问题
                var pos = ~~($btn.offset().left + $btn.width() / 2 - 4);
                $arw.css( 'left', pos );
            }
            if ( !$target.hasClass( hide ) ) {
                $target.addClass( hide );
                // 删除按钮上的样式
                __toggleCls( $btn, true );
                // 隐藏遮罩层
                $mask && $mask.hide();
                //提示显示播放器,解决无法盖住播放器的问题
                $.send( F.EventCenter.PLAYER_SHOW );
            } else {
                // 发送事件，用户隐藏其它浮层
                var data   = { layer_id : "" };
                //HIDEBAR_SHOW事件传入show的类型
                var cache  = [ "search", "history", "todo" ];
                var toggle = $btn.data( "h-toggle" );
                var find   = -1;
                for ( var i = 0; i < cache.length; i++ ) {
                    if ( toggle.indexOf( cache[ i ] ) != -1 ) {
                        find = i;
                        break;
                    }
                }
                if ( find > -1 ) {
                    data.layer_id = cache[ find ];
                }
                $.send( F.EventCenter.HEARBAR_SHOW, data );
                $target.removeClass( hide );
                // 在按钮上添加需要添加的样式
                __toggleCls( $btn, false );
                // 调用观看历史处理逻辑
                funs[ fun ] && funs[ fun ]();
                // 添加遮罩
                $mask = F.shadow.show( $offset.offset().top + $offset.height(), function() {
                    $target.addClass( hide );
                    cls && $btn.removeClass( cls );
                } );
                //提示隐藏播放器,解决无法盖住播放器的问题
                $.send( F.EventCenter.PLAYER_HIDE );
                $( 'img[data-ignore]', $target ).removeAttr( 'data-ignore' );
                F.page.lazyLoadImage();
            }
        } );
        // 隐藏浮层
        $.add( [ F.EventCenter.SIDEBAR_SHOW, F.EventCenter.HEARBAR_SHOW ].join( ' ' ), function() {
            $( '[data-h-wrap]' ).addClass( hide );
            F.shadow.hide();
        } );
        // 隐藏所有弹层
        $.add( F.EventCenter.HIDE_LAYER, function() {
            $( '[data-h-wrap]' ).addClass( hide );
            //提示显示播放器,解决无法盖住播放器的问题
            $.send( F.EventCenter.PLAYER_SHOW );
            F.shadow.hide();
        } );
        // 处理点击按钮需要添加或删除样式
        function __toggleCls( $btn, isHide ) {
            var cls = $btn.attr( 'data-h-cls' );
            if ( isHide ) {
                // 删除按钮上的样式
                cls && $btn.removeClass( cls );
            } else {
                // 清除按钮上的样式
                $( '[data-h-toggle]' ).each( function() {
                    var $this = $( this ), cls = $this.attr( 'data-h-cls' );
                    if ( cls && $this.hasClass( cls ) ) { $this.removeClass( cls ); }
                } );
                cls && $btn.addClass( cls );
            }
        }
    })( this, toggleFun );
    // ------------------------------观看历史------------------------------
    function historyHandler() {
        var $empty           = $( '#_noHistory' ), $history = $( '#_yesHistory' ), $wrap = $( '#_yesHisWrap' ), $clear = $( '#i_clear_btn' );
        var historyStoreName = 'h5v_history_watch_v2';
        var html             = '';
        if ( !$( '#i_h_wrap' ).length ) { return; }
        /* 观看历史数据 */
        var $data = F.htmlstore.get( historyStoreName );
        if ( !$data || !$data.length ) {
            $empty.show();
            $history.hide();
        } else {
            $.each( $data, function( index, item ) {
                var $time = F.util.formatTime( item.time ) || '00:00';
                if ( F.platform.isIpad && $( 'body' ).hasClass( 'ipad' ) ) {
                    if ( index == 0 ) {
                        html += '<div class="f-cb" data-swipe-slide="h">';
                    }
                    html += '<div class="list" data-list-item="1"><a href="' + item.url + '"><img src="' + item.pic + '">' + item.vtitle + '</a><b>看到' + $time + '</b></div>';
                    if ( index == $data.length - 1 ) {
                        html += '</div>';
                    }
                } else {
                    html += '<div class="list"><a href="' + item.url + '">' + item.vtitle + '</a><b>看到' + $time + '</b></div>';
                }
            } );
            $wrap.html( html );
            $history.show();
            $empty.hide();
            // iPad播放页播放历史滑动
            if ( F.platform.isIpad ) { F.scroll.swipe( $wrap ); }
        }
        /* 清除观看历史 */
        $clear.off( 'click' ).on( 'click', function() {
            $history.hide();
            $empty.show();
            F.htmlstore.remove( historyStoreName );
        } );
    }

    // ------------------------------登录按钮点击记录跳转url------------------------------
    $( '[data-btn-login]' ).on( 'click', function() {
        var url = $( this ).attr( 'href' ) || $( this ).attr( 'data-redirect-url' );
        var loc = window.location;
        if ( url ) {
            loc.href = '/account/login?location=' + loc.pathname;
            return false;
        } else {
            return true;
        }
    } );
} );
// ------------------------------异步后的上报------------------------------
(function() {
    function __ajaxReport( url, oldUrl ) {
        // cnzz 上报URL要使用相对地址
        var host = window.location.host, idx = url.indexOf( host ), reportUrl = '';
        if ( idx < 0 ) {
            reportUrl = url;
        } else {
            reportUrl = url.substring( idx + host.length );
        }
        _czc.push( [ "_trackPageview", reportUrl, oldUrl ] );
        // pv
        F.log.pv.send( { noCachePvid : true, referurl : oldUrl } );
        $.send( F.EventCenter.PAGE_REFRESH );
    }

    F.ajaxReport = F.ajaxReport || __ajaxReport;
})();
//app绑定
(function() {
    /**
     * 获取app跳转url
     * @return {String} app跳转地址
     */
    function __appDownloadUrl() {
        var url = '';
        if ( F.config.ctrlname != 'kplay_' ) {
            if ( F.platform.isWeChat ) {//微信
                url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.funshion.video.mobile';
            } else if ( F.platform.isIphone ) {
                url = 'https://itunes.apple.com/cn/app/feng-xing-shi-pin+-gao-qing/id1028313528?mt=8';
            } else if ( F.platform.isIpad ) {
                url = 'https://itunes.apple.com/cn/app/feng-xing-shi-pin+-hd-gao/id1033746864?mt=8';
            } else { //android
                var mallid = F.cookie.get( 'malliance' ) || 2;
                url        = 'http://neirong.funshion.com/android/' + mallid + '/FunshionAphone_SID_' + mallid + '_zipalign.apk';
            }
        } else {
            url = 'http://www.fun.tv/html/kuaikan/dl.html';
        }
        return url;
    }

    function __appOpenUrl( option ) {
        option          = option || {};
        var mallianceId = F.cookie.get( 'malliance' ) || 2;
        var mid         = option.mid || '';
        var vid         = option.vid || '';
        var type        = option.type;
        if ( F.platform.isAndroid ) {
            if ( type ) {
                return 'fsp://m.fun.tv/mplay/c-' + mallianceId + '.m-' + mid + (vid ? '.i-' + vid : '');
            } else if ( vid ) {
                return 'fsp://m.fun.tv/vplay/c-' + mallianceId + '.m-' + vid;
            } else {
                return 'fsp://m.fun.tv/';
            }
        } else if ( F.platform.isIos ) {
            if ( type ) {
                return 'funtv://?cid=' + mallianceId + '&mtype=mplay&mid=' + mid + (vid ? '&eid=' + vid : '');
            } else if ( vid ) {
                return 'funtv://?cid=' + mallianceId + '&mtype=vplay&mid=' + vid;
            } else {
                return 'funtv://';
            }
        } else {
            return '';
        }
    }

    /**
     * app绑定
     * @param item 要绑定的元素 jquery对象
     */
    function __bind( item ) {
        item = $( item );
        item.attr( {
            'href' : __appDownloadUrl(),
            //'target' : '_blank',
            'bc'   : 'installBtn'
        } );
        if ( F.platform.isIos || F.platform.isWeChat ) {
            item.attr( { 'target' : '_blank' } );
        }
        if ( F.cookie.get( 'app_install' ) ) {
            item.addClass( 'installed' );
        } else if ( item.hasClass( 'installed' ) ) {
            item.removeClass( 'installed' );
        }
    }

    function __appClick( e ) {

        var $target = $( e.currentTarget );
        var option  = {
            mid  : $target.data( 'app-mid' ),
            vid  : $target.data( 'app-vid' ),
            type : $target.data( 'app-type' )
        };
        var openUrl = __appOpenUrl( option );
        F.debug( '__appOpenUrl', openUrl );
        //无需打开app的，执行默认下载行为
        if ( !openUrl ) {
            return true;
        }

        var downUrl = __appDownloadUrl();
        var nowDate = +new Date;
        if ( F.platform.isAndroid || navigator.userAgent.match( /(iPhone\sOS)\s[1-8]_/i ) ) {
            var iframe           = document.createElement( 'iframe' );
            iframe.style.cssText = "width:1px;height:1px;position:fixed;top:0;left:0;";
            iframe.src           = openUrl;
            document.body.appendChild( iframe );
        } else { //ios9及以上
            window.location = openUrl;
        }

        F.cookie.set( 'app_install', 1, -1 );

        if( F.platform.isFunshionApp ) return false;

        setTimeout( function() {
            var date = +new Date;
            if ( 1550 > date - nowDate ) {
                if ( iframe ) {
                    iframe.parentNode.removeChild( iframe );
                }
                if ( F.platform.isIos && !window.document.webkitHidden ) {
                    window.location = downUrl;
                }
                F.cookie.del( 'app_install' );
            } else {
                //更新下载-->打开
                $( '.j-install-btn' ).addClass( 'installed' );
            }
        }, 1500 );
        if ( F.platform.isAndroid ) {
            location.href = downUrl;
        }
        return false;
    }

    //暂时屏蔽app拉活
    $( document ).on( 'click', '.j-install-btn', __appClick );
    F.namespace( 'app.download.bind', __bind );
})();

//下拉刷新
(function() {
    var defaultOptions = {
        root          : window,
        target        : '.j-pg-content',
        loading       : '.j-pg-loading',
        currentPage   : 1,
        totalPage     : 1,
        preLoadHeight : 100,
        requestParams : null,
        requestUrl    : '', //string or function
        beforeLoad    : null,
        afterLoad     : null,
        tpl           : ''
    };
    var dropDownLoad = function( options ) {
        this.options = $.extend( {}, defaultOptions, options );
        this.root    = $( this.options.root );
        this.target  = $( this.options.target );
        this.loading = $( this.options.loading );
        this.loading.css( 'opacity', 1 );
        this.loading.html( '<i class="loading"></i>加载中...' );
        this.isLoading     = false;
        this.lastScrollTop = $( window ).scrollTop();
        this.tpl           = $( this.options.tpl ).html() || '';
        if ( !this.root.length || !this.target.length ) {
            return;
        }
        if ( !this.isLastPage() ) {
            $( this.root ).off( 'scroll', $.proxy( this.loadNextPage, this ) ).on( 'scroll', $.proxy( this.loadNextPage, this ) );
        }
    };
    dropDownLoad.prototype.dispose = function() {
        this.loading.hide();
        $( this.root ).off( 'scroll', $.proxy( this.loadNextPage, this ) );
    };
    dropDownLoad.prototype.loadNextPage = function() {
        if ( $( this.root ).scrollTop() < this.lastScrollTop ) {
            return;
        }
        if ( this.isLoading || this.isLastPage() ) {
            return;
        }
        var outOffset = false;
        var $root     = this.root;
        if ( $root[ 0 ] == window ) {
            outOffset = $( document ).height() - ( $root.scrollTop() + $root.height()) > this.options.preLoadHeight;
        } else {
            outOffset = $root[ 0 ].scrollHeight - ($root.scrollTop() + $root.offset().height) > this.options.preLoadHeight;
        }
        if ( outOffset ) {
            return;
        }
        var self           = this;
        self.isLoading     = true;
        self.lastScrollTop = $( this.root ).scrollTop();
        if ( !this.options.beforeLoad || typeof this.options.beforeLoad !== 'function' || this.options.beforeLoad( this ) !== false ) {
            self.loading.show();
        }
        self.options.currentPage = this.options.currentPage + 1;
        var url   = self.options.requestUrl;
        var param = $.extend( {}, F.config.pParam, self.options.requestParams, { pg : self.options.currentPage } );
        if ( typeof self.options.requestUrl === 'function' ) {
            url = self.options.requestUrl();
        }
        F.request( url, param, function( data ) {
            if ( self.isLastPage() ) {
                $( this.root ).off( 'scroll', $.proxy( self.loadNextPage, self ) );
            }
            self.isLoading = false;
            if ( !self.options.afterLoad || typeof self.options.afterLoad !== 'function' || self.options.afterLoad( this ) !== false ) {
                self.target.append( F.tpl.render( self.tpl )( data ) );
                if ( self.isLastPage() ) {
                    self.loading.html( '抱歉，没有更多内容了' );
                    self.loading.animate( { opacity : 0 }, 3000, '', function() {
                        self.loading.hide();
                    } );
                } else {
                    self.loading.hide();
                }
            }
            F.page.lazyLoadImage();
        }, {
            timeout : 3000,
            error   : function() {
                self.options.currentPage -= 1;
                self.isLoading = false;
                self.loading.hide();
            }
        } );
    };
    dropDownLoad.prototype.isLastPage = function() {
        return Math.ceil( this.options.totalPage ) <= this.options.currentPage;
    };
    F.dropDownLoad = dropDownLoad;
})();
//解决ios下嵌入M站页面宽度异常问题
$( function() {
    if ( !F.platform.isIos || window == top ) {
        return;
    }
    adjustWidth();
    $( window ).on( 'resize', adjustWidth );
    function adjustWidth() {
        $( 'body' ).width( Math.max( $( window ).width(), 300 ) );
    }
} );
//alpha提示
$( function() {
    //var alphaSetting = F.cookie.get('BRANCH');
    if ( location.host == 'm1.fun.tv' ) {
        $( 'body' ).append( '<div style="position:fixed; bottom:60px; left:0; padding:0 5px; font-size:16px; line-height:40px; background:red; color:#fff">alpha环境</div>' );
    }
} );
__inline( '/common/inlinejs/historyBack.js' );
(function() {
    var timer    = 0;
    F.pageScroll = function( scrollTop ) {
        var method    = function( t, b, c, d ) {
            return c * (t /= d) * t * t + b;
        };
        var start     = window.pageYOffset;
        var t         = 0, c = Math.max( 0, scrollTop ) - start, d = 10;
        var scrollFun = function() {
            window.scrollTo( window.pageXOffset, method( t, start, c, d ) );
            t++;
            if ( t > d ) {
                clearInterval( timer );
            }
        }
        clearInterval( timer );
        timer = setInterval( scrollFun, 10 );
    };
})();
//WebSocket支持率测试
$( function() {
    window._czc && window._czc.push( [ '_trackEvent', 'websocket', $.type( window.WebSocket ) ] );
} );