var del, destDest, gulp, imagemin, mainBowerFiles, minifyCss, myLibs, myLibsCssSelector, myLibsJsSelector, plugins, rename, runSequence, srcCssDest, srcCssSelector, srcDest, srcJsDest, srcJsSelector, uglify;

gulp = require('gulp');

del = require('del');

uglify = require('gulp-uglify');

minifyCss = require('gulp-minify-css');

runSequence = require('run-sequence');

mainBowerFiles = require('main-bower-files');

rename = require('gulp-rename');

imagemin = require('gulp-imagemin');

plugins = require("gulp-load-plugins")({
  pattern: ["gulp-*", "gulp.*", "main-bower-files"],
  replaceString: /\bgulp[\-.]/
});

srcDest = "src/";

myLibs = srcDest + "my-libs/";

myLibsJsSelector = [myLibs + '*.js', '!' + myLibs + '*.min.js'];

myLibsCssSelector = [myLibs + '*.css', '!' + myLibs + '*.min.css'];

srcJsSelector = [srcDest + 'js/*.js', '!' + srcDest + 'js/*.min.js'];

srcCssSelector = [srcDest + 'css/*.css', '!' + srcDest + 'css/*.min.css'];

srcJsDest = srcDest + 'js/';

srcCssDest = srcDest + 'css/';

gulp.task('copy-libs:js', function() {
  return gulp.src(plugins.mainBowerFiles()).pipe(plugins.filter('*.js')).pipe(gulp.dest(srcJsDest));
});

gulp.task('copy-libs:css', function() {
  return gulp.src(plugins.mainBowerFiles()).pipe(plugins.filter('*.css')).pipe(gulp.dest(srcCssDest));
});

gulp.task('copy-mylibs:js', function() {
  return gulp.src(myLibsJsSelector).pipe(gulp.dest(srcJsDest));
});

gulp.task('copy-mylibs:css', function() {
  return gulp.src(myLibsCssSelector).pipe(gulp.dest(srcCssDest));
});

gulp.task('minify:js', function() {
  return gulp.src(srcJsSelector).pipe(rename({
    suffix: '.min'
  })).pipe(uglify()).pipe(gulp.dest(srcJsDest));
});

gulp.task('minify:css', function() {
  return gulp.src(srcCssSelector).pipe(rename({
    suffix: '.min'
  })).pipe(minifyCss()).pipe(gulp.dest(srcCssDest));
});

gulp.task('build:clean:src-js', function(cb) {
  return del(srcJsSelector, cb);
});

gulp.task('build:clean:src-css', function(cb) {
  return del(srcCssSelector, cb);
});

gulp.task("watch:my-libs-js", function() {
  return gulp.src(myLibs + "*.js").pipe(rename({
    suffix: '.min'
  })).pipe(uglify()).pipe(gulp.dest(srcJsDest));
});

gulp.task("watch:my-libs-css", function() {
  return gulp.src(myLibs + "*.css").pipe(rename({
    suffix: '.min'
  })).pipe(minifyCss()).pipe(gulp.dest(srcCssDest));
});

gulp.task('watch', function() {
  gulp.watch(myLibs + "*.js", ["watch:my-libs-js"]);
  return gulp.watch(myLibs + "*.css", ["watch:my-libs-css"]);
});

destDest = "dist/";

gulp.task('clean:dist', function(cb) {
  return del([destDest + "/*"], cb);
});

gulp.task('release:mv-src', function() {
  return gulp.src([srcDest + '**/*', "!" + srcDest + 'imgs/**/*']).pipe(gulp.dest(destDest));
});

gulp.task('release:imgs-opt', function() {
  return gulp.src([srcDest + 'imgs/**/*']).pipe(imagemin()).pipe(gulp.dest(destDest + 'imgs/'));
});

gulp.task('copy-libs', ['copy-libs:js', 'copy-libs:css', 'copy-mylibs:js', 'copy-mylibs:css']);

gulp.task('minify', ['minify:js', 'minify:css']);

gulp.task('build:clean', ['build:clean:src-js', 'build:clean:src-css']);

gulp.task('default', function() {
  return console.log('no-op default task');
});

gulp.task('build', function() {
  return runSequence('copy-libs', 'minify', 'build:clean', 'watch');
});

gulp.task('release', function() {
  return runSequence('clean:dist', 'release:mv-src', 'release:imgs-opt');
});