'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

//css
var scssFiles = './resources/sass/*.scss';

gulp.task('sass', function () {
  return gulp.src(scssFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./resources/sass/**/*.scss', ['sass']);
});

//scripts
var jsFiles = [
    './resources/js/skills/masonry.pkgd.min.js',
    './resources/js/skills/imagesloaded.pkgd.min.js',
    './resources/js/skills/skills.js'
];
var jsDest = './public/assets/js/skills';

gulp.task('scripts', function() {  
    return gulp.src(jsFiles)
        .pipe(concat('skills.js'))
        .pipe(gulp.dest(jsDest)) 
        
    && gulp.src(['./resources/js/master.js'])
        .pipe(concat('master.js'))
        .pipe(gulp.dest('./public/assets/js'))

    && gulp.src(['./resources/js/home/home.js'])
        .pipe(concat('home.js'))
        .pipe(gulp.dest('./public/assets/js/home'));
});

gulp.task('scripts:watch', function () {
  gulp.watch('./resources/js/**/*.js', ['scripts']);
});

gulp.task('watch', function () {
    gulp.start('scripts:watch');
    gulp.start('sass:watch');
});