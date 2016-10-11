var gulp          = require( 'gulp' ),
    util          = require( 'gulp-util' ),
    config        = require( '../config.gulp' ).javascript,
    webpack       = require( 'webpack' ),
    webpackConfig = require( '../config.webpack.js' ),
    myDevConfig   = Object.create( webpackConfig ),
    devCompiler   = webpack( myDevConfig );
//引用webpack对js进行操作
gulp.task( "build-js", [ 'fileinclude' ], function( callback ) {
    devCompiler.run( function( err, stats ) {
        if ( err ) {
            throw new util.PluginError( "webpack:build-js", err );
        }
        util.log( "[webpack:build-js]", stats.toString( {
            colors : true
        } ) );
        callback();
    } );
} );