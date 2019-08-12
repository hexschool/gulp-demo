const gulp = require('gulp');
const mainBowerFiles = require('main-bower-files');
const $ = require('gulp-load-plugins')();

const { options } = require('./options');

// 模組的製作
// task 改成一般的函式寫法，內容與原本的 gulp task 無異
// 用意只在於可以被匯出

const bowerTask = function(cb) {
  gulp.src(mainBowerFiles()).pipe(gulp.dest('./.tmp/vendors'));
  cb();
};

const vendorJs = function(cb) {
  gulp
    .src([
      './.tmp/vendors/**/**.js',
      './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    ])
    .pipe($.order(['jquery.js']))
    .pipe($.concat('vendor.js'))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest('./public/javascripts'));
  cb();
};

exports.bowerTask = bowerTask;
exports.vendorJs = vendorJs;
