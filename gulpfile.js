
var gulp = require('gulp');
var $ = require('gulp-load-plugins')(),
    mainBowerFiles = require('main-bower-files'),
    autoprefixer = require('autoprefixer');

gulp.task('copyHtml', function(){
  return gulp.src(['./source/**/*.html'])
    .pipe(gulp.dest('./public'));
});

gulp.task('jade', function(){
  return gulp.src(['./source/**/*.jade'])
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest('./public'));
});

gulp.task('babel', function(){
  return gulp.src(['./source/javascripts/**/*.js'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.concat('all.js'))
    .pipe($.babel({
        presets: ['es2015']
      }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/javascripts'));
});

gulp.task('bower', function() {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./public/vendors'));
    cb(err);
});
gulp.task('vendorJs', ['bower'], function(){
  return gulp.src(['./public/vendors/**/**.js'])
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest('./public/javascripts'))
})

gulp.task('sass', function(){
  // PostCSS AutoPrefixer
  var processors = [
    autoprefixer({
      browsers: ['last 5 version'],
    })
  ];

  return gulp.src(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({outputStyle: 'nested'})
      .on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('watch', function(){
  gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass']);
  gulp.watch(['./source/**/*.jade'], ['jade']);
  gulp.watch(['./source/javascripts/**/*.js'], ['babel']);
});

gulp.task('default', ['jade', 'sass', 'babel', 'vendorJs', 'watch']);
