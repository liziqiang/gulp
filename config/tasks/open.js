var gulp     = require( 'gulp' ),
    os       = require( 'os' ),
    gulpOpen = require( 'gulp-open' );
//mac chrome: "Google chrome",
var browser  = os.platform() === 'linux' ? 'Google chrome' : (os.platform() === 'darwin' ? 'Google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox'));
gulp.task( 'open', function( done ) {
    gulp.src( '' )
        .pipe( gulpOpen( {
            app : browser,
            uri : 'http://localhost:3000/app'
        } ) )
        .on( 'end', done );
} );