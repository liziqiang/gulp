var gulp   = require( 'gulp' ),
    less   = require( 'gulp-less' ),
    concat = require( 'gulp-concat' ),
    config = require( '../config.gulp' ).css;
console.log( '===================', config )
//压缩合并css, css中既有自己写的.less, 也有引入第三方库的.css
gulp.task( 'lessmin', function( done ) {
    gulp.src( [ 'src/css/main.less', 'src/css/*.css' ] )
        .pipe( less() )
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        //.pipe(spriter({}))
        .pipe( concat( 'style.min.css' ) )
        .pipe( gulp.dest( config.dest ) )
        .on( 'end', done );
} );