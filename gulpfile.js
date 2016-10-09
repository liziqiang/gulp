//noinspection JSUnresolvedFunction
var gulp = require( 'gulp' ),
    pump = require( 'pump' ),
    $    = require( 'gulp-load-plugins' )();
// parsing less files
gulp.task( 'ParsingLess', function( cb ) {
    pump( [
        gulp.src( 'mview/**/*.less' ),
        $.less(),
        gulp.dest( 'src/static/css' )
    ], cb );
} );
gulp.task( 'watch', function() {
    gulp.watch( 'mview/**/*.less', [ 'ParsingLess' ] );
} );
gulp.task( 'default', [ 'ParsingLess', 'watch' ] );