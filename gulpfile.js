/**
 * @author:huangjin
 * @parameter:
 * @description:gulp自动化工作流配置
 * @Date:2017/10/16
 */

"use strict";

var gulp = require('gulp');
var rename = require("gulp-rename"); // 文件重命名
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var useref = require('gulp-useref');
var babel = require('gulp-babel'); // es6转es5
var sequence = require('gulp-sequence'); // 让gulp任务同步运行
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

var htmlmin = require('gulp-htmlmin'); // 压缩html
var cssnano = require('gulp-cssnano'); // css压缩
var autoprefixer = require('gulp-autoprefixer'); // 自动处理css兼容后缀
var concat = require('gulp-concat'); // js文件合并
var uglify = require('gulp-uglify'); // js混淆
var imagemin = require('gulp-imagemin'); // 图片压缩
var assetRev = require('gulp-asset-rev'); // 给文件添加版本号(MD5)

// 路径配置
var path = {
    input: {
        css: ['./src/*.css'],
        js: ['./src/*.js']
    },
    output: {
        css: './build/',
        js: './build/'
    }
};

// 压缩html
gulp.task('html', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src(path.input.html)
        // .pipe(htmlmin(options))
        .pipe(gulp.dest(path.output.html))
        .pipe(browserSync.reload({ stream: true }));
});

// 处理css
gulp.task('css', function() {
    return gulp.src(path.input.css)
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(assetRev())
        .pipe(gulp.dest(path.output.css))
});

// 合并压缩js
gulp.task('js', function() {
    return gulp.src(path.input.js)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(assetRev())
        .pipe(gulp.dest(path.output.js))
});

// 压缩图片
gulp.task('images', function() {
    return gulp.src(path.input.images)
        .pipe(imagemin())
        // .pipe(assetRev())
        .pipe(gulp.dest(path.output.images))
        .pipe(browserSync.reload({ stream: true }));
});
// 清空目标文件
gulp.task('clean', function() {
    return gulp.src('./dist/*')
        .pipe(clean());
});

// 复制第三方插件
gulp.task('copy', function() {
    return gulp.src(path.input.plugins)
        .pipe(gulp.dest(path.output.plugins))
});

// 本地服务器
gulp.task('serve', ['html', 'css', 'js', 'images'], function() {
    browserSync.init({
        port: 3000,
        server: {
            baseDir: ['./dist']
        }
    });
    //监控文件变化，自动更新
    gulp.watch('./src/**/*', ['html', 'js', 'css', 'images', 'copy']);
});

// 默认任务
gulp.task('default', ['js', 'css']);