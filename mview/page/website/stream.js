function setupStreamPlayer() {
    var player, curVideoId, curShareVid, $hotPlayer = $( '#hot-player' );

    function hotPlayerRender() {
        var eventType      = 'click';
        var playerSelector = '.j-stream-player-wrap';
        $hotPlayer = $( '#hot-player' );
        if ( !$hotPlayer.length ) {
            if ( player ) {
                player.dispose();
            }
            $( document ).off( F.EventCenter.CLICK, playerSelector, hotClickHandler );
            return;
        }
        curVideoId = 0;
        player     = new F.html5video( {
            renderTo : $hotPlayer,
            type     : 'video',
            videoid  : '',
            startAd  : 0, //是否播广告
            cls      : 'hot-player'
        } );
        $( document )
        .off( eventType, playerSelector, hotClickHandler )
        .on( eventType, playerSelector, hotClickHandler );
        $( '.j-share-toggle' )
        .off( F.EventCenter.CLICK, shareClickHandler )
        .on( F.EventCenter.CLICK, shareClickHandler );
        if ( F.platform.isWeChat ) {
            hotClickHandler();
        } //微信自动播放第一个
        // TODO: 联播
        $( player ).on( F.EventCenter.PLAYER_END, function() { toggleDuration( true ); } );
    }

    function shareClickHandler() {
        var info = $( this ).parents( '[data-hot-info]' ).data( 'hot-info' );
        info.mid = info.mid || info.id;
        if ( !info || info.mid == curShareVid ) {
            return;
        }
        window.shareInfo = {
            url   : 'http://www.fun.tv/vplay/v-' + info.mid,
            title : info.name,
            img   : info.still
        };
        F.updateWxShare();
        curShareVid = info.mid;
    }

    function hotClickHandler( e ) {
        var $this = $( e ? $( this ).parents( '[data-hot-info]' ) : $( '[data-hot-info]' )[ 0 ] );
        var $wrap = $this.find( '.j-stream-player-wrap' );
        var info  = $this.data( 'hot-info' );
        info.mid  = info.mid || info.id;
        if ( !info || info.mid == curVideoId ) {
            toggleDuration();
            return;
        }
        $hotPlayer.appendTo( $wrap ).show();
        curVideoId = info.mid;
        playVideo( e, info );
    }

    function playVideo( ev, info ) {
        if ( ev ) {
            player.triggerPlay();
        }
        player.playNewVideo( {
            playUrl : '/vplay/?vid=' + info.mid,
            title   : info.name,
            poster  : info.still,
            videoid : curVideoId
        } );
        toggleDuration();
    }

    function toggleDuration( onTop ) {
        if ( onTop ) {
            $hotPlayer.parent().find( '.r-sd' ).addClass( 'top' );
        } else {
            $hotPlayer.parent().find( '.r-sd' ).removeClass( 'top' );
        }
    }

    window.scrollTo( 0, 0 );
    hotPlayerRender();
    $.add( F.EventCenter.PAGE_REFRESH, hotPlayerRender );
}