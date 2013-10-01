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

					// Tells Require.js to look at main.js for all shim and path configurations
					mainConfigFile: 'src/js/main.js',

					// Modules to be optimized:
					// we'll keep jquery and underscore seperate so they can be used by all modules
					modules: [
						{
							name: "app/API",
							exclude: ['underscore','jquery']
						},
						{
							name: "extensions/dscore/Scorer",
							exclude: ["app/API",'underscore','jquery']
						}
					]
				}
			}
		},

		/**
		 * run shell scripts
		 */
		shell: {
			// build tutorials from js in tutorials
			docco: {
				command: 'docco tutorials/*.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-shell');

	// Default task(s).
	grunt.registerTask('default', ['jshint']);

	// build production stuff
	grunt.registerTask('build', ['requirejs','shell:docco']);
};