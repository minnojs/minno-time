// The example build for reference
// https://github.com/requirejs/r.js/blob/master/build/example.build.js
({
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
    ]
})
