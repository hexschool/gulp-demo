
var gulp = require('gulp');
var $ = require('gulp-load-plugins')(),
    mainBowerFiles = require('main-bower-files'),
    browserSync = require('browser-sync'),
    autoprefixer = require('autoprefixer');
var minimist = require('minimist'); // 用來讀取指令轉成變數
var gulpSequence = require('gulp-sequence').use(gulp);

// production || development
// # gulp --env production
var envOptions = {
  string: 'env',
  default: { env: 'development' }
};
var options = minimist(process.argv.slice(2), envOptions);
console.log(options);

gulp.task('clean', function () {
  return gulp.src(['./public', './.tmp'], {read: false}) // 選項讀取：false阻止gulp讀取文件的內容，使此任務更快。
    .pipe($.clean());
    cb(err)
});

gulp.task('jade', function(){
  return gulp.src(['./source/**/*.jade'])
    .pipe($.plumber())
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('babel', function(){
  return gulp.src(['./source/javascripts/**/*.js'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.concat('all.js'))
    .pipe($.babel({
        presets: ['es2015']
      }))
    .pipe(
      $.if(options.env === 'production', $.uglify({
        compress: {
          drop_console: true
          }
        })
      )
    )
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/javascripts'))
    .pipe(browserSync.reload({
      stream: true
    }));;
});

gulp.task('bower', function() {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('./.tmp/vendors'));
    cb(err);
});
gulp.task('vendorJs', ['bower'], function(){
  return gulp.src(['./.tmp/vendors/**/**.js'])
    .pipe($.concat('vendor.js'))
    .pipe( $.if(options.env === 'production', $.uglify()) )
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
    .pipe( $.sourcemaps.init())
    .pipe($.sass({outputStyle: 'nested'})
      .on('error', $.sass.logError))
    .pipe($.postcss(processors))
    .pipe( $.if(options.env === 'production', $.minifyCss()) ) // 假設開發環境則壓縮 CSS
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/stylesheets'))
    .pipe(browserSync.reload({
      stream: true
    }));;
});

gulp.task('imageMin', function(){
  gulp.src('./source/images/*')
    .pipe( $.if(options.env === 'production', $.imagemin()) )
    .pipe(gulp.dest('./public/images'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: { baseDir: './public' }
  })
});

gulp.task('watch', function(){
  gulp.watch(['./source/stylesheets/**/*.sass', './source/stylesheets/**/*.scss'], ['sass']);
  gulp.watch(['./source/**/*.jade'], ['jade']);
  gulp.watch(['./source/javascripts/**/*.js'], ['babel']);
});

gulp.task('sequence',  gulpSequence('clean', 'jade', 'sass', 'babel', 'vendorJs', 'imageMin'));

gulp.task('default', ['jade', 'sass', 'babel', 'vendorJs', 'browserSync', 'imageMin', 'watch']);
gulp.task('build', ['sequence'])