var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

gulp.task('copyHTML', function () {
  return gulp.src('./source/**/*.html')
    .pipe(gulp.dest('./public/'))
});

gulp.task('jade', function() {
 
  return gulp.src('./source/**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/'))
});

gulp.task('sass', function () {

  // var plugins = [
  //   autoprefixer({ overrideBrowserslist: [ 'last 3 version', '> 5%', 'ie 6-8' ] })
  // ];

  return gulp.src('./source/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    // 編譯完成 CSS

    // .pipe(postcss(plugins))
    .pipe(postcss( [autoprefixer()] ))  // 直接引入 autoprefixer
    
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./source/**/*.jade', gulp.series('jade'));
});

gulp.task('default', 
  gulp.parallel('jade', 'sass', 'watch')
);