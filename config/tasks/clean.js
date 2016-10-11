var gulp  = require( 'gulp' ),
    clean = require( 'gulp-clean' );
gulp.task( 'clean', function( done ) {
    gulp.src( [ 'build' ] )
        .pipe( clean() )
        .on( 'end', done );
} );