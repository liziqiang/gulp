var gulp   = require( 'gulp' ),
    pump   = require( 'pump' ),
    min    = require( 'gulp-imagemin' ),
    config = require( '../config' ).image;
gulp.task( 'Task_Images', function( cb ) {
    pump( [
        gulp.src( config.src ),
        min(),
        gulp.dest( config.dest )
    ], cb );
} );