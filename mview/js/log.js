/**
 * log.js
 */
/**
 * 页面数据上报
 * Updated by zhaoning on 2014/10/27.
 */
window.F = window.F || {};
window.F.tool = window.F.tool || {};
(function() {
    var key          = '_pvlog', lt = 0, keyVals = [ 'type', 'param', 'root', 'split' ];
    var getLog       = function() {
        //将获取的cookie数解析成json对象
        var val  = '' + F.cookie.get( key );
        var data = !val ? '' : JSON.parse( val ), ret = [];
        //如果没有C或者C不是一个数组 就返回一个空数组
        if ( !data || !$.isArray( data ) ) { return []; }
        var item, val;
        for ( var i = 0, len = data.length; i < len; i++ ) {
            item = {};
            for ( var k = keyVals.length - 1; k >= 0; k-- ) {
                val                  = data[ i ][ k ];
                item[ keyVals[ k ] ] = val == undefined ? '' : val;
            }
            ret.push( item );
        }
        return ret;
    };
    var setLog       = function( option ) {
        //声明变量C 赋值函数getLog()返回值
        var data = getLog(), ret = [];
        data.push( option );
        var item, val;
        for ( var i = 0, len = data.length; i < len; i++ ) {
            item = [];
            for ( var k = keyVals.length - 1; k >= 0; k-- ) {
                val       = data[ i ][ keyVals[ k ] ];
                item[ k ] = val == undefined ? '' : val;
            }
            ret.push( item );
        }
        //设置cookie值 有效期为1天
        F.cookie.set( key, JSON.stringify( ret ), 1 );
    };
    var sendHandle   = function( option ) {
        option        = $.extend( {
            param  : {},
            root   : 'website',
            domain : 'http://stat.funshion.net/',
            split  : '*_*'
        }, option || {} );
        option.root   = option.root || 'website';
        var param     = option.param || {},
            paramStrs = [],
            path      = option.path || (option.domain + option.root + '/' + option.type + "?");
        var val;
        for ( var key in param ) {
            if ( typeof param[ key ] == 'function' ) { continue; }
            val = param[ key ] == undefined ? '' : param[ key ];
            paramStrs.push( key + "=" + val );
        }
        F.tool.pv.dispatch( path + paramStrs.join( option.split ) );
        return false;
    };
    F.tool.pv        = {
        send     : function( type, param, root ) {
            var arg = arguments, option;
            if ( $.isString( type ) ) {
                option = { type : arg[ 0 ], param : arg[ 1 ], root : arg[ 2 ] };
            } else {
                option = type || {};
            }
            sendHandle( option );
        },
        dispatch : function( url ) {
            if ( !url ) { return; }
            setTimeout( function() {
                //创建一个dom节点
                $( '<img />' ).on( 'load', function() {} ).attr( 'src', url );
            }, 200 );
        }
    };
    F.tool.pvManager = {
        /*
         * add,send为对象方法
         * add添加一个委托
         * */
        add  : function( type, param, root ) {
            var arg      = arguments, option;
            option       = $.isString( type ) ? { type : arg[ 0 ], param : arg[ 1 ], root : arg[ 2 ] } : type || {};
            option.param = option.param || {};
            // 500毫秒连续添加将会被抛弃 ps: fl不太理解这, 是防止cookie大量写入?
            var t        = +new Date;
            if ( t - this.lt < 500 ) { return this; }
            lt = t;
            // 如果是被嵌套的时候, 无法写cookie直接发送上报
            if ( window != top ) {
                F.tool.pv.send( option );
            } else {
                setLog( option );
            }
            return this;
        },
        send : function() {
            var datas = getLog(), item;
            if ( !datas.length ) { return this; }
            for ( var i = 0, len = datas.length; i < len; i++ ) {
                item = datas[ i ];
                if ( item.length < 2 ) { continue; }
                F.tool.pv.send( item );
            }
            //设置cookie为回话cookie
            F.cookie.set( key, '', -365 );
            return this;
        }
    };
})();
(function() {
    // var protocolSplit = '*_*';
    //各类型上报字段
    var repKey = {
        pv     : {
            rprotocol  : '4',
            firstname  : 'website',
            secondname : 'pv',
            protocol   : [
                "rprotocol",		// 日志请求协议版本号，由前端发送，表明前端发送的版本号
                "clientFlag",		//网站or内嵌
                "fck",				// 由js代码加入cookie的唯一标识，用以标识唯一用户
                "mac",				// mac地址，安装风行客户端的机器来获取
                "userid",			// 登录用户注册id，如果未登录为0
                "fpc",				// 策略、运营商和地域用户的地址，策略，isp信息
                "version",			// 风行版本号
                "sid",				// 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
                "pvid",				// 页面ID，每次刷新页面生成一个新值（UUID算法）
                "config",			// 页面唯一标示，页面分类
                "url",				// 当前url地址
                "referurl",			// 前链url
                "channelid",		// 合作渠道id
                "vtime",			// 页面请求耗时
                "ext",				// 扩展字段pagetype=?&（key=value）
                "step",              // 格式：用户史来pv计数器，各自维护
                "sestep",            // 格式：本次session的pv计数器，各自维护
                "seidcount",         // 用户史来session计数器，各自维护
                "ta",				 //	用户策略分类
                "mediatype"		     //	channel_id|subchannel_id|playlist_id|production_id|album_id
            ]
        },
        play   : {
            rprotocol  : '2',
            firstname  : 'website',
            secondname : 'play',
            protocol   : [
                "rprotocol",		// 日志请求协议版本号，由前端发送，表明前端发送的版本号
                "clientFlag",		//网站or内嵌
                "fck",				// 由js代码加入cookie的唯一标识，用以标识唯一用户
                "mac",				// mac地址，安装风行客户端的机器来获取
                "userid",			// 登录用户注册id，如果未登录为0
                "fpc",				// 策略、运营商和地域用户的地址，策略，isp信息
                "version",			// 风行版本号
                "sid",				// 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
                "pvid",				// 页面ID，每次刷新页面生成一个新值（UUID算法）
                "config",			// 页面唯一标示，页面分类
                "url",				// 当前url地址
                "referurl",			// 前链url
                "channelid",		// 合作渠道id
                "mediatype",		//	channel_id|subchannel_id|playlist_id|production_id|album_id
                "target",		    //	videoid
                "hashid",		    //	hashid（ 和点击相关的target请求页面）
                "vvid",		        //	本次播放id，每次播放时生成一个新值(包括重播)
                "lian",		        //	连播上报：连播类型_联播次数 （连播类型："0"不连播"1"连播）
                "platform",         // 站内外播放标识（0站内 1 站外其他 2腾讯微博 3 新浪微博 4开心网 5百度贴吧  6QQ空间 ）
                "videolength",      // 节目时长(单位：秒)
                "format",           //当前播放码流|支持最高播放码流
                "ext",				// 可扩展字段（新版1；旧版0）
                "playstep",         // 用户史来play计数器，各自维护
                "playsestep",       // 本次session的play计数器，各自维护
                "seidcount",        // 用户史来session计数器，各自维护
                "playerversion",	//	用户策略分类
                "avtype",           //影片类型：1-免费片，2-普通付费片，3-套餐免费片，4-会员免费片、5-会员折扣片
                "vodtype",          //点播类型：1-未购买试看、2-已过期试看、3-普通点播
                "viptype"           //会员用户可在PC端全站免费观看付费片及免费片,是否是会员
            ]
        },
        pt     : {
            rprotocol  : '1',
            firstname  : 'website',
            secondname : 'pt',
            protocol   : [
                "rprotocol",		//日志请求协议版本号，由前端发送，表明前端发送的版本号
                "clientFlag",		//网站or内嵌
                "fck",				//由js代码加入cookie的唯一标识，用以标识唯一用户
                "mediatype",		//	channel_id|subchannel_id|playlist_id|production_id|album_id
                "target",		    //	videoid
                "hashid",		    //	hashid（ 和点击相关的target请求页面）
                "vvid",		        //	本次播放id，每次播放时生成一个新值(包括重播)
                "sendstep",         // 发送次数（初始值为0，长视频每5分钟发送一次增加1；短视频每60秒发送一次增加1）如果暂停则不报
                "timespan",         // 上报时机：长视频每隔5分钟；短视频每隔60秒
                "avtype",           //影片类型：1-免费片，2-普通付费片，3-套餐免费片，4-会员免费片、5-会员折扣片
                "vodtype"          //点播类型：1-未购买试看、2-已过期试看、3-普通点播
            ]
        },
        click  : {
            rprotocol  : '4',
            timeout    : 3000,
            firstname  : 'website',
            secondname : 'pgclick',
            protocol   : [
                "rprotocol",         // 前端发送，日志请求协议版本号，表明前端发送的版本号，初始为1
                "clientFlag",		//网站or内嵌
                "fck",               // 由js代码加入cookie的唯一标识，用以标识唯一用户
                "mac",               // mac地址，安装风行客户端的机器来获取
                "userid",            // 登录用户注册id，如果未登录为0
                "fpc",               // 策略、运营商和地域用户的地址，策略，isp信息
                "version",           // 风行版本号
                "sid",               // 当前会话ID，由js生成，算法跟fck类似，一次会话且生命周期定义为30分钟
                "pvid",              // 页面ID，同一页面时与PV上报中相同。每次刷新页面生成一个新值（UUID算法）
                "config",            // 页面唯一标示，页面分类
                "url",               // 当前url地址
                "referurl",          // 前链url
                "channelid",         // 合作渠道id
                "block",             // 标识点击的页面位置，前端规律编码。
                "screenw",           // 屏幕宽。
                "screenh",           // 屏幕高。
                "browserw",          // 浏览器宽。
                "browserh",          // 浏览器高。
                "browserpx",         // 点击距离浏览器中间线内容区域的横向坐标，左侧为负
                "browserpy",         // 点击距离浏览器顶端区域的纵向坐标
                "pagepx",            // 点击距离页面中间线内容区域的横向坐标，左侧为负
                "pagepy",            // 点击距离页面顶端区域的纵向坐标
                "ext",               // 扩展字段，turnurl=?&（key=value）（turnurl表示点击链接url）
                "mediatype"		     //	channel_id|subchannel_id|playlist_id|production_id|album_id
            ]
        },
        event  : {
            rprotocol  : '1',
            firstname  : 'website',
            secondname : 'eventpv',
            protocol   : [
                "rprotocol",         // 日志请求协议版本号，由前端发送，表明前端发送的版本号
                "fck",               // 由js代码加入cookie的唯一标识，用以标识唯一用户
                "mac",               // mac地址，安装风行客户端的机器来获取
                "userid",            // 登录用户注册id，如果未登录为0
                "fpc",               // 策略、运营商和地域用户的地址，策略，isp信息
                "version",           // 风行版本号
                "sid",               // 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
                "pvid",              // 页面ID，每次刷新页面生成一个新值（UUID算法）
                "config",            // 页面唯一标示，页面分类
                "url",               // 当前url地址
                "referurl",          // 前链url
                "channelid",         // 合作渠道id
                "vtime",             // 页面请求耗时
                "event",			// 标示事件类型
                "ext"               // 扩展字段（{ext:[key=value]}）
            ]
        },
        guess  : {
            rprotocol  : '1',
            firstname  : 'website',
            timeout    : 3000,
            secondname : 'guessevent',
            protocol   : [
                "rprotocol", 		// 日志请求协议版本号，由前端发送，表明前端发送的版本号
                "clientFlag",		// 网站or内嵌
                "fck",              // 由js代码加入cookie的唯一标识，用以标识唯一用户
                "mac",              // mac地址，安装风行客户端的机器来获取
                "userid",           // 登录用户注册id，如果未登录为0
                "fpc",              // 策略、运营商和地域用户的地址，策略，isp信息
                "version",          // 风行版本号
                "sid",              // 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
                "url",              // 当前url地址
                "referurl",         // 前链url
                "pt",				// 位置标示当前那个页面
                "mid",              // 点击的mediaId
                "mids",            	// 媒体id集合
                "et",				// 标示事件类型
                "stp",				// 推荐的策略标示
                "ext"               // 扩展字段（{ext:[key=value]}）
            ]
        },
        action : {
            rprotocol  : '1',
            firstname  : 'website',
            secondname : 'action',
            protocol   : [
                "rprotocol", 		// 日志请求协议版本号，由前端发送，表明前端发送的版本号
                "clientFlag",		// 网站or内嵌
                "fck",              // 由js代码加入cookie的唯一标识，用以标识唯一用户
                "mac",              // mac地址，安装风行客户端的机器来获取
                "userid",           // 登录用户注册id，如果未登录为0
                "fpc",              // 策略、运营商和地域用户的地址，策略，isp信息
                "version",          // 风行版本号
                "sid",              // 当前会话ID，由js生成，算法跟fck类似，生命周期定义为30分钟
                "pvid",             // 页面ID，每次刷新页面生成一个新值（UUID算法）
                "config",            // 页面唯一标示，页面分类
                "url",              // 当前url地址
                "referurl",         // 前链url
                "channelid",        // 合作渠道id
                "mediatype",        // channel_id|playlist_id|production_id
                "action",           // feed（订阅）、collect（收藏）、up（顶）、down(踩）
                "flag",             // 0：取消, 1：是, -1:未登录
                "ext"               // 扩展字段（{ext:[key=value]}）
            ]
        },
        relate : {
            timeout    : 3000,
            firstname  : 'ecom_mobile',
            secondname : 'relate',
            protocol   : [
                "dev",		// 设备类型
                "mac",      // mac地址，安装风行客户端的机器来获取
                "ver",      // app版本号
                "nt",       // 网络类型(nt)：1—wifi，2—移动网络，3—其它  -1-无网络（网站和m站报3）
                "fudid",    // 用户ID(fudid)：长度为64位的数字与字母混排字符串，唯一标识用户（无该字段则报为空）
                "sid",      // 渠道ID(sid):区分各个渠道商，数字
                "apptype",  // app类型（apptype）：用于标示app的类型（网站报web_app_main、m站报mweb_app_main）
                "scid",     // 来源内容ID(scid)：源媒体或源视频的ID，只能是数字，没有报空
                "schannel", // 来源内容频道ID（schannel）：来源内容所在的频道ID
                "cid",      // 点击内容ID(cid)：点击的媒体ID、或视频ID、或专题ID、或聚合媒体ID，只能是数字，没有报空
                "block",    // 推荐位置(block)：上报接口中返回的区块ID，没有报空。当发生视频联播时需要在区块id后加个区分标识
                "stp"       // 算法标识（stp）:上报接口返回的stp值，不需要做处理
            ]
        }
    };
    var fck    = {
        key    : 'fck',
        create : function() {
            var val = parseInt( +new Date / 1000 ) + (gmp() + gmp()).substr( 0, 5 );
            F.cookie.set( fck.key, val );
            return val;
        },
        get    : function() {
            var val = F.cookie.get( fck.key );
            return val || fck.create();
        }
    };
    var sid    = {
        key     : 'pvsid',
        convkey : 'pvsid_cunv',
        cycle   : 30 * 60,
        create  : function() {
            var val = parseInt( +new Date / 1000 ) + (gmp() + gmp()).substr( 0, 5 );
            sid.write( val );
            pvcount.set( 'seidcount', pvcount.get( 'seidcount' ) + 1 );
            document.cookie = sid.convkey + '=1; path=/; domain=.fun.tv';
            pvcount.set( 'sestep', 0 );
            return val;
        },
        write   : function( val ) {
            F.cookie.set( sid.key, val, sid.cycle / (24 * 60 * 60) );
        },
        get     : function() {
            var val = F.cookie.get( sid.key ), cunv = F.cookie.get( sid.convkey );
            return (cunv && val) || sid.create();
        },
        init    : function() {
            // 只要页面有动静就刷新sid重写过期时间
            var sidendtime = new Date, sidwrite = sidendtime;
            $( 'body' ).on( 'ontouchmove', function() {sidendtime = new Date;} );
            setInterval( function() {
                if ( sidendtime > sidwrite ) {
                    sidwrite = sidendtime;
                    sid.write( sid.get() );
                }
            }, sid.cycle * 1000 / 2 );
        }
    };
    var pvid   = {
        guid : '',
        get  : function( noCachePvid ) {
            var guid = '';
            if ( noCachePvid ) { //启用新的pvid
                guid      = newGuid();
                pvid.guid = guid;
                pvcount.set( 'step', pvcount.get( 'step' ) + 1 );
                pvcount.set( 'sestep', pvcount.get( 'sestep' ) + 1 );
            } else {
                if ( !pvid.guid ) {
                    guid      = newGuid();
                    pvid.guid = guid;
                } else {
                    guid = pvid.guid;
                }
            }
            return guid;
        }
    };
// 控制pv数据上报中依赖的pv计数器与session计数器
// pvcount cookie值 {总pv数}|{总会话数}|{当前会话pv数}
    var pvcount      = {
        cookie : 'pvcount',
        log    : [ 'step', 'seidcount', 'sestep' ],
        get    : function( key ) {
            var val = F.cookie.get( pvcount.cookie ), vals = val.split( '|' ),
                index                                      = $.inArray( key, pvcount.log );
            return parseInt( vals[ index ] ) || 0;
        },
        set    : function( key, val ) {
            var vals  = F.cookie.get( pvcount.cookie ).split( '|' ),
                index = $.inArray( key, pvcount.log );
            for ( var i = 0, len = pvcount.length; i < len; i++ ) {
                vals[ i ] = parseInt( vals[ i ] ) || 0;
            }
            if ( index > -1 ) {
                vals[ index ] = val;
            }
            F.cookie.set( pvcount.cookie, vals.join( '|' ) );
        }
    };
    var paramHandle  = { pvid : pvid, sid : sid, fck : fck };
    var gmp          = function() {return (((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 )};
    var newGuid      = function() {
        var guid = "";
        for ( var i = 1; i <= 32; i++ ) {
            var n = Math.floor( Math.random() * 16.0 ).toString( 16 );
            guid += n;
            if ( (i == 8) || (i == 12) || (i == 16) || (i == 20) ) {
                guid += "-";
            }
        }
        return guid;
    };
    //获取来源页地址
    var refer        = '';
    var referrer     = function() {
        if ( refer ) { return refer; }
        //当搜索页使用js跳转过来时, 只能使用opener来获取前一个页面.
        var ref = '';
        try {
            ref = (document.referrer.length > 0) ? document.referrer : (window.opener && opener.location && opener.location.href) ? opener.location.href : '';
        } catch ( e ) {}
        return ref;
    };
    //渠道号
    var _allianceID  = undefined;
    var allianceID   = function() {
        if ( _allianceID == undefined ) {
            var param = F.url.getQueryValue( 'malliance' ) || F.url.getQueryValue( 'alliance' );
            //m站渠道号统计不支持6位，故pc渠道做下映射
            //云帆影视	          170620	2234
            //百度内容阿拉丁	          950002	2233
            //2345短视频合作            175858	2232
            //金山影视	          159682	2231
            //2345影视（长视频）	  155544	2230
            //百度视频	          155085	2229
            //360影视          	  152055	2228
            var qudaoMap = {
                '170620' : '2234',
                '950002' : '2233',
                '175858' : '2232',
                '159682' : '2231',
                '155544' : '2230',
                '155085' : '2229',
                '152055' : '2228'
            };
            param        = parseInt( qudaoMap[ param ] || param ) || F.config.malliance || '';
            if ( !param ) {
                var refer = String( referrer() );
                if ( ~refer.indexOf( 'iqiyi.com' ) ) {
                    param = '2281';
                } else if ( ~refer.indexOf( 'baidu.com' ) ) {
                    param = '2280';
                } else if ( ~refer.indexOf( 'sogou.com' ) ) {
                    param = '2278';
                } else if ( ~refer.indexOf( 'qq.com' ) ) {
                    param = '2277';
                }
            }
            if ( param ) {
                F.cookie.set( 'malliance', param, -1 );
            }
            _allianceID        = (param || F.cookie.get( 'malliance' ) || '') + '';
            F.config.malliance = _allianceID;
        }
        return _allianceID;
    };
    // 上报基础字段数据初始化
    var statBaseData = function( param ) {
        var param2cookie                                  = { 'mac' : 'Mac', userid : 'userid', fpc : '_fpc', version : '_version' },
            param2attr = [ 'fck', 'sid', 'pvid' ], _taScn = "|" + F.cookie.get( '_scn' ),
            params                                        = {
                config     : F.config.ctrlname,
                url        : location.href,
                ta         : _taScn,
                referurl   : referrer(),
                channelid  : allianceID(),
                vtime      : F.config.timeStrart ? (new Date()).getTime() - F.config.timeStrart : 0,
                ext        : F.config.pvext || '',
                step       : pvcount.get( 'step' ),
                seidcount  : pvcount.get( 'seidcount' ),
                sestep     : pvcount.get( 'sestep' ),
                clientFlag : F.config.clientFlag || 4,
                mediatype  : F.config.mediatype || '||||'
            };
        for ( var key in param2cookie ) {
            params[ key ] = F.cookie.get( param2cookie[ key ] );
        }
        if ( params[ 'userid' ] == '' ) {
            params[ 'userid' ] = 0;
        }
        // 是否需要使用新的pvid
        var noCachePvid = (param && param.noCachePvid) ? true : false, attr = '';
        for ( var i = 0, len = param2attr.length; i < len; i++ ) {
            attr = param2attr[ i ];
            if ( noCachePvid && attr == 'pvid' ) {
                params[ attr ] = paramHandle[ attr ].get( noCachePvid );
            } else {
                params[ attr ] = paramHandle[ attr ].get();
            }
        }
        $.extend( params, param || {} );
        // 缓存refer
        if ( noCachePvid || !refer ) {
            refer = params.referurl;
        }
        return params;
    };
    var stat         = (function() {
        return {
            getRequest : function( config, data, split ) {
                split          = split || '*_*';
                data.rprotocol = config.rprotocol;
                var firstname  = config.firstname || 'website',
                    secondname = config.secondname || 'pv',
                    url        = 'http://stat.funshion.net/' + firstname + '/' + secondname + "?";
                if ( config.timeout ) {
                    F.tool.pvManager.add( { root : firstname, type : secondname, param : protocolIfy( config.protocol, data ), split : split } );
                    setTimeout( function() {F.tool.pvManager.send();}, config.timeout );
                } else {
                    F.tool.pv.dispatch( url + protocolJoin( config.protocol, data ).join( split ) );
                }
            }
        };
        function protocolJoin( protocol, data ) {
            var params = [], key, val;
            for ( var i = 0, len = protocol.length; i < len; i++ ) {
                key = protocol[ i ], val = data[ key ];
                params.push( key + '=' + (typeof val == 'undefined' ? '' : encodeURIComponent( val )) );
            }
            return params;
        }

        function protocolIfy( protocol, data ) {
            var params = {}, key, val;
            for ( var i = 0, len = protocol.length; i < len; i++ ) {
                key = protocol[ i ], val = data[ key ];
                params[ key ] = (typeof val == 'undefined' ? '' : encodeURIComponent( val ));
            }
            return params;
        }
    })();
    /**
     * 相关推荐接口上报
     */
    var relateStat   = function( options ) {
        var params     = statBaseData();
        params.nt      = 3;
        params.sid     = allianceID();
        params.fudid   = fck.get();
        params.apptype = 'mweb_app_main';
        $.extend( params, options );
        stat.getRequest( repKey[ 'relate' ], params, '&' );
    };
    /**
     * pv上报
     */
    var pvStat       = (function() {
        return {
            init : function() {
                sid.init();
            },
            send : function( param ) {
                var params = statBaseData( param );
                params.url = decodeURIComponent( params.url );
                stat.getRequest( repKey[ 'pv' ], params );
            }
        }
    })();
    /**
     * 播放上报
     */
    var vvId         = 0;
    var playStat     = (function() {
        return function( option ) {
            var logs  = statBaseData() || {};
            vvId      = newGuid();
            logs.vvid = vvId;
            logs.ext  = 1;
            var param = $.extend( {}, logs, option );
            stat.getRequest( repKey[ 'play' ], param );
        }
    })();
    /**
     * 播放时长上报
     */
    var playTimeStat = (function() {
        return function( option ) {
            var logs  = statBaseData() || {};
            logs.vvid = vvId;
            var param = $.extend( {}, logs, option );
            stat.getRequest( repKey[ 'pt' ], param );
        }
    })();
    /**
     * 点击上报
     */
    var clickStat    = (function() {
        var tag2index = {
            UL       : 1,
            OL       : 2,
            LI       : 3,
            INPUT    : 4,
            DIV      : 5,
            BODY     : 6,
            STRONG   : 7,
            SPAN     : 8,
            FORM     : 9,
            BUTTON   : 10,
            CAPTION  : 11,
            FIELDSET : 12,
            COLGROUP : 13,
            TFOOT    : 14,
            LABEL    : 15,
            LEGEND   : 16,
            THEAD    : 17,
            OPTGROUP : 18,
            OPTION   : 19,
            SELECT   : 20,
            TABLE    : 21,
            TBODY    : 22,
            IFRAME   : 0,
            SCRIPT   : 0,
            OBJECT   : 0,
            EMBED    : 0,
            IMG      : 0
        };
        var screenW   = screen.width, screenH = screen.height;
        return {
            getRequest        : function( option ) {
                var pgclickNum = 1;
                var logs       = statBaseData() || {};
                logs.block     = option.positionCode;
                logs.screenw   = option.screenW;
                logs.screenh   = option.screenH;
                logs.browserw  = $( window ).width();
                logs.browserh  = $( window ).height();
                logs.browserpx = option.pageX - option.scrollLeft - Math.round( logs.browserw / 2 );
                logs.browserpy = option.pageY - option.scrollTop;
                logs.pagew     = $( document ).width();
                logs.pageh     = $( document ).height();
                logs.pagepx    = option.pageX - Math.round( logs.pagew / 2 );
                logs.pagepy    = option.pageY;
                logs.ext       = 'turnurl=' + option.targetUrl + (F.config.clickext || '');//eg clickext='|k1=v1&k2=v2'
                stat.getRequest( repKey[ 'click' ], logs );
            },
            send              : function( event, data, callback ) {
                var self   = this,
                    target = event.target || event.srcElement || document;
                if ( event.pageX == null && event.clientX != null ) {
                    var docEle  = document.documentElement;
                    var body    = document.body;
                    event.pageX = event.clientX + (docEle && docEle.scrollLeft || body && body.scrollLeft || 0)
                    - (docEle && docEle.clientLeft || body && body.clientLeft || 0);
                    event.pageY = event.clientY + (docEle && docEle.scrollTop || body && body.scrollTop || 0)
                    - (docEle && docEle.clientTop || body && body.clientTop || 0);
                }
                if ( typeof event.pageX == "undefined" ) { return; }
                // 获取点击源
                var isTarget = $( target ).attr( 'ct' ) || ''; //是否是点击对象
                if ( !isTarget ) {
                    target = _getStatTarget( target );
                    if ( !target ) { return; }
                }
                if ( target.nodeName == "A" && $( target ).attr( 'data-openurl' ) ) { return; }
                var isButton  = false;
                var targetUrl = _getTrueLink( target );
                if ( target.nodeName !== "A" || targetUrl === "" || balance( targetUrl, location.href ) ) { isButton = true; }
                var ck = $( target ).attr( 'data-ck' );
                if ( ck ) {
                    $.each( ck.split( "&" ), function( index, item ) {
                        var val = item.split( "=" );
                        if ( val.length !== 2 ) { return; }
                        data[ val[ 0 ] ] = val[ 1 ];
                    } );
                }
                self.getRequest( {
                    event        : event,
                    eventId      : isButton ? 2 : 1,
                    positionCode : _getPositionCode( target ),
                    targetUrl    : isButton ? "" : targetUrl,
                    pageX        : event.pageX,
                    pageY        : event.pageY,
                    scrollLeft   : $( window ).scrollLeft(),
                    scrollTop    : $( window ).scrollTop(),
                    screenW      : screenW,
                    screenH      : screenH,
                    appData      : data || {}
                } );
                if ( callback ) {
                    callback.call( self, {
                        isButton  : isButton,
                        targetUrl : targetUrl
                    } )
                }
            },
            init              : function() {
                var self = this;
                document.addEventListener( 'click', function( ev ) {
                    var event = ev || window.event;
                    self.send( event, {}, function( q ) {} );
                }, true );
            },
            getElementByXPath : _getElementByXPath,
            getTrueLink       : _getTrueLink,
            getStatTarget     : _getStatTarget,
            getPositionCode   : _getPositionCode
        };
        function balance( n, m ) {
            return n.replace( /\/?#.*|\/$/, "" ) === m.replace( /\/?#.*|\/$/, "" )
        }

        function _getTrueLink( ele ) {
            var href = ele.href;
            if ( !href ) { return ""; }
            if ( /^(javascript:|#)/i.test( href ) ) { return ""; }
            var lochref = location.href;
            var domain  = lochref.replace( /(https?:\/\/[^\/]+).*/, "$1" );
            var path    = domain === lochref ? domain + "/" : lochref.replace( /[#?].*/, "" ).replace( /[^\/]*$/, "" );
            return href.replace( /^\.[\.\/]+/g, function( t ) {
                var u = (t.match( /\.\.\//g ) || []).length;
                for ( var p = 0; p < u; p++ ) { path = path.replace( /[^\/]+\/$/, "" ); }
                return path;
            } ).replace( /&amp;/g, "&" ).replace( /^\//, domain + "/" ).replace( /^[^\h\/f]/, path + "$&" );
        }

        function _getStatTarget( ele ) {
            var allowTagname = {
                A      : 1,
                INPUT  : 1,
                BUTTON : 1
            };
            if ( ele.nodeName == "LABEL" ) {
                var input, forval = $( ele ).attr( 'for' );
                if ( forval ) {
                    input = $( "input#" + forval )[ 0 ];
                }
                if ( !input ) {
                    var inputInner = $( ele ).find( "input:first" )[ 0 ];
                    if ( inputInner ) {
                        input = inputInner;
                    }
                }
                if ( input ) {
                    ele = input;
                }
            }
            // num 为循环查找次数
            // 主要解决问题是 a元素下嵌套别的元素，导致点击上报不被触发
            // 当想父节点找到 a元素，则return
            var num = 4;
            while ( num-- && ele && !allowTagname[ ele.nodeName ] ) {
                ele = ele.parentNode;
            }
            return (ele && allowTagname[ ele.nodeName ]) ? ele : false;
        }

        function _getElementByXPath( path ) {
            var ele = document.evaluate( path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
            if ( ele.snapshotLength > 0 ) {
                return ele.snapshotItem( 0 );
            }
            return null;
        }

        function _getPositionCode( ele ) {
            var paths = [], block = '', conType = '';
            for ( ; ele; ele = ele.parentNode ) {
                var tagName = ele.nodeName.toUpperCase();
                if ( tagName == "BODY" ) {
                    break;
                }
                block = $( ele ).attr( 'block' );//区块的id
                if ( block ) {
                    paths.splice( 0, 0, '#' + block );
                    return paths.join( "~" );
                }
                var index   = 0;
                var conType = $( ele ).attr( 'bc' );//bc(block-content)区块的内部的区分:eg:'btn', 'tit', 'con'
                for ( var i = ele.previousSibling; i; i = i.previousSibling ) {
                    var d = i.nodeName.toUpperCase();
                    if ( tag2index[ d ] === 0 ) {
                        continue;
                    }
                    if ( d == tagName ) {
                        ++index;
                    }
                }
                if ( conType ) {
                    tagName = '*' + conType;
                } else {
                    tagName = tag2index[ tagName ] || tagName;
                }
                var tindex = (index ? "!" + (index + 1) : "");
                paths.splice( 0, 0, tagName + tindex );
            }
            return paths.length ? paths.join( "~" ) : null;
        };
    })();
    /**
     * 悬浮层上报
     * @name F.log.event
     * @function
     * @grammar F.log.event({option,ext:[key=value]})
     * @param {String} option.type 事件类型
     * @param {String} option.name 事件参数名称
     * @param {Array} ext:[key=value] 扩展字段以数组形式传入
     * @remark
     *    F.log.event({type: "show", name: 'history');
		// 带扩展字段调用方式
		F.log.event({type: "show", name: 'history',ext: ['eventpro='+ mid, "branch="+ branch]});
	 */
    var eventStat    = (function() {
        return function( option ) {
            var logs        = statBaseData() || {};
            option          = option || {};
            option.type     = option.type || "show";
            option.ext      = option.ext || [];
            logs[ 'event' ] = option.type + "_" + option.name;
            logs.ext        = option.ext.join( "*_*" );
            stat.getRequest( repKey[ 'event' ], logs );
        }
    })();
    /**
     * 猜你喜欢上报
     */
    var guessStat    = (function() {
        return function( option ) {
            var logs  = statBaseData() || {};
            option    = option || {};
            logs.mid  = option.mid;
            logs.mids = option.mids;
            logs.et   = option.et;
            logs.stp  = option.stp;
            stat.getRequest( repKey[ 'guess' ], logs );
        }
    })();
    /**
     * 顶踩收藏订阅上报
     */
    var actionStat   = (function() {
        return function( option ) {
            var logs       = statBaseData() || {};
            option         = option || {};
            logs.flag      = option.flag;
            logs.action    = option.action;
            logs.mediatype = option.mediatype;
            stat.getRequest( repKey[ 'action' ], logs );
        }
    })();
    /**
     * SEO上报
     */
    var seoStat      = {
        isseolog : false,
        send     : function() {
            if ( this.isseolog ) { return false; }
            this.isseolog = true;
            var ref       = referrer();
            // 各大搜索网站关键字对应信息, 包含 key 名
            var from      = {
                    "google"      : { k : "q" },
                    "baidu"       : { k : "wd" },
                    "bing"        : { k : "q" },
                    "soso"        : { k : "w" },
                    "yahoo"       : { k : "p" },
                    "sogou"       : { k : "query", charset : "gbk" },
                    "youdao"      : { k : "q" },
                    "alexa"       : { k : "q" },
                    "163"         : { k : "q" },
                    "lycos"       : { k : "query" },
                    "3721"        : { k : "name" },
                    "search"      : { k : "p" },
                    "zhongsou"    : { k : "w" },
                    "soku"        : { k : "keyword" },
                    "yisou"       : { k : "q" },
                    "so"          : { k : "q" },
                    "baigoogledu" : { k : "q" },
                    "jike"        : { k : "q" },
                    "gougou"      : { k : "q" }
                },
                // 获取来源地址 domain
                domain    = ref.match( /.\:\/\/([^\/]*).*/ ),
                domainkey = domain && domain[ 1 ] ? domain[ 1 ] : "",
                // 上报对象 {关键字, 来源网站名, 关键字编码格式, 来源页地址, 当前页地址}
                report    = { query : "", from : "unknown", charset : "utf8", ref : ref, url : location.href, alliance : 0 };
            // 当来源页为 fun.tv 时, 不用上报
            if ( !domainkey || domainkey.indexOf( "fun.tv" ) != -1 ) { return ref; }
            // 在搜索网站队列中找网站对应信息
            $.each( from, function( key, item ) {
                if ( domainkey.indexOf( key ) == -1 ) { return true; }
                report.from = key;
                // 解码两次, ( 当解码发生错误时, 断定关键词编码方式为 gbk )
                for ( var i = 0; i < 2; i++ ) {
                    try {
                        report.query = decodeURIComponent( decodeURIComponent( F.url.getQueryValue( item.k, ref ) || '' ) );
                    } catch ( e ) {
                        report.query   = F.url.getQueryValue( item.k, ref );
                        report.charset = "gbk";
                    }
                    if ( report.query ) {
                        break;
                    }
                    item.k = 'word';
                }
            } );
            report.alliance = F.config.malliance;
            F.tool.pvManager.add( "searchsource", report );
            setTimeout( function() { F.tool.pvManager.send(); }, 800 );
        }
    };
    //初始化fck，方便其他地方调用
    F.config         = F.config || {};
    F.config.fck     = fck.get();
    //初始化渠道号
    allianceID();
    var log = {
        pv     : pvStat,
        click  : clickStat,
        event  : eventStat,
        guess  : guessStat,
        action : actionStat,
        relate : relateStat,
        play   : playStat,
        pt     : playTimeStat
    };
    F.namespace( "log", log );
    $( function() {
        F.ready( function() {
            //页面刷新后的上报
            F.tool.pvManager.send();
            pvStat.init();
            clickStat.init();
            pvStat.send( { noCachePvid : true } );
            seoStat.send();
        } );
    } );
})();