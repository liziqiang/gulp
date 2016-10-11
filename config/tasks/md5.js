var gulp = require( 'gulp' ),
    md5  = require( 'gulp-md5-plus' );
//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task( 'md5:js', [ 'build-js' ], function( cb ) {
    gulp.src( 'build/js/*.js' )
        .pipe( md5( 10, 'build/app/*.html' ) )
        .pipe( gulp.dest( 'build/js' ) )
        .on( 'end', cb );
} );
//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task( 'md5:css', [ 'sprite' ], function( cb ) {
    gulp.src( 'build/css/*.css' )
        .pipe( md5( 10, 'build/app/*.html' ) )
        .pipe( gulp.dest( 'build/css' ) )
        .on( 'end', cb );
} );