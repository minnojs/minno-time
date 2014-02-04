var path = require('path');
var jade = require('jade');
var md = require('marked');

module.exports = function(grunt) {

	// create template()
	function createTemplate(tplPath){
		tplPath = path.resolve(tplPath);
		var templateSrc;
		if (!grunt.file.exists(tplPath)) {
			return grunt.log.warn('Template file "' + tplPath + '" not found.');
		} else {
			templateSrc = grunt.file.read(tplPath);
			return jade.compile(templateSrc,{
				filename: tplPath
			});
		}
	}

	grunt.registerMultiTask('jadeMarked','Compile markdown ==> jade ==> html',function(){
		var self = this;
		var options = this.data;
		var template = createTemplate(options.template);

		this.files.forEach(function(file){
			// Warn on and remove invalid source files
			file.src.forEach(function(filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
				} else {
					var src = grunt.file.read(filepath);

					// run this file through markdown
					src = md(src);

					// run this file through the jade template
					src = template({
						site: grunt.option('site'),
						player: grunt.option('player') || "../../dist/index.html?url=", // by default use the current dist
						tab: self.target,
						content: src
					});
					grunt.log.writeln('Writing ' + filepath + ' ==> ' + file.dest);
					grunt.file.write(file.dest, src);
				}
			});
		});
	});
};