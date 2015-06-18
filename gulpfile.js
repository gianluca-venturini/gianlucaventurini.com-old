// gulpfile.js

// --- INIT
var gulp = require('gulp'),
    less = require('gulp-less'),              // compiles less to CSS
    sass = require('gulp-sass'),              // compiles sass to CSS
    minifyCSS = require('gulp-minify-css'),   // minifies CSS
    minifyHTML = require('gulp-minify-html'), // minifies HTML
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),          // minifies JS
    rename = require('gulp-rename'),
    filesize = require('gulp-filesize'),
    changed = require('gulp-changed'),
    util = require('gulp-util');

var path = {
    'dist': {
        css: "./dist/css/",
        vendor: "./dist/bower_vendor/",
        js: "./dist/js/",
        html: "./dist/"
    },
    'src': {
        less: "./src/less/",
        js: "./src/js/",
        html: "./src/*.html"
    }
};

// CSS frontend
gulp.task('frontend.css', function() {
    // place code for your default task here
    return gulp.src(path.src.less+'frontend.less') // get file
        .pipe(less())
        .on('error', swallowError)
        .pipe(gulp.dest(path.dist.css)) // output: frontend.css
        .pipe(minifyCSS({keepSpecialComments:0}))
        .pipe(rename({suffix: '.min'}))
        .on('error', swallowError)
        .pipe(gulp.dest(path.dist.css)); // output: frontend.min.css
});

// JS frontend
gulp.task('frontend.js', function(){
    return gulp.src([
            path.dist.vendor+'jquery/dist/jquery.js',
            path.dist.vendor+'bootstrap/dist/js/bootstrap.js',
            path.src.js+'frontend.js'
        ])
        .pipe(changed(path.dist.js))
        .pipe(uglify())
        .on('error', swallowError)
        .pipe(concat('frontend.min.js'))
        .pipe(gulp.dest(path.dist.js))
        .pipe(filesize());
});

// HTML frontend
gulp.task('frontend.html', function(){
    var opts = {};

    return gulp.src(path.src.html)
        .pipe(minifyHTML(opts))
        .on('error', swallowError)
        .pipe(gulp.dest(path.dist.html));
});

gulp.task('watch', function(){
    gulp.watch(path.src.less+"**/*", ['frontend.css']);
    gulp.watch(path.src.js+"**/*", ['frontend.js']);
    gulp.watch(path.src.html, ['frontend.html']);
});

function swallowError (error) {
    // Errors in console
    //util.log(util.colors.red('Error'), error.toString());
    console.log(error.toString());

    this.emit('end');
}

gulp.task('default', ['frontend.css', 'frontend.js', 'frontend.html', 'watch']);