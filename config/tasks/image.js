var gulp    = require( 'gulp' ),
    min     = require( 'gulp-imagemin' ),
    cssmin  = require( 'gulp-cssmin' ),
    base64  = require( 'gulp-css-base64' ),
    spriter = require( 'gulp-css-spriter' ),
    config  = require( '../config.gulp' ).image;
//将图片拷贝到目标目录
gulp.task( 'copy:images', function( done ) {
    gulp.src( [ 'src/images/**/*' ] )
        .pipe( gulp.dest( 'build/images' ) )
        .on( 'end', done );
} );
//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task( 'sprite', [ 'copy:images', 'lessmin' ], function( done ) {
    var timestamp = +new Date();
    gulp.src( 'build/css/style.min.css' )
        .pipe( spriter( {
            spriteSheet              : 'build/images/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS : '../images/spritesheet' + timestamp + '.png',
            spritesmithOptions       : {
                padding : 10
            }
        } ) )
        .pipe( base64() )
        .pipe( cssmin() )
        .pipe( gulp.dest( 'build/css' ) )
        .on( 'end', done );
} );