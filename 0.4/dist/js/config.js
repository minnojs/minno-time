// we enforceDefine in order to catch IE errors, therefore main.js has to use a define.
define(function(){

    // Sets the require.js configuration for your application.
    return require.config({
        enforceDefine: true,
        baseUrl:'js',

        paths: {
            pipAPI: 'API',

            //plugins
            text: ['../../bower_components/requirejs-text/text'],

            // Core Libraries
            underscore: ['../../bower_components/lodash-compat/lodash.min']
        },

        packages:[
            {
                name: 'pipScorer',
                location: 'extensions/dscore',
                main: 'Scorer'
            }
        ],

        deps: ['underscore']
    });

});
