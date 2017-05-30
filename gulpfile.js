'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var minifyCSS = require('gulp-minify-css');

//css
gulp.task('sass', function () {
  return gulp.src('./resources/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/assets/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./resources/sass/**/*.scss', ['sass']);
});

//scripts
var javascriptFiles = [
    {
        'outputPath': './public/assets/js',
        'outputName': 'vendor.js',
        'inputFiles': [
            './node_modules/vue/dist/vue.min.js',
            './node_modules/vue-resource/dist/vue-resource.min.js',
            './node_modules/jquery/dist/jquery.min.js'
        ]
    },
    {
        'outputPath': './public/assets/js',
        'outputName': 'master.js',
        'inputFiles': [
            './resources/js/master.js',
            './resources/js/utils/swipe.js',
            './resources/js/utils/serviceworker.js'
        ]
    },
    {
        'outputPath': './public/assets/js',
        'outputName': 'skills.js',
        'inputFiles': [
            './resources/js/skills/masonry.pkgd.min.js',
            './resources/js/skills/imagesloaded.pkgd.min.js',
            './resources/js/skills/skills.js'
        ]
    },
    {
        'outputPath': './public/assets/js',
        'outputName': 'home.js',
        'inputFiles': [
            './resources/js/home/home.js',
        ]
    },
    {
        'outputPath': './public/assets/js',
        'outputName': 'contact.js',
        'inputFiles': [
            './resources/js/contact/contact.js'
        ]
    },
    {
        'outputPath': './public/',
        'outputName': 'serviceworker.js',
        'inputFiles': [
            './resources/js/serviceworker/serviceworker.js'
        ]
    }
];

gulp.task('scripts', function() {
    let output;
    javascriptFiles.forEach((javascriptFile) => {
        let pipeline = gulp
            .src(javascriptFile.inputFiles)
            .pipe(concat(javascriptFile.outputName))
            .pipe(minify({
                ext: {
                    min: '.js'
                },
                noSource: true
            }))
            .pipe(gulp.dest(javascriptFile.outputPath));
    
        if (output === undefined) {
            output = pipeline;
        } else {
            output = output && pipeline;
        }
    });
    return output;
});

gulp.task('scripts:watch', function () {
  gulp.watch('./resources/js/**/*.js', ['scripts']);
});

gulp.task('watch', function () {
    gulp.start('scripts');
    gulp.start('sass');
    gulp.start('scripts:watch');
    gulp.start('sass:watch');
});