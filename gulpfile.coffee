# Load all required libraries
gulp           = require 'gulp'
del            = require 'del'
uglify         = require 'gulp-uglify'
minifyCss      = require 'gulp-minify-css'
runSequence    = require 'run-sequence'
mainBowerFiles = require 'main-bower-files'
rename         = require 'gulp-rename' 
imagemin       = require 'gulp-imagemin'
plugins        = require("gulp-load-plugins")(
  pattern: [
    "gulp-*"
    "gulp.*"
    "main-bower-files"
  ]
  replaceString: /\bgulp[\-.]/
)

# source code destination
srcDest        = "src/"
myLibs         = srcDest + "my-libs/"
myLibsJsSelector = [myLibs + '*.js', '!' + myLibs + '*.min.js']
myLibsCssSelector = [myLibs + '*.css', '!' + myLibs + '*.min.css']
srcJsSelector  = [srcDest + 'js/*.js', '!' + srcDest + 'js/*.min.js']
srcCssSelector = [srcDest + 'css/*.css', '!' + srcDest + 'css/*.min.css']
srcJsDest = srcDest + 'js/'
srcCssDest = srcDest + 'css/'

# copy the dependencies js/css and my js/css to js/css folder
gulp.task 'copy-libs:js', ->
    gulp.src plugins.mainBowerFiles()
        .pipe plugins.filter('*.js')
        .pipe gulp.dest srcJsDest

gulp.task 'copy-libs:css', ->
    gulp.src plugins.mainBowerFiles()
        .pipe plugins.filter('*.css')
        .pipe gulp.dest srcCssDest

gulp.task 'copy-mylibs:js', ->
    gulp.src myLibsJsSelector
        .pipe gulp.dest srcJsDest

gulp.task 'copy-mylibs:css', ->
    gulp.src myLibsCssSelector
        .pipe gulp.dest srcCssDest

gulp.task 'minify:js', ->
    gulp.src srcJsSelector
        .pipe rename({suffix: '.min'})
        .pipe uglify()
        .pipe gulp.dest srcJsDest

gulp.task 'minify:css', ->
    gulp.src srcCssSelector
        .pipe rename({suffix: '.min'})
        .pipe minifyCss()   
        .pipe gulp.dest srcCssDest

gulp.task 'build:clean:src-js', (cb) ->
    del srcJsSelector, cb 

gulp.task 'build:clean:src-css', (cb) ->
    del srcCssSelector, cb

#
# Watch
#

gulp.task "watch:my-libs-js", ->
    gulp.src myLibs + "*.js"
        .pipe rename({suffix: '.min'})
        .pipe uglify()
        .pipe gulp.dest srcJsDest
gulp.task "watch:my-libs-css", ->
    gulp.src myLibs + "*.css"
        .pipe rename({suffix: '.min'})
        .pipe minifyCss()
        .pipe gulp.dest srcCssDest
gulp.task 'watch', -> 
    gulp.watch myLibs + "*.js", ["watch:my-libs-js"]
    gulp.watch myLibs + "*.css", ["watch:my-libs-css"]



#
# Release
#
destDest    =  "dist/"

gulp.task 'clean:dist', (cb) ->
    del [ destDest + "/*" ], cb

gulp.task 'release:mv-src', ->
    gulp.src [srcDest + '**/*', "!" + srcDest + 'imgs/**/*']
        .pipe gulp.dest destDest

gulp.task 'release:imgs-opt', ->
    gulp.src [srcDest + 'imgs/**/*']
        .pipe imagemin()
        .pipe gulp.dest destDest + 'imgs/'


gulp.task 'copy-libs', ['copy-libs:js', 'copy-libs:css', 'copy-mylibs:js', 'copy-mylibs:css']
gulp.task 'minify', ['minify:js', 'minify:css']
gulp.task 'build:clean', ['build:clean:src-js', 'build:clean:src-css']

# Main tasks
gulp.task 'default', -> console.log 'no-op default task'
# gulp.task 'build', runSequence 'copy-libs:js', 'copy-libs:css', 'minify:js', 'minify:css', 'clean:js', 'clean:css'
gulp.task 'build', -> runSequence 'copy-libs', 'minify', 'build:clean', 'watch'
gulp.task 'release', -> runSequence 'clean:dist', 'release:mv-src' , 'release:imgs-opt'