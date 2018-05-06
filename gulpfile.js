'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

//define a task with the name as 1st param
gulp.task("concatScripts", function(){
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
		.pipe(gulp.dest("js"));
});



//
//
// gulp.task("default", ["hello"], function(){ //hello task is a dependency, so it will run before the default task, which is the body
// 	console.log("Hello, Gulp! This is the Default Task!");
// });