var gulp   = require( 'gulp' ),
    pump   = require( 'pump' ),
    uglify = require( 'gulp-uglify' ),
    config = require( '../config' ).javascript;
gulp.task( 'Task_Javascript', function( cb ) {
    pump( [
        gulp.src( config.src ),
        uglify(),
        gulp.dest( config.dest )
    ], cb );
} );