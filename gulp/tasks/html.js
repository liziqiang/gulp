var gulp    = require( 'gulp' ),
    plumber = require( 'gulp-plumber' ),
    config  = require( '../config' ).html,
    include = require( 'gulp-file-include' );
gulp.task( 'Task_Html', function( cb ) {
    return gulp.src( config.src )
               .pipe( plumber() )
               .pipe( include() )
               .pipe( gulp.dest( config.dest ) );
} );