// we enforceDefine in order to catch IE errors, therefore main.js has to use a define.
define(function(){

    // Sets the require.js configuration for your application.
    return require.config({
        enforceDefine: true,
        baseUrl:'js',

        // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
        paths: {
            pipAPI: 'API',
            //plugins
            text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min', '../../bower_components/requirejs-text/text'],

            // Core Libraries
            jquery: ['../../bower_components/jquery/jquery'],
            underscore: ['//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min','../../bower_components/lodash-compat/lodash.min']
        },

        packages:[
            {
                name: 'pipScorer',
                location: 'extensions/dscore',
                main: 'Scorer'
            }
        ],

        deps: ['jquery',  'underscore', 'utils/polyfills']
    });

});
