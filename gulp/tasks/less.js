var gulp   = require( 'gulp' ),
    pump   = require( 'pump' ),
    less   = require( 'gulp-less' ),
    mini   = require( 'gulp-minify-css' ),
    config = require( '../config' ).less;
gulp.task( 'Task_Less', function( cb ) {
    pump( [
        gulp.src( config.src ),
        less(),
        mini(),
        gulp.dest( config.dest )
    ], cb );
} );