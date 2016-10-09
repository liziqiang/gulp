/**
 * 风行JS库
 * Created by zhaoning on 2015/1/4.
 */
window.F = window.F || {};
//配置相关
F.config           = F.config || {};
// api接口使用域名 动态
F.config.api       = 'http://api.fun.tv';
// q接口使用域名 静态
F.config.q         = 'http://q1.fun.tv';
// 波塞冬域名
F.config.po        = 'http://po.funshion.com';
F.config.pm        = 'http://pm.funshion.com'; //媒体信息
F.config.pv        = 'http://pv.funshion.com'; //视频信息
F.config.ps        = 'http://ps.funshion.com'; //搜索
F.config.pu        = 'http://puser.funshion.com'; //用户
F.config.psi       = 'http://psi.funshion.com'; //视频号
F.config.pam       = 'http://pam.funshion.com'; //搜索聚合
F.config.pvip      = 'http://pvip.funshion.com'; //vip
F.config.pub       = 'http://aw02.pub.funshion.com'; //播放器外广告
F.config.pubPlayer = 'http://am01.pub.funshion.com'; //播放器内广告
(function() {
    F.EventCenter                     = F.EventCenter || {};
    // 触屏设备使用touchstart事件，PC使用click
    F.EventCenter.CLICK               = ('ontouchstart' in window ? 'touchstart' : 'click');
    F.EventCenter.RENDER_COMPLETE     = 'render_complete';
    //前贴片广告事件
    F.EventCenter.PRE_AD_PLAY         = 'preroll_ad_play';
    F.EventCenter.PRE_AD_START        = 'preroll_ad_start';
    F.EventCenter.PRE_AD_PAUSE        = 'pre_ad_pause';
    F.EventCenter.PRE_AD_ERROR        = 'preroll_ad_error';
    F.EventCenter.PRE_AD_END          = 'preroll_ad_end';
    F.EventCenter.PRE_AD_SCREENCHANGE = 'preroll_ad_screen';
    //头部导航展开事件
    F.EventCenter.HEARBAR_SHOW        = 'headbar_show';    //头部展现层
    //左侧导航展开事件
    F.EventCenter.SIDEBAR_SHOW = 'sidebar_show';    //导航开始展开
    F.EventCenter.SIDEBAR_HIDE = 'sidebar_hide';    //导航开始收起
    //隐藏所有弹层（包括头部展现层，左侧导航等）
    F.EventCenter.HIDE_LAYER = 'hide_layer';
    //tab展示事件
    F.EventCenter.TAB_SHOW   = 'tab_show';
    //解决播放器遮挡问题
    //显示播放器
    F.EventCenter.PLAYER_SHOW          = 'player_show';
    //隐藏播放器
    F.EventCenter.PLAYER_HIDE          = 'player_hide';
    //播放器信息加载完成
    F.EventCenter.PLAYER_INFO_UPDATE   = 'player_info_update';
    //播放器视频ready
    F.EventCenter.PLAYER_READY         = 'player_ready';
    //播放器视频暂停
    F.EventCenter.PLAYER_PAUSE         = 'player_pause';
    //播放器视频播放
    F.EventCenter.PLAYER_PLAY          = 'player_play';
    //播放器视频播放完毕
    F.EventCenter.PLAYER_END           = 'player_end';
    //播放器连播
    F.EventCenter.PLAYER_NEXT          = 'player_next_media';
    //播放器试看
    F.EventCenter.PLAYER_TRY           = 'player_try';
    //播放器全屏
    F.EventCenter.PLAYER_SCREEN_FULL   = 'player_screen_full';
    //播放器退出全屏
    F.EventCenter.PLAYER_SCREEN_NORMAL = 'player_screen_normal';
    //播放页刷新页面(异步刷新)
    F.EventCenter.VPLAY_REFRESH        = 'vplay_refresh';
    //页面异步刷新
    F.EventCenter.PAGE_REFRESH         = 'page_refresh';
    // 焦点图广告加载完成
    F.EventCenter.FOCUS_AD_LOADED      = 'focus_ad_loaded';
    // APP拦截层消失
    F.EventCenter.APP_INTERCEPT_HIDE   = 'app_intercept_hide';
    // 用户登录态变化
    F.EventCenter.LOGIN_STATE_CHANGE   = 'login_state_change';
})();
// 平台检测
(function() {
    var userAgent = navigator.userAgent || '';
    /**
     * 判断平台类型和特性的属性
     */
    F.platform = F.platform || {};
    //判断是否为android平台
    F.platform.isAndroid     = /android/i.test( userAgent );
    //判断是否为Winphone平台
    F.platform.isWinphone    = /windows phone/i.test( userAgent );
    //判断是否为ipad平台
    F.platform.isIpad        = /(iPad).*OS\s([\d_]+)/i.test( userAgent );
    //判断是否为iphone平台
    F.platform.isIphone      = /(iPhone\sOS)\s([\d_]+)/i.test( userAgent );
    //判断是否为IOS平台
    F.platform.isIos         = F.platform.isIpad || F.platform.isIphone;
    //判断是否为macintosh平台
    F.platform.isMacintosh   = /macintosh/i.test( userAgent );
    //判断是否为windows平台
    F.platform.isWindows     = /windows/i.test( userAgent ) || navigator.platform == 'Win32' || navigator.platform == 'Windows';
    //判断是否为x11平台
    F.platform.isX11         = /x11/i.test( userAgent );
    //判断是否是微信
    F.platform.isWeChat      = /micromessenger/i.test( userAgent );
    //判断是否是UC浏览器
    F.platform.isUc          = /ucbrowser/i.test( userAgent );
    //判断是否是微博APP
    F.platform.isSinaWeibo   = /__weibo__/i.test( userAgent );
    //判断是否是QQ APP
    F.platform.isQQ          = /qq\//i.test( userAgent );
    //判断是否是QQ 浏览器
    F.platform.isQQBrowser   = /mqqbrowser/i.test( userAgent );
    //判断是否在风行APP内
    F.platform.isFunshionApp = /funshionplayer/i.test( userAgent );
})();
// 可能会用到的一些工具类
(function() {
    F.util            = F.util || {};
    F.util.formatTime = function( time ) {
        if ( !time ) { return false; }
        time    = parseInt( time );
        var MIN = 60, HOUR = MIN * 60;
        var str = '';
        var hrs = Math.floor( time / HOUR );
        if ( hrs > 0 ) {
            str += (hrs < 10 ? '0' + hrs : hrs) + ':';
        }
        var min = Math.floor( (time % HOUR) / MIN );
        str += (min < 10 ? '0' + min : min) + ':';
        var sec = Math.floor( time % MIN );
        str += (sec < 10 ? '0' + sec : sec);
        return str;
    };
    // 对AJAX进行封装，便于调用
    function __request( url, data, callback, options ) {
        // 简略写法支持
        if ( typeof data === 'function' ) {
            // 支持__request(url, callback, options)写法
            if ( typeof callback !== 'undefined' ) {
                options = callback;
            }
            // 支持__request(url, callback)写法
            callback = data;
            data     = {};
        }
        //追加isajax，使服务器能够识别该请求来源于ajax
        if ( url.match( /(api|api1|q|q1)\.fun/ ) ) {
            url += (url.match( /\?/ ) ? '&' : '?') + 'isajax=1';
        }
        var isApiRequest = false;
        //避免api的缓存
        if ( url.match( /api\.funshion\.com/i ) || url.match( /api\.fun\.tv/i ) || url.match( /api1\.fun\.tv/i ) ) {
            isApiRequest = true;
            url += (url.match( /\?/ ) ? '&' : '?') + 'dtime=' + (new Date()).getTime();
        }
        // 默认参数
        var ajaxSettings = {
            url         : url,
            type        : 'GET',
            data        : data,
            dataType    : 'json',
            crossDomain : true,
            timeout     : 6000,
            // Transport
            xhr         : function() {
                var xmlRequest = new window.XMLHttpRequest();
                try {
                    if ( isApiRequest ) {
                        xmlRequest.withCredentials = true;
                    }
                } catch ( e ) {}
                return xmlRequest;
            },
            success     : function( json ) {
                //if ( !json ) { return; }
                callback && callback( json );
            },
            error       : function( xhr, status ) {
                window._czc && window._czc.push( [ '_trackEvent', 'mHttpError', status, url ] );
            }
        };
        // 扩展默认参数
        if ( options ) {
            var extraParam = [ 'showProgress', 'noAjax', 'showTip' ];
            // 显示进度条
            if ( options.showProgress ) {
                options.beforeSend = function() {
                    F.progress( 0.5, 500 );
                };
                options.success    = function( json ) {
                    if ( !json ) { return; }
                    F.progress( 1, 300, function() {
                        callback && callback( json );
                    } );
                };
            }
            // 显示错误提示
            if ( options.showTip ) {
                var errorCallback = options.error;
                options.error     = function( xhr, status ) {
                    errorCallback && errorCallback.apply( this, arguments );
                    __handlerError.apply( this, arguments );
                };
            }
            $.each( extraParam, function( k, v ) {
                delete options[ v ];
            } );
            ajaxSettings = $.extend( ajaxSettings, options );
        }
        // 默认的错误处理函数
        function __handlerError( xhr, status ) {
            var tip = '';
            switch ( status ) {
                case 'timeout':
                    tip = '请求超时，请稍后再试！';
                    break;
                default :
                    tip = '请求失败，请重试！';
                    break;
            }
            F.progress( 0 );
            tip && F.showTip( tip );
        }

        return $.ajax( ajaxSettings );
    }

    F.util.request = F.request = F.request || __request;
    // 操作url的方法
    F.util.url = F.url = F.url || {};
    /**
     * 根据参数名从目标URL中获取参数值
     * @name getQueryValue
     * @function
     * @grammar getQueryValue(key, url)
     * @param {string} key 要获取的参数名
     * @param {string} url 目标URL
     * @meta standard
     * @see jsonToQuery
     *
     * @returns {string|null} - 获取的参数值，其中URI编码后的字符不会被解码，获取不到时返回null
     */
    F.url.getQueryValue = function( key, url ) {
        var reg   = new RegExp( '(^|&|\\?|#)' + escapeReg( key ) + '=([^&#]*)', 'g' );
        var match = (url || window.location.href).match( reg );
        if ( match ) {
            return match[ match.length - 1 ].split( '=' )[ 1 ];
        }
        return null;
    };
    /**
     * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
     * @name escapeReg
     * @function
     * @grammar escapeReg(source)
     * @param {string} source 目标字符串
     * @remark
     * 给以下字符前加上“\”进行转义：.*+?^=!:${}()|[]/\
     * @meta standard
     *
     * @returns {string} 转义后的字符串
     */
    function escapeReg( source ) {
        return String( source ).replace( new RegExp( '([.*+?^=!:\x24{}()|[\\]\/\\\\])', 'g' ), '\\\x241' );
    }

    F.util.addSheet = F.util.addSheet || function( css ) {
        // 当为 IE 浏览器的时候
        // 将 opacity 样式全部替换为 filter:alpha(opacity) 方式设置半透明
        if ( !-[ 1, ] ) {
            css = css.replace( /opacity:\s*(\d?\.\d+)/g, function( $, $1 ) {
                $1 = parseFloat( $1 ) * 100;
                if ( $1 < 0 || $1 > 100 ) {
                    return '';
                }
                return 'filter:alpha(opacity=' + $1 + ');'
            } );
        }
        css += '\n';//增加末尾的换行符，方便在firebug下的查看。
        var doc = document, head = doc.getElementsByTagName( 'head' )[ 0 ],
            styles               = head.getElementsByTagName( 'style' ), style, media;
        if ( styles.length === 0 ) {//如果不存在style元素则创建
            if ( doc.createStyleSheet ) {    //ie
                doc.createStyleSheet();
            } else {
                style = doc.createElement( 'style' );//w3c
                style.setAttribute( 'type', 'text/css' );
                head.insertBefore( style, null )
            }
        }
        // getElementsByTagName 的返回类型为 NodeList ,
        // 在从 NodeList 中读取对象时,
        // 都会重新搜索一次满足条件的对象
        style = styles[ 0 ];
        /*
         style标签media属性常见的四种值
         screen	计算机屏幕（默认值）。
         handheld	手持设备（小屏幕、有限的带宽）。
         print	打印预览模式 / 打印页。
         all	适合所有设备。
         */
        media = style.getAttribute( 'media' );
        // 当 media 不为 screen 且为空
        if ( media === null && !/screen/i.test( media ) ) {
            style.setAttribute( 'media', 'all' );
        }
        if ( style.styleSheet ) {    //ie
            style.styleSheet.cssText += css;//添加新的内部样式
        } else if ( doc.getBoxObjectFor ) {
            style.innerHTML += css;//火狐支持直接innerHTML添加样式表字串
        } else {
            style.appendChild( doc.createTextNode( css ) )
        }
    };
})();
//命名空间 F.namespace
(function() {
    /**
     * 定义对象所在的命名空间
     * @param str:命名空间字符串
     * @param obj:对象名
     * @param func:对象构造函数或者对象
     *
     * @example
     *
     * F.namespace('path','instance', function(){});
     *
     */
    F.namespace = function( str, obj, func ) {
        var arr = str.split( '.' );
        var val = func;
        if ( typeof obj == 'string' ) {
            if ( !obj ) {
                obj = arr.pop();
            }
        } else {
            //第二个参数不是字符串时，就认为是val
            val = obj;
            obj = arr.pop();
        }
        var k    = '';
        var root = F;
        while ( arr.length > 0 ) {
            k = arr.shift();
            if ( k != '' ) {
                if ( typeof root[ k ] == 'undefined' ) {
                    root[ k ] = {};
                }
                if ( typeof root[ k ] != 'object' ) {
                    throw new Error( '***当前命名空间' + k + '已经被其它类型占用***' );
                }
                root = root[ k ];
            }
        }
        /*if( obj && typeof func == 'function'){
         root[obj] = func;
         }*/
        if ( typeof obj == 'string' ) {
            if ( typeof val != 'undefined' ) {
                root[ obj ] = val;
            }
        }
    };
    /**
     * 判断str是否为F下在命名空间串
     * @param str
     * @returns {boolean}
     */
    F.isNamespace = function( str ) {
        var arr  = str.split( '.' );
        var k    = '';
        var root = F;
        while ( arr.length > 0 ) {
            k = arr.shift();
            if ( k != '' ) {
                if ( typeof root[ k ] != 'undefined' ) {
                    root = root[ k ];
                } else {
                    return false;
                }
            }
        }
        return true;
    };
})();
//cookie
(function() {
    F.cookie = {
        /**
         * 获取Cookie值
         * @name F.tool.cookie.get
         * @function
         * @grammar F.tool.cookie.get(name)
         * @param {String} name Cookie名
         * @shortcut F.cookie.get
         * @see F.tool.cookie.set,F.tool.cookie.del,F.cookie.set,F.cookie.del
         * @remark
         *
         返回对应值前, 会对字符串进行解码

         * @return {String} Cookie值
         */
        get : function( name ) {
            // eg: 'name1=value1; name2=value2; name3=value3; name4=value4'
            var c = document.cookie;
            if ( !c.length ) {
                return '';
            }
            var tp = c.split( '; ' );
            for ( var i = tp.length - 1; i >= 0; i-- ) {
                var tm = tp[ i ].split( '=' );
                if ( tm.length > 1 && tm[ 0 ] == name && tm[ 1 ] ) {
                    return unescape( $.trim( tm[ 1 ] ) );
                }
            }
            return '';
        },
        /**
         * 设置Cookie值
         * @name F.tool.cookie.set
         * @function
         * @grammar F.tool.cookie.set(name, value[, day, domain])
         * @param {String} name Cookie名
         * @param {String} value Cookie值
         * @param {String} day 有效天数, 默认 365天，-1则设置为会话cookie
         * @param {String} domain Cookie保存的域, 默认为 .funshion.com
         * @param {String} usehost 使用host设置cokie
         * @shortcut F.cookie.set
         * @see F.tool.cookie.get,F.tool.cookie.del,F.cookie.get,F.cookie.del
         * @remark
         *
         会对Cookie值进行字符串编码后存储

         */
        set : function( name, value, day, domain, usehost ) {
            day = day || 365, domain = domain || '.fun.tv', usehost = usehost || 0;
            var expires = new Date();
            expires.setTime( (new Date()).getTime() + 3600 * 24 * 1000 * day );
            document.cookie = name + '=' + escape( value ) + '; path=/; ' + (usehost ? 'host' : 'domain') + '=' + domain + (day == -1 ? '' : ';expires=' + expires.toGMTString());
        },
        /**
         * 获取Cookie值
         * @name F.tool.cookie.del
         * @function
         * @grammar F.tool.cookie.del(name)
         * @param {String} name Cookie名
         * @shortcut F.cookie.del
         * @see F.tool.cookie.get,F.tool.cookie.set,F.cookie.get,F.cookie.set
         */
        del : function( name ) {
            this.set( name, '', -365, null, 0 );
            this.set( name, '', -365, document.location.host, 1 );
        }
    };
})();
// DEBUG
(function() {
    var debugCounter = 1;
    var debugInfo    = [];
    var isDebug      = F.url.getQueryValue( 'debug' );
    F.debug          = function( msg ) {
        if ( !isDebug ) {
            return;
        }
        var args = [].slice.call( arguments );
        args.unshift( 'Time[' + new Date().getTime() + ']:' );
        args.unshift( '[' + debugCounter + ']' );
        if ( window.console && console.log ) {
            console.log.apply( console, args );
        }
        debugInfo.push( args );
        debugCounter++;
    };
    //weinre debug
    if ( isDebug ) {
        $( function() {
            var dom  = document.createElement( "script" ),
                host = F.url.getQueryValue( 'host' );
            if ( !host ) { return; }
            dom.setAttribute( "src", "http://" + host + ":8080/target/target-script-min.js#anonymous" );
            document.getElementsByTagName( "body" )[ 0 ].appendChild( dom );
        } );
    }
})();
(function() {
    var callbacks = [], isExecuted = false;
    F.ready       = function( callback ) {
        if ( isExecuted ) {
            callback();
            return;
        }
        callbacks.push( callback );
    };
    F.execute     = function() {
        $.each( callbacks, function( i, callback ) { callback(); } );
        isExecuted = true;
    };
    $( function() {
        if ( !F.tplAjax ) { //若不存在异步渲染页面，直接执行F.execute
            F.execute();
        }
    } );
})();