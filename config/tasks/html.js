var gulp    = require( 'gulp' ),
    config  = require( '../config.gulp' ).html,
    include = require( 'gulp-file-include' );
//用于在html文件中直接include文件
gulp.task( 'fileinclude', function( done ) {
    gulp.src( [ 'src/app/*.html' ] )
        .pipe( include( {
            prefix   : '@@',
            basepath : '@file'
        } ) )
        .pipe( gulp.dest( 'build/app' ) )
        .on( 'end', done );
    // .pipe(connect.reload())
} );