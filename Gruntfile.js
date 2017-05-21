var path = require('path');

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bump: {
			// https://github.com/vojtajina/grunt-bump
			// https://github.com/vojtajina/grunt-bump
			options: {
				files:			['package.json'],
				commitMessage:	'chore: release v%VERSION%',
				updateConfigs:	['pkg'],
				commitFiles:	['package.json','CHANGELOG.md', 'dist/**/*', 'src/piindex.jsp'],
				push: false
			}
		},
		banner: {
			compact: '/*! <%= pkg.name %> <%= pkg.version %> (Custom Build) | <%= pkg.license %> */',
			full: '/*!\n' +
				' * @license <%= pkg.name %> v<%= pkg.version %>\n' +
				' * Copyright 2013-2015 Project Implicit\n' +
				' *\n' +
				' * Licensed under the Apache License, Version 2.0 (the "License");\n' +
				' * you may not use this file except in compliance with the License.\n' +
				' * You may obtain a copy of the License at\n' +
				' *\n' +
				' * \thttp://www.apache.org/licenses/LICENSE-2.0\n' +
				' *\n' +
				' * Unless required by applicable law or agreed to in writing, software\n' +
				' * distributed under the License is distributed on an "AS IS" BASIS,\n' +
				' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
				' * See the License for the specific language governing permissions and\n' +
				' * limitations under the License.\n' +
				' */\n'
		},

		sass: {
			options: {
				loadPath: ['src/css'],
				style: 'compressed'
			},
			dist: {
				files: {'src/css/main.css':'src/css/main.scss'}
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
					skipDirOptimize: true, // so that we don't run into problems with node.js files form the bundles. also makes things faster...
					// generateSourceMaps: true,
					// preserveLicenseComments: false,
					optimize: 'uglify2',
					fileExclusionRegExp: /(\.scss|\.md|_test\.js)$/,
					paths: {
						text: '../../bower_components/requirejs-text/text',
						underscore: 'empty:',
						backbone: 'empty:',
						jquery: 'empty:',
						JSON: 'empty:'
					},

				    packages:[
				      {
				        name: 'pipScorer',
				        location: 'extensions/dscore',
				        main: 'Scorer'
				      }
				    ],

					//optimize:'none', // toggle this for fast optimized debuging

					// Tells Require.js to look at main.js for all shim and path configurations
					mainConfigFile: 'src/js/config.js',

					// Modules to be optimized:
					// we'll keep jquery and underscore seperate so they can be used by all modules
					// backbone must always be excluded as it is not an AMD module and we enforceDefine in config.js
					modules: [
						{
							name: "activatePIP",
							include: ['pipScorer', 'pipAPI']
						},
						{
							name: "pipScorer"
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
		}
	});

	// can't use init because it overides command line arguments
	if (!grunt.option('player')){
		grunt.option('player', "dist/index.html?url="); // set the default player option
	}

	grunt.task.loadTasks('resources/gruntTasks');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('version', 'Advancing version', function(type){
		grunt.task.run([
			"bump:" + (type || 'patch') + ":bump-only",
			'build',
			'bump-commit'
		]);
	});

	grunt.registerTask('updatePIindex', function () {
        var indexFile = "src/piindex.jsp";
        var version = grunt.file.readJSON('package.json').version;

        if (!grunt.file.exists(indexFile)) {
            grunt.log.error("file " + indexFile + " not found");
            return false;//return false to abort the execution
        }

        var file = grunt.file.read(indexFile);//get file as json object
        file = file.replace(/<base href="((?!">).)*">/,'<base href="<%= getBase + "/implicit/common/all/js/pip/' + version + '/dist/" %>">');
        grunt.file.write(indexFile, file);
    });

	// build production stuff
	grunt.registerTask('build', 'Building PIplayer', function(){
		grunt.task.run('updatePIindex','requirejs','sass');
	});
};
