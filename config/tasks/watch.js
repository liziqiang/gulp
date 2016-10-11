var gulp   = require( 'gulp' ),
    config = require( '../config.gulp' );
gulp.task( 'watch', function( done ) {
    gulp.watch( 'src/**/*', [ 'lessmin', 'build-js', 'fileinclude' ] ).on( 'end', done );
} );