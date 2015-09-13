var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var css2js = require("gulp-css2js");
var minifyHtml = require("gulp-minify-html");
var ngHtml2Js = require("gulp-ng-html2js");
var uglify = require('gulp-uglify');

gulp.task('html2js', function () {
    return gulp.src(['./src/templates/*.html'])
        .pipe(minifyHtml())
        .pipe(ngHtml2Js({
            moduleName: "onezone-calendar.templates"
        }))
        .pipe(concat("templates.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});

gulp.task('default', function () {});