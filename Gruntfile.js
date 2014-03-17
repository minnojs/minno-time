var path = require('path');

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: {
			compact: '/*! <%= pkg.name %> <%= pkg.version %> (Custom Build) | <%= pkg.license %> */',
			full: '/*!\n' +
				' * <%= pkg.name %> v<%= pkg.version %>\n' +
				' * <%= pkg.license %> License\n' +
				' */\n'
		},

		jshint: {
			files: ['src/js/', 'resources'],
			options: {
				jshintrc: '.jshintrc',
				ignores: ['src/js/libs/*.js', 'src/js/r.js']
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
					],

					// Add banner
					wrap: {
						start: '<%= banner.full %>',
						end: ''
					}
				}
			}
		},

		docco: {
			// https://oncletom.io/2013/dynamic-grunt-targets-using-templates/
			examples: {
				src: ['resources/examples/*.js'],
				options: {
					output: 'docs/examples/'
				}
			},
			snippets:{
				src: ['resources/snippets/*.js'],
				options: {
					output: 'docs/snippets/'
				}
			},
			user:{
				src: ['user/*.js'],
				options: {
					output: 'docs/user/'
				}
			}
		},

		pipDirectory: {
			examples: {
				src: 'resources/examples/',
				dest:'docs/examples'
			},
			snippets: {
				src: 'resources/snippets/',
				dest:'docs/snippets'
			},
			user: {
				src: 'user',
				dest:'docs/user'
			}
		},


		// custom grunt task (resources/gruntTasks/jadeMarked.js)
		jadeMarked: {
			tutorials : {
				template: 'resources/templates/tutorials.jade',
				replace: {
					// by default use the current dist
					'#{player}' : '../../<%= grunt.option("player") %>'
				},
				files: [
					{
						expand: true,					// Enable dynamic expansion.
						cwd: 'resources/tutorials',
						src: ['*.md'],					// Actual pattern(s) to match.
						dest: 'docs/tutorials/',		// Destination path prefix.
						ext: '.html'					// Dest filepaths will have this extension.
					}
				]
			}
		},

		express: {
			options: {
				port: 3000,
				hostname: '*'
			},
			server: {
				options: {
					server: path.resolve('resources/server'),
					livereload:true,
					open: true
				}
			}
		},

		// custum grunt task (resources/gruntTasks/test.js)
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
		},

		watch: {
			user:{
				files: ['user/*.js'],
				tasks: ['docco:user', 'pipDirectory:user']
			},
			tutorials:{
				files: ['resources/tutorials/*.md'],
				tasks: ['jadeMarked:tutorials']
			}
		}
	});

	// can't use init because it overides command line arguments
	if (!grunt.option('player')){
		grunt.option('player', "dist/index.html?url="); // set the default player option
	}

	grunt.task.loadTasks('resources/gruntTasks');
	grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// copy all js files from the tutorials into the user directory
	grunt.registerTask('userDir','Creating user directory', function(){
		grunt.file.expandMapping('*.js', 'user/',{cwd:'resources/tutorials/js/'}).forEach(function(file){
			grunt.file.copy(file.src, file.dest);
		});
	});

	// Documentation.
	// Only run the user targets if the user directory exists
	grunt.registerTask('docs', 'Building documentation', function(){
		// if the user directory does not exist, remove the user tasks from the config file...
		if (!grunt.file.isDir('user')) {
			delete grunt.config.getRaw('docco').user;
			delete grunt.config.getRaw('pipDirectory').user;
		}

		grunt.task.run('docco', 'pipDirectory', 'jadeMarked');
	});

	// Default task(s).
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('server', ['express', 'watch:user','express-keepalive']);
	grunt.registerTask('tutorials', ['express', 'watch:tutorials','express-keepalive']);

	// build production stuff
	grunt.registerTask('build', 'Building PIplayer', function(){
		if (!grunt.option('site') && !grunt.file.isDir('user')) {
			grunt.task.run('userDir');
		}
		grunt.task.run('requirejs','docs');
	});
};