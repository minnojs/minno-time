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
				"globals": { "define": false, "require": false }
			}
		},

		requirejs: {
			compile : {
				options : {
					// Creates a js-optimized folder at the same folder level as your "js" folder and places the optimized project there
					dir: "js-optimized",

					// Tells Require.js to look at main.js for all shim and path configurations
					mainConfigFile: 'js/main.js',

					// Modules to be optimized:
					modules: [
						{
							name: "main"
						}
					]
				}
			}
		},
		docco: {
			tutorials : {
				src : ['tutorials/*.js'],
				options : {
					output: 'docs'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-docco');

	// Default task(s).
	grunt.registerTask('default', ['jshint','docco']);
};
