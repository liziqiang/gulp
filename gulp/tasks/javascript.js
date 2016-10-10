var gulp    = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    uglify  = require( 'gulp-uglify' ),
    config  = require( '../config' ).javascript;
gulp.task( 'Task_Javascript', function( cb ) {
    return gulp.src( config.src )
               .pipe( plumber() )
               .pipe( uglify() )
               .pipe( gulp.dest( config.dest ) );
} );