var gulp    = require( 'gulp' ),
    host    = { path : 'build/', port : 3000, html : 'index.html' },
    connect = require( 'gulp-connect' );
gulp.task( 'connect', function() {
    console.log( 'connect------------' );
    connect.server( {
        root       : host.path,
        port       : host.port,
        livereload : true
    } );
} );