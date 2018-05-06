'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');

gulp.task("concatScripts", function(){//define a task with the name as 1st param

	gulp.src([  //can take array or string of file names
		"js/jquery.js",
		"js/sticky/jquery.sticky.js", //depends on jquery
		"js/main.js"]) //depends on jquery, so it needs to be loaded last
		.pipe(concat("app.js"))//.pipe sends a readable stream of data to our concat task //piping lets you send things between programs ie: Node to JS(assembly)
		.pipe(gulp.dest("js")); //gulp.dest method takes the readable string of data and persists it to disk
});


//minification speeds up load times, and it can sometimes rename variables for optimization
gulp.task("minifyScripts", function(){
	gulp.src("js/app.js")
		.pipe(uglify())
		.pipe(rename("app.min.js")) //use gulp-rename to not overwrite app.js
		.pipe(gulp.dest("js")); //gulp won't overwrite files when the file stream is output using gulp.dest
});

//compiling sass isn't hard, but it's time consuming to do every time you make a change. Gulp can automate this.
//maps help define where the source of elements is in the project come from, so instead of just having 'css/application.css', it will break it down in dev tools to css/base/..., css/application.css, css/application.scss, etc."
gulp.task('compileSass', function(){
	//this file is importing other scss (sass) files, which are themselves importing the actual source scss files. This is good modular practice.
	gulp.src("scss/application.scss")
		.pipe(maps.init()) //gets piped to sass method, where the sass is actually compiled
		.pipe(sass())
		.pipe(maps.write("./")) //relative to our output directory, which is css (given below)
		.pipe(gulp.dest("css"));
});





//SourceMaps ->


//smaller, module code is easier to maintain when you work on larger projects or larger teams
//
// gulp.task("default", ["hello"], function(){ //hello task is a dependency, so it will run before the default task, which is the body
// 	console.log("Hello, Gulp! This is the Default Task!");
// });