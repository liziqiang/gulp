var gulp    = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    min     = require( 'gulp-imagemin' ),
    config  = require( '../config' ).image;
gulp.task( 'Task_Images', function( cb ) {
    return gulp.src( config.src )
               .pipe( plumber() )
               .pipe( min() )
               .pipe( gulp.dest( config.dest ) );
} );