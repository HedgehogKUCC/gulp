var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');

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
  return gulp.src('./source/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./source/**/*.jade', gulp.series('jade'));
});

gulp.task('default', 
  gulp.parallel('jade', 'sass', 'watch')
);