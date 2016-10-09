// 打开第三方登录页面
F.thirdConn = {
    currentUrl : 'http://' + location.host + '/account/information?open=small',
    bindurls   : {
        'sina'    : {
            'bindurl'   : 'http:\/\/fs.fun.tv\/account\/login_app\/sina\/iframe?action_type=bind',
            'unbindurl' : '\/account\/information\/unbind\/sina'
        },
        'tencent' : {
            'bindurl'   : 'http:\/\/fs.fun.tv\/account\/login_app\/tencent\/iframe?action_type=bind',
            'unbindurl' : '\/account\/information\/unbind\/tencent'
        },
        'zone'    : {
            'bindurl'   : 'http:\/\/fs.fun.tv\/account\/login_app\/zone\/iframe?action_type=bind',
            'unbindurl' : '\/account\/information\/unbind\/zone'
        },
        'renren'  : {
            'bindurl'   : 'http:\/\/fs.fun.tv\/account\/login_app\/renren\/iframe?action_type=bind',
            'unbindurl' : '\/account\/information\/unbind\/renren'
        },
        'kaixin'  : {
            'bindurl'   : 'http:\/\/fs.fun.tv\/account\/login_app\/kaixin\/iframe?action_type=bind',
            'unbindurl' : '\/account\/information\/unbind\/kaixin'
        }
    },
    build      : function( url, provider, type ) {
        type = type || 'small';
        var service = 'http://' + location.host + '/account/information?open=' + type;
        var results = url + encodeURIComponent( 'http://sso.funshion.com/sso/oauth/account/bind?oauth_provider=' + provider + '&service=' + encodeURIComponent( service ) );
        F.thirdConn.currentUrl = service;
        return results;
    },
    complete   : function( status, msg, bindType ) {
        status = parseInt( status, 10 );
        var p = window.opener || window;
        try {
            if ( p && p.$ ) {
                p.$.send( 'third.bind', { s : status, m : msg, t : bindType, thirdUrl : F.thirdConn.currentUrl } );
            }
        } catch ( e ) {}
        if ( F.url.getQueryValue( 'open' ) == 'small' ) {
            try { window.close(); } catch ( e ) {}
        }
    },
    uuidTimer  : 0,
    // 获取当前用户的uuid
    getUUID    : function() {
        // 如果当前有uuid的获取，中断掉
        if ( this.uuidTimer && $.isObject( this.uuidTimer ) && this.uuidTimer.abort ) {
            this.uuidTimer.abort();
        }
        // 获取uuid
        this.uuidTimer = F.request( F.config.api + '/ajax/oauth_uuid', function( json ) {
            if ( !$.isObject( json ) || !json.status || !json.data ) {
                return;
            }
            F.thirdConn.thirdUUID = json.data;
        } );
    },
    // 打开授权窗口
    openThird  : function( url ) {
        if ( !F.cookie.get( '_proxy_login' ) ) {
            // 获得二级域名标示，即'fs'、'fsqq'、'i'等funshion二级域名标示
            var hst = window.location.host.split( '.' )[ 0 ],
            // domain是否为宽松型， 1: 宽松， 0：限制
            d = document.domain == window.location.hostname ? 0 : 1;
            // 用cookie:_proxy_login 记录domain和host，判断是否需要使用跨域处理
            document.cookie = '_proxy_login=' + escape( JSON.stringify( { domain : d, host : hst } ) ) + '; path=/; domain=.fun.tv;';
        }
        // 如果没有获取到thirdUUID，从cookie中获取到phpsessid代替
        F.thirdConn.thirdUUID = F.cookie.get( 'PHPSESSID' );
        // 如果还没有thirdUUID， 不做任何操作
        if ( !F.thirdConn.thirdUUID ) {
            return false;
        }
        // 获取到当前host，作为参数传递
        var host = location.host.split( '.fun.tv' )[ 0 ];
        if ( !host || host == 'i' ) {
            host = 'www';
        }
        var tempUrl = url.split( '/oauth_authorize/' ), tempPlat;
        if ( tempUrl.length > 1 ) { tempPlat = tempUrl[ 1 ].split( '/' )[ 0 ].split( '?' )[ 0 ]; }
        if ( tempPlat ) {
            F.thirdConn.thirdPlat = tempPlat;
        }
        // 拼接url，带上host、open、uuid等参数
        url += (url.indexOf( '?' ) == -1 ? '?' : '&') + 'host=' + host + '&open=small&uuid=' + F.thirdConn.thirdUUID + '&login_st=' + F.cookie.get( 'sso_token' ) + '&client=0';
        // 打开第三方授权窗口
        window.open( url );
        // 授权continue组件
        setTimeout( function() {
            F.thirdContinue.init( url );
        }, 20 );
    }
};
(function() {
    // 第三方登录点击继续弹窗按钮
    var ndialog = {
        // 遮罩层
        oShied   : null,
        // continue面板对象
        oCon     : null,
        // uuid
        uuid     : '',
        // 创建continue面板
        create   : function() {
            // 获取dom
            this.oShied = $( '#js_continueShied' );
            this.oCon = $( 'js_continueCon' );
            // 如果两个dom之一未存在，均添加css
            if ( !this.oShied.length || !this.oCon.length ) {
                F.util.addSheet( '.css_continueShied{background:#000; position:absolute; top:0; left:0; width:100%; height:100%; z-index:29999; opacity:0.6; filter:alpha(opacity=60);}.css_continueCon{position:fixed; _position:absolute; z-index: 30000; height: 146px; line-height: 40px; width: 260px; background: #fff; left:50%; margin-left: -130px; top: 35%; text-align: left;}.css_continueCon p{line-height:24px;font-size:18px;color:#9fa0a8;margin:30px 30px 17px;}.css_continueCon a{display:inline-block; text-align:center; line-height:30px; font-weight: bold; width:80px; height:30px; font-size:12px; color:#fff; background-color:#b3d0e6;}.css_continueConA{ margin:0 41px 0 30px;}' );
            }
            if ( !this.oShied.length ) {
                this.oShied = $( '<div>', {
                    class : 'css_continueShied',
                    id    : 'js_continueShied'
                } );
                this.oShied.prependTo( 'body' );
            }
            if ( !this.oCon.length ) {
                this.oCon = $( '<div>', {
                    class : 'css_continueCon',
                    id    : 'js_continueCon'
                } );
                this.oCon.html( '<p>请您在新打开的页面上完成授权</p><a href="javascript:;" data-auth-opt="verify" class="css_continueConA">我已授权</a><a href="javascript:;" data-auth-opt="close" class="css_continueConB">取消</a>' );
                this.oCon.prependTo( 'body' );
                // 绑定事件
                this.oCon.find( 'a' ).on( 'click', function() {
                    var opt = $( this ).attr( 'data-auth-opt' );
                    ndialog[ opt ] && ndialog[ opt ]();
                } );
            }
        },
        // 显示continue面板
        show     : function() {
            this.create();
            this.oCon.show();
            this.oShied.height( $( document ).height() ).show();
        },
        // 关闭continue面板
        close    : function() {
            this.oCon.hide();
            this.oShied.hide();
        },
        // 验证成功登录操作
        verlogin : function() {
            /*登录流程已变更，改为刷新页面*/
            window.location.reload();
        },
        // 验证是否授权成功
        verify   : function() {
            if ( !F.thirdConn.thirdUUID || !F.thirdConn.thirdPlat ) { return; }
            F.request( F.config.api + '/ajax/login_oauth_result?plat_type=' + F.thirdConn.thirdPlat + '&uuid=' + F.thirdConn.thirdUUID + '&iscancel=0', function( json ) {
                if ( json.status == 200 ) {
                    if ( json.action_type && json.action_type == 'login' ) {
                        ndialog.verlogin();
                    } else {
                        $.send( 'third.bind', {
                            s        : json.status,
                            m        : json.msg,
                            t        : F.thirdConn.thirdPlat,
                            thirdUrl : F.thirdConn.currentUrl
                        } );
                    }
                } else if ( json.status == 400 ) {
                    $.send( 'third.bind', {
                        s        : json.status,
                        m        : json.msg,
                        t        : F.thirdConn.thirdPlat,
                        thirdUrl : F.thirdConn.currentUrl
                    } );
                } else {
                    F.showTip( json.msg || '授权失败，请重试' );
                }
                ndialog.close();
            } );
        },
        // 执行
        init     : function( url ) {
            if ( !url ) { return; }
            var tempUrl = url.split( '/oauth_authorize/' ), tempPlat;
            if ( tempUrl.length > 1 ) { tempPlat = tempUrl[ 1 ].split( '/' )[ 0 ].split( '?' )[ 0 ]; }
            if ( !tempPlat ) { return; }
            F.thirdConn.thirdPlat = tempPlat;
            ndialog.show();
        }
    };
    // 处理第三方账号绑定
    F.thirdContinue = ndialog;
}());
// 第三方账号绑定后
$.add( 'third.bind', function( e, options ) {
    var retVal = options && options.m || '';
    if ( !retVal ) { return; }
    if ( retVal != '登录成功' ) {
        F.showTip( retVal + ', 请重试' );
        // 如果有第三方授权提示continue按钮，关闭掉
        if ( F.thirdContinue ) {
            F.thirdContinue.close();
        }
    } else {
        // TODO
        window.location.href = '/';
    }
} );