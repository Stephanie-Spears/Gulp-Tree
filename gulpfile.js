'use strict'; //strict javascript rules, stronger security

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');


//define a task with the name as 1st param
//can take array or string of file names, and load order matters for dependency (ie. jQuery needs to be before jQuery.sticky)
gulp.task("concatScripts", function(){
	return gulp.src([ //Explicitly return the stream it's creating. Works like a promise -> without the return statement, other tasks won't know when it finishes so they'll start right away without waiting for it to finish
		"js/jquery.js",
		"js/sticky/jquery.sticky.js",
		"js/main.js"])
		.pipe(maps.init())
		.pipe(concat("app.js"))//.pipe sends a readable stream of data to our concat task //piping lets you send things between programs ie: Node to JS(assembly)
		.pipe(maps.write("./")) //put it in the directory relative to the one given below
		.pipe(gulp.dest("js")); //gulp.dest method takes the readable string of data and persists it to disk
});


//minification speeds up load times, and it can sometimes rename variables for optimization
gulp.task("minifyScripts", ["concatScripts"], function(){ //adding concatScripts here makes it a dependency of minifyScripts and ensures it will run first
	return gulp.src("js/app.js")
		.pipe(uglify())
		.pipe(rename("app.min.js")) //use gulp-rename to not overwrite app.js
		.pipe(gulp.dest("js")); //gulp won't overwrite files when the file stream is output using gulp.dest
});

//compiling sass isn't hard, but it's time consuming to do every time you make a change. Gulp can automate this.
//SourceMaps -> maps help define where the source of elements is in the project come from, so instead of just having 'css/application.css', it will break it down in dev tools to css/base/..., css/application.css, css/application.scss, etc."
//for JS it can show which file a bug comes from, making them easier to track down. (ie. compiled line bug: 1003 vs mapped bug: 25)
//application.scss file is importing other scss (sass) files, which are themselves importing the actual source scss files. This is good modular practice.
gulp.task('compileSass', function(){
	return gulp.src("scss/application.scss")
		.pipe(maps.init()) //gets piped to sass method, where the sass is actually compiled
		.pipe(sass())
		.pipe(maps.write("./")) //relative to our output directory, given below
		.pipe(gulp.dest("css"));
});


gulp.task('watchFiles', function(){
	//doesn't need a return statement in callback because no other tasks depend on it
	gulp.watch("scss/**/*.scss", ["compileSass"]) //both parameters can be string or array of strings
	gulp.watch("js/main.js", ["concatScripts"]);
});


gulp.task("clean", function(){
	del(["dist", "css/application.css*", "js/app*.js*"]); //"globbing patterns"-> regex
});


gulp.task("build", ['minifyScripts', 'compileSass'], function(){
	return gulp.src(["css/application.css", "js/app.min.js", "index.html", "img/**", "fonts/**"], { base: "./"}) //The gulp.source method has a base option, that allows you to preserve the directory structure of the files you are introducing to the stream, relative to destination given below
		.pipe(gulp.dest('dist'));
}); //default is to run concurrently, must specify in the tasks themselves what dependencies they have


gulp.task("serve", ["watchFiles"]);


gulp.task("serveprod", function(){
	connect.server({
		root: [dist],
		port: process.env.PORT || 3000,
		livereload: false
	});
});


gulp.task("default", ["clean"], function(){
	gulp.start("build"); //once the clean dependency runs, the build task will run
});


//development tasks are iterative -> fine tuning the application, (recompiling only the parts that have changed and restarting the app)
//production tasks are for compiling and optimizing->build and deployment (minification and file concatenation)