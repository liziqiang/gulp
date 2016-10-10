var gulp   = require( 'gulp' ),
    pump   = require( 'pump' ),
    less   = require( 'gulp-less' ),
    config = require( '../config' ).less;
gulp.task( 'ParseLess', function( cb ) {
    pump( [
        gulp.src( config.src ),
        less(),
        gulp.dest( config.dest )
    ], cb );
} );