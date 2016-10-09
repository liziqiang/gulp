(function() {
    // 广告类型映射
    var MAP_TYPES = {
        // 首页
        h   : {
            // 焦点图
            f : {
                iphone  : 'm_ipe_fpf_v1',
                android : 'm_afpf_v1'
            },
            // banner
            b : {
                iphone  : 'm_ipe_fbn_v1',
                android : 'm_afbn_v1'
            }
        },
        // 播放页
        p   : {
            // banner
            b  : {
                iphone  : 'm_ipe_pbn_v1',
                android : 'm_apbn_v1'
            },
            // 底部悬浮
            s  : {
                iphone  : 'm_ipe_afl_v1',
                android : 'm_afl_v1'
            },
            // 淘宝原生广告
            o  : {
                iphone  : 'm_ip_original',
                android : 'm_ap_original'
            },
            // js代码投放类广告
            js : 'm_p_icon'
        },
        //三方合作页
        t   : {
            b   : {
                iphone  : 'm_i_co',
                android : 'm_a_co'
            },
            //新用户首页兑换入口
            nup : 'm_nup'
        },
        // 所有页面均投放的广告
        all : {
            i  : 'm_icon',
            ic : 'm_intercept'
        }
    };
    /**
     * 基础方法
     * @author ziqiang.lee@gmail.com
     * @constructor
     */
    var Base      = {
        init        : function() {
            var os = F.url.getQueryValue( 'os' );
            if ( os ) {
                this.platform = os;
            } else {
                this.platform = F.platform.isAndroid ? 'android' : (F.platform.isIphone ? 'iphone' : '');
            }
            return this;
        },
        parseAdType : function( adType ) {
            var reg = /mw_(\w+)_(\w+)/, ret = {};
            if ( reg.test( adType ) ) {
                ret.page = RegExp.$1;
                ret.type = RegExp.$2;
            }
            return ret;
        },
        mapAdType   : function( item ) {
            var MAP_PAGE  = {
                'index_'     : 'h',
                'channel_'   : 'c',
                'mplay_'     : 'p',
                'vplay_'     : 'p',
                'xz_'        : 't',
                'client_new' : 't'
            };
            var ctrlname  = F.config.ctrlname,
                deliver   = $( item ).attr( 'data-deliver' ),
                marker    = deliver.replace( '###F.config.ctrlname###', ctrlname ),
                adType    = null,
                parsed    = null,
                objType   = null,
                realType  = null,
                objResult = {};
            if ( marker.indexOf( ctrlname ) ) {
                adType = marker.replace( ctrlname, MAP_PAGE[ ctrlname ] );
                parsed = this.parseAdType( adType );
                if ( !MAP_TYPES[ parsed.page ] ) { return objResult; }
                objType = MAP_TYPES[ parsed.page ][ parsed.type ];
                if ( typeof objType === 'string' ) {
                    realType = objType;
                } else {
                    realType = objType[ this.platform ];
                }
                if ( !realType ) { return objResult; }
            }
            return { ap : realType, adType : adType, $item : $( '[data-deliver="' + deliver + '"]' ) };
        },
        loadImage   : function( material, callback ) {
            var url = material.material;
            this.send( url, function() {
                var self = this;
                if ( self.complete && self.width && self.height ) {
                    material.width  = self.width;
                    material.height = self.height;
                    callback( material, true );
                    return;
                }
                self.onload = function() {
                    material.width  = self.width;
                    material.height = self.height;
                    callback( material, true );
                    self.onload = null;
                }
            } );
        },
        loadScript  : function( material, callback ) {
            var script    = document.createElement( 'script' );
            script.onload = function() {
                callback( material );
                script.onload = null;
            };
            script.src    = material;
            document.head.appendChild( script );
        },
        send        : function( url, onLoad ) {
            if ( !url ) { return; }
            var $image = document.createElement( 'img' );
            if ( typeof onLoad == 'function' ) {
                onLoad.call( $image );
            }
            $image.src = url;
        },
        debug       : function( str ) {
            if ( !str ) { return; }
            str       = '+ ' + str + ' +';
            var total = str.length, border = new Array( total + 1 ).join( '+' ), tpl = [ border, str, border ], length = tpl.length;
            for ( var i = 0; i < length; i++ ) {
                console.log( tpl[ i ] + (i == length - 1 ? '' : '\n') );
            }
        },
        reportView  : function( view ) {
            var self = this;
            if ( view ) {
                $.each( view, function( k, v ) {
                    if ( v.point == 0 ) {
                        var url = v.url;
                        if ( v.provider == 'funshion' ) {
                            if ( url.indexOf( '&t=' ) < 0 ) {
                                url += '&t=0';
                            } else {
                                url = url.replace( /&t=[^&]*/, '&t=0' );
                            }
                        }
                        self.send( url );
                    }
                } );
            }
        },
        reportClick : function( click, $item ) {
            var self = this;
            if ( click ) {
                var $anchor = $item.find( 'a' );
                $anchor     = $anchor.length ? $anchor : $item;
                $anchor.off( 'click' ).on( 'click', function() {
                    $.each( click, function( k, v ) {
                        self.send( v.url );
                    } );
                } );
            }
        }
    };
    Base.init();
    /**
     * 广告加载器
     * @param handler 自定义函数，用于广告请求完调用
     * @author ziqiang.lee@gmail.com
     * @constructor
     */
    var AdLoader  = Object.create( Base );
    $.extend( AdLoader, {
        setup  : function( handler ) {
            this.handler = handler || null;
            return this;
        },
        load   : function( option, errorHandler ) {
            var self      = this,
                url       = F.config.pub + '/interface/deliver',
                params    = self.params( _getOptions( option ) );
            var loadStart = +new Date();
            F.request( url, params, function( json ) {
                if ( !json ) { return errorHandler && errorHandler(); }
                // 显示请求时间
                self.debug( 'Request for "' + option.ap + '" coasts ' + (+new Date() - loadStart) + 'ms' );
                if ( self.handler ) {
                    self.handler( json );
                } else {
                    F.deliver.Handler.setup( json, option ).handleJson();
                }
            }, {
                noAjax : true,
                error  : errorHandler
            } );
            //cnzz广告数据测试
            var label = F.cookie.get( 'malliance' ) == 1660 ? 'xiaomi' : 'other';
            window._czc && window._czc.push( [ '_trackEvent', 'adRequest', option.ap, label ] );
            // 获取ap
            function _getOptions( option ) {
                return { ap : option.ap };
            }
        },
        params : function( options ) {
            var params = {
                ap          : '',
                deliver_ver : 'v1',
                client      : this.platform + '_web', //端信息，iphone_web/andriod_web
                oc          : F.cookie.get( 'malliance' ) || 'mweb', //渠道ID
                player_wh   : '16:9',// 播放器宽高比,移动的广告播放器宽高比固定为16:9
                browser     : '',//浏览器类型
                vchannel    : F.url.getQueryValue( 'channel' ) || 0,//频道
                mid         : F.url.getQueryValue( 'mid' ) || 0,//production媒体ID
                plid        : 0,//playlist标识
                videoid     : F.url.getQueryValue( 'vid' ) || 0,//playlist下的视频ID
                isvip       : 0,//是否VIP视频
                url         : encodeURIComponent( location.href ),//当前播放页url，客户端无播放页，由广告前端提供当前播放器所在地址，url编码
                refer       : encodeURIComponent( document.referrer ),//当前播放页的前一页面的地址，即来源页地址，url编码
                uid         : 0,//用户登录id
                fudid       : F.cookie.get( 'fck' ) || '',//风行私有用户标识。举例：33AAC5A6090D090D080D080DD4C1305E3A3C31693E343E686D393E3F6D6B313F
                dev         : '',//设备型号。举例：iPhone3.1
                os          : this.platform || '',//操作系统（ios|android）
                osver       : '',//操作系统版本。举例：4.1
                screen      : ''//设备分辨率。大*小
            };
            $.extend( params, options );
            return params;
        }
    } );
    F.deliver = F.deliver || {
        Base     : Base,
        Loader   : AdLoader,
        mapTypes : MAP_TYPES
    };
})();