var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');

//创建任务
gulp.task('minifyjs', function() {
    return gulp.src('build/*.js')
        
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('minified/js'));  //输出
});

//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function(cb) {
    del(['minified/css', 'minified/js'], cb)
});

//默认任务
gulp.task('default', ['clean'], function() {
    gulp.start('minifyjs');
});