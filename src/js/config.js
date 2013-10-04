// Sets the require.js configuration for your application.
require.config({
  // how long to wait for incoming files (default is 7, we had problems loading Backbone - maybe this will do the trick - we need to set it so ridiculisly high because our servers are so slow...)
  waitSeconds: 200,

  enforceDefine: true,
  baseUrl:'js',

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
  paths: {
		//plugins
		"text": "libs/text",

		// Core Libraries
		"jquery": "libs/jquery",
		"underscore": "libs/lodash",
		"backbone": "libs/backbone",
    "JSON": "libs/json2"
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
      "JSON" : {
        "exports" : "JSON"
      },


      "backbone": {
          "deps": ["underscore", "jquery"],
          "exports": "Backbone"  //attaches "Backbone" to the window object
      }

  } // end Shim Configuration
});

// we enforceDefine in order to catch IE errors, therefore main.js has to use a define.
// Here we simply return an empty object.
define({});