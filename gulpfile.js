// gulpfile.js

// --- INIT
var gulp = require('gulp'),
    less = require('gulp-less'), // compiles less to CSS
    sass = require('gulp-sass'), // compiles sass to CSS
    minify = require('gulp-minify-css'), // minifies CSS
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'), // minifies JS
    rename = require('gulp-rename'),
    phpunit = require('gulp-phpunit');

var path = {
    'dist': {
        css: "./dist/css/",
        vendor: "./dist/bower_vendor/",
        js: "./dist/js/"
    },
    'src': {
        less: "./src/less/",
        js: "./src/js/"
    }
};

// CSS frontend
gulp.task('frontend.css', function() {
    // place code for your default task here
    return gulp.src(path.src.less+'frontend.less') // get file
        .pipe(less())
        .pipe(gulp.dest(path.dist.css)) // output: frontend.css
        .pipe(minify({keepSpecialComments:0}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.dist.css)); // output: frontend.min.css
});

// JS frontend
gulp.task('frontend.js', function(){
    return gulp.src([
            path.dist.vendor+'jquery/dist/jquery.js',
            path.dist.vendor+'bootstrap/dist/js/bootstrap.js',
            path.src.js+'frontend.js'
        ])
        .pipe(concat('frontend.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('watch', function(){
    gulp.watch(path.src.less+"*", ['frontend.css']);
    gulp.watch(path.src.js+"*", ['frontend.js']);
});

gulp.task('default', ['frontend.css', 'frontend.js', 'watch']);