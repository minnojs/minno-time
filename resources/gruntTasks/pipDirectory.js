/*
 * Grunt task for displaying PIP directories
 */

var path = require('path');
var jade = require('jade');
var md = require('marked');
var fs = require('fs');

module.exports = function(grunt){
	// create template()
	var tplPath = path.resolve(__dirname + '/../templates/pipDirectory.jade');
	var tplSrc = grunt.file.read(tplPath);
	var template = jade.compile(tplSrc,{
		filename: tplPath
	});

	grunt.registerMultiTask('pipDirectory','Creating indexes',function(){
		var done = this.async();

		// @TODO: warn about non existent folders
		this.files.forEach(function(file){

			// Warn on and remove invalid source files
			file.src.forEach(function(filepath) {
				//filepath = path.resolve(filepath);

				if (!grunt.file.exists(filepath) || !grunt.file.isDir(filepath)) {
					grunt.log.warn('Directory "' + filepath + '" not found.');
				} else {
					// ***
					// Parse directory
					// ***
					// @TODO: read yaml
					// @TODO: read readme.markdown

					var readme = "";
					var readmePath = path.join(filepath, 'README.md');
					if (grunt.file.exists(readmePath)) {
						readme = md(grunt.file.read(readmePath));
					}

					fs.readdir(filepath, function(err, files){

						if (err) {return grunt.log.error(err);}
						files = files
							// make sure this is a js file
							.filter(function(file){return file.length - file.lastIndexOf('.js') === 3; })
							.sort()
							.map(function(file){
								return {
									name: file.substring(0,file.length-3),
									js:path.join('..', filepath, file),
									docco: file.replace('.js','.html')
								};
							});

						grunt.file.write(path.join(file.dest,'index.html'),template({
							site: grunt.option('site'),
							player: '../../' + grunt.option('player'),
							dir: filepath,
							files: files,
							readme: readme
						}));
						done();
					});


				}
				return true;
			});
		});
	});

	template;

};