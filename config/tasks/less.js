var gulp    = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    less    = require( 'gulp-less' ),
    mini    = require( 'gulp-minify-css' ),
    config  = require( '../config' ).less;
gulp.task( 'Task_Less', function( cb ) {
    return gulp.src( config.src )
               .pipe( plumber() )
               .pipe( less() )
               .pipe( mini() )
               .pipe( gulp.dest( config.dest ) );
} );