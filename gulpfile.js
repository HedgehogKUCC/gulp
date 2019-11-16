var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var $ = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();

gulp.task('copyHTML', function () {
  return gulp.src('./source/**/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('jade', function() {
 
  return gulp.src('./source/**/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {

  // var plugins = [
  //   autoprefixer({ overrideBrowserslist: [ 'last 3 version', '> 5%', 'ie 6-8' ] })
  // ];

  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    // 編譯完成 CSS

    // .pipe(postcss(plugins))
    .pipe($.postcss( [autoprefixer()] ))  // 直接引入 autoprefixer
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.stream());
});

gulp.task('babel', () => {
  return gulp.src('./source/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js/'))
    .pipe(browserSync.stream());
});

gulp.task('bower', function() {
  return gulp.src(mainBowerFiles())
      .pipe(gulp.dest('./.tmp/vendors'))
});

gulp.task('vendorJs', () => {
  return gulp.src([
    './.tmp/vendors/**/*.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  ])
  .pipe($.order([
    'jquery.js',
    'bootstrap.js'
  ]))
  .pipe($.concat('vendors.js'))
  .pipe(gulp.dest('./public/js/'));
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./public"
      }
  });
  gulp.watch("./source/scss/**/*.scss", gulp.series('sass'));
  gulp.watch('./source/**/*.js', gulp.series('babel'));
  gulp.watch("./source/**/*.jade").on('change', browserSync.reload);
});

gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./source/**/*.jade', gulp.series('jade'));
  gulp.watch('./source/**/*.js', gulp.series('babel'));
});

gulp.task('default', 
  // gulp.series('jade', 'sass', 'babel', 'bower','vendorJs', 'browser-sync', 'watch')
  gulp.series('jade', 'sass', 'babel', 'bower','vendorJs', 'browser-sync')
);