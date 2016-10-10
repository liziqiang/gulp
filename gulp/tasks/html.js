var gulp   = require( 'gulp' ),
    pump   = require( 'pump' ),
    config = require( '../config' ).html;
gulp.task( 'Task_Html', function( cb ) {
    pump( [
        gulp.src( config.src ),
        gulp.dest( config.dest )
    ], cb );
} );