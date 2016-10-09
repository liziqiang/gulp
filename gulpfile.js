//noinspection JSUnresolvedFunction
var gulp = require( 'gulp' ),
    pump = require( 'pump' ),
    $    = require( 'gulp-load-plugins' )();
// parsing less files
gulp.task( 'ParseLess', function( cb ) {
    pump( [
        gulp.src( 'mview/**/*.less' ),
        $.less(),
        gulp.dest( 'src/static/css' )
    ], cb );
} );
// packing javascript files
gulp.task( 'PackJavascript', function( cb ) {
    pump( [
        gulp.src( 'mview/**/*.js' ),
        $.uglify(),
        gulp.dest( 'src/static/js' )
    ], cb );
} );
gulp.task( 'watch', function() {
    gulp.watch( 'mview/**/*.less', [ 'ParseLess' ] );
} );
gulp.task( 'default', [ 'ParseLess', 'PackJavascript', 'watch' ] );