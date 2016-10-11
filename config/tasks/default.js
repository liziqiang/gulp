// 正式环境
var gulp = require( 'gulp' );
gulp.task( 'default', [ 'connect', 'fileinclude', 'md5:css', 'md5:js', 'open' ] );