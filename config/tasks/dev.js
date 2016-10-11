// 开发环境
var gulp = require( 'gulp' );
gulp.task( 'dev', [ 'connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'watch', 'open' ] );