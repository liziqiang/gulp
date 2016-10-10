var gulp   = require( 'gulp' ),
    config = require( '../config' );
gulp.task( 'Task_Watch', function() {
    gulp.watch( config.less.src, [ 'Task_Less' ] );
    gulp.watch( config.javascript.src, [ 'Task_Javascript' ] );
} );