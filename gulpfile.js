var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var $ = require('gulp-load-plugins')();

gulp.task('copyHTML', function () {
  return gulp.src('./source/**/*.html')
    .pipe(gulp.dest('./public/'))
});

gulp.task('jade', function() {
 
  return gulp.src('./source/**/*.jade')
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
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
    .pipe(gulp.dest('./public/css/'));
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
});

gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./source/**/*.jade', gulp.series('jade'));
  gulp.watch('./source/**/*.js', gulp.series('babel'));
});

gulp.task('default', 
  gulp.parallel('jade', 'sass', 'babel', 'watch')
);