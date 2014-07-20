// Sets the require.js configuration for your application.
require.config({
  // how long to wait for incoming files (default is 7, we had problems loading Backbone - maybe this will do the trick - we need to set it so ridiculisly high because our servers are so slow...)
  waitSeconds: 200,

  enforceDefine: true,
  baseUrl:'js',

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
  paths: {
		//plugins
		text: ['//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.3/text.min', "../../bower_components/requirejs-text/text"],

		// Core Libraries
		jquery: ["//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min","../../bower_components/jquery/jquery.min"],
		underscore: ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.1.0/lodash.min","../../bower_components/lodash/dist/lodash.min"],
		backbone: ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min', "../../bower_components/backbone/backbone-min"]
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
      "backbone": {
          "deps": ["underscore", "jquery"],
          "exports": "Backbone"  //attaches "Backbone" to the window object
      }
  }, // end Shim Configuration
  deps: ['jquery', 'backbone', 'underscore']
});

// we enforceDefine in order to catch IE errors, therefore main.js has to use a define.
// Here we simply return an empty object.
define({});