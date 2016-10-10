var gulp    = require( 'gulp' ),
    pump    = require( 'pump' ),
    config  = require( '../config' ).html,
    include = require( 'gulp-file-include' );
gulp.task( 'Task_Html', function( cb ) {
    pump( [
        gulp.src( config.src ),
        include(),
        gulp.dest( config.dest )
    ], cb );
} );