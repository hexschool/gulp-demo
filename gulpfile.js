
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  jade = require('gulp-jade'),
  plumber = require('gulp-plumber');

gulp.task('copyHtml', function(){
  return gulp.src(['./source/**/*.html'])
    .pipe(gulp.dest('./public'));
});

gulp.task('jade', function(){
  return gulp.src(['./source/**/*.jade'])
    .pipe(plumber())
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./public'));
});

gulp.task('sass', function(){
  return gulp.src(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'])
    .pipe(plumber())
    .pipe(sass({outputStyle: 'nested'})
      .on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
})

gulp.task('watch', function(){
  gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass']);
  gulp.watch(['./source/**/*.jade'], ['jade']);
});

gulp.task('default', ['jade', 'sass', 'watch']);
