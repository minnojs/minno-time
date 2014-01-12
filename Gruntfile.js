module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			files: ['src/js/'],
			options: {
				ignores: ['src/js/libs/*.js', 'src/js/r.js'],
				"evil": true,
				"browser": true,
				"trailing": true,
				"curly":true,
				"immed":true,
				"latedef":true,
				"newcap":true,
				"noarg":true,
				"sub":true,
				"undef":true,
				"unused":true,
				"eqnull":true,
				"node":true,
				"expr":true,
				"laxcomma":true,
				"es3":true,
				"globals": { "define": false, "require": false }
			}
		},

		/**
		 * r.js optimizer
		 */
		requirejs: {
			compile : {
				options : {
					// Creates a dist folder with optimized js
					dir: "dist",
					appDir: 'src',
					baseUrl: 'js',
					//optimize:'none', // toggle this for fast optimized debuging

					// Tells Require.js to look at main.js for all shim and path configurations
					mainConfigFile: 'src/js/config.js',

					// Modules to be optimized:
					// we'll keep jquery and underscore seperate so they can be used by all modules
					// backbone must always be excluded as it is not an AMD module and we enforceDefine in config.js
					modules: [
						{
							name: "app/API",
							exclude: ['underscore','jquery','backbone']
						},
						{
							name: "extensions/dscore/Scorer",
							exclude: ["app/API",'underscore','jquery','backbone']
						},
						{
							name: "extensions/iat/component",
							include: "text!extensions/iat/jst/layout.jst", // include the template for the simpleLayout
							exclude: ['app/API','underscore','jquery','extensions/dscore/Scorer','backbone']
						},
						{
							name: "extensions/iat/PIcomponent",
							include: "text!extensions/iat/jst/layout.jst", // include the template for the simpleLayout
							exclude: ['app/API','underscore','jquery','extensions/dscore/Scorer','backbone']
						}
					]
				}
			}
		},

		docco: {
			tutorials:{
				src: ['tutorials/*.js'],
				options: {
					output: 'docs/tutorials'
				}
			},
			examples: {
				src: ['examples/*.js'],
				options: {
					output: 'docs/examples'
				}
			}
		},

		test: {
			// local selenium server
			// by default tests are not paralel because webserver chokes on them...
			local: {
				src: ['./test/endToEnd/iat.js'],
				server:'http://localhost:4444/wd/hub',
				browsers : [
					{browserName: 'chrome'},
					{browserName: 'firefox'}
				]
			},

			// sauce connect server
			connect: {
				src: ['./test/endToEnd/iat.js'],
				server:'http://localhost:4445/wd/hub', // sauce: 'http://ondemand.saucelabs.com/wd/hub'
				paralel: true,
				browsers : [
					{browserName: 'internet explorer', version: 7},
					{browserName: 'internet explorer', version: 10},
					{browserName: 'safari',platform: "OS X 10.8"}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

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

	// Default task(s).
	grunt.registerTask('default', ['jshint']);

	// build production stuff
	grunt.registerTask('build', ['requirejs','docco']);
};