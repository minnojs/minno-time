/*
 * The grunt task that runs our selenium test
 */
module.exports = function(grunt){
	grunt.registerMultiTask('test','Run selenium tests',function(){
		var test = require('./test/runner');
		var done = this.async();
		var options = this.data;

		// set the selenium server url
		test.setServerUrl(options.server);

		this.files.forEach(function(file){
			// Warn on and remove invalid source files
			file.src.forEach(function(filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
				} else {
					var task = require(filepath);
					// should we attempt to run the tests in paralel?
					if (options.paralel){
						test.runParalel(task,options.browsers);
					} else {
						test.runSeries(task,options.browsers);
					}
				}
			});
		});

		test.done(done,done);
	});
};