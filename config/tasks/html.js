var gulp    = require( 'gulp' ),
    config  = require( '../config.gulp' ).html,
    include = require( 'gulp-file-include' );
//用于在html文件中直接include文件
gulp.task( 'fileinclude', function( done ) {
    gulp.src( config.src )
        .pipe( include( {
            prefix   : '@@',
            basepath : '@file'
        } ) )
        .pipe( gulp.dest( config.dest ) )
        .on( 'end', done );
    // .pipe(connect.reload())
} );