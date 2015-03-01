var gulp = require('gulp');
var applyTemplate = require('gulp-apply-template');
var rename = require('gulp-rename');
var data = require('gulp-data');
var path = require('path');
var exec = require('child_process').exec;
// var debug = require('gulp-debug');

var pagesPath = 'src/[0-9].[0-9]/{tutorials,examples,snippets,static}/';

gulp.task('clean', function(cb){
	var del = require('del');
	del(['0.0/*'],cb);
});

// just copy html over
gulp.task('build:html', function(){
	return gulp
		.src(pagesPath + '*.html')
		.pipe(gulp.dest('.'));
});

gulp.task('build:md', function () {
	var marked = require('gulp-marked');
	var highlight = require('highlight.js');
	var frontMatter = require('gulp-front-matter');

	return gulp.src(pagesPath + '*.md')
		.pipe(frontMatter({remove:true, property:'data'})) 		// set front matter into data
		.pipe(data(function(file){								// set basename into data
			return {
				basename:path.basename(file.path,'.md'), // file name
				dirname: path.dirname(file.path).match(/[^\/]*$/)[0] // only the last segment of the dirname
			};
		}))
		.pipe(marked({											// highlight pre
			highlight: function(code){
				return highlight.highlightAuto(code).value;
			}
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			return path.join(path.dirname(file.path), '../templates','md.swig');
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));
});

gulp.task('build:swig', function(){
	return gulp.src(pagesPath + '*.swig')
		.pipe(data(function(file){								// set basename into data
			return {
				basename:path.basename(file.path,'.md'), // file name
				dirname: path.dirname(file.path).match(/[^\/]*$/)[0] // only the last segment of the dirname
			};
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			return file.path;
		}}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest('.'));
});

gulp.task('build:js', function(){
	var es = require('event-stream');
	var clone = require('gulp-clone');
	var docco = require('docco');

	// add scripts to stream
	var scripts = gulp.src(pagesPath + '*.js');

	// add activation pages
	var playPages = scripts
		.pipe(clone())
		.pipe(data(function(file){
			return {
				filepath: file.path,
				basename: path.basename(file.path,'.js'),
				dirname: path.dirname(file.path).match(/[^\/]*$/)[0] // only the last segment of the dirname
			};
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context, file){
			context.url = file.path.match(/[^\/]+\/[^\/]+$/)[0];
			return path.join(path.dirname(file.path), '../templates', 'play.swig');
		}}))
		.pipe(rename({suffix:'Play',extname: '.html'}));

	// add docco pages
	var doccoPages = scripts
		.pipe(clone())
		.pipe(data(function(file){
			// use config instead of the global languages object.
			// we set the comment matcher and filter manually in order to bypass the config function of docco which uses explicit files
			var config = {
				languages: {
					".js": {name: "javascript",symbol: "//",commentMatcher : new RegExp("^\\s*//\\s?"),commentFilter : /(^#![/]|^\s*#\{)/}
				}
			};

			// Docco
			var sections = docco.parse(file.path, file.contents.toString('utf8'), config);
			docco.format(file.path, sections, config); // Format (adds highlighting to the sections object)

			return {
				sections: sections,
				basename: path.basename(file.path,'.js'),
				dirname: path.dirname(file.path).match(/[^\/]*$/)[0] // only the last segment of the dirname
			};
		}))
		.pipe(applyTemplate({engine:'swig', template: function(context,file){
			// context.frontMatter = file.frontMatter;
			// context.basename = path.basename(file.path,'.html');
			return path.join(path.dirname(file.path), '../templates','docco.swig');
		}}))
		.pipe(rename({suffix:'Docco',extname: '.html'}));


	return es.merge(scripts, playPages, doccoPages).pipe(gulp.dest('.'));
});

gulp.task('build:css', function(){
	var sass = require('gulp-sass');
	return gulp.src('src/**/*.scss')
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest('.'));
});

gulp.task('build',  ['build:js', 'build:md', 'build:css', 'build:swig','build:html']);

gulp.task('deploy', function(cb){
	exec('scripts/deploy.sh', function(){
		gulp.run('build', cb);
	});
});

gulp.task('watch', function(){
	gulp.watch(['src/**/*'], ['build']);
});

gulp.task('default', ['build']);