var gulp   = require( 'gulp' ),
    config = require( '../config' );
// watching file changed
gulp.task( 'watch', function() {
    gulp.watch( config.less.src, [ 'ParseLess' ] );
    gulp.watch( config.javascript.src, [ 'PackJavascript' ] );
} );