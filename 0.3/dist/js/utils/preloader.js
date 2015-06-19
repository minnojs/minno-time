/*
 * media preloader
 */
define(function(require){
	var $ = require('jquery');

	var srcStack = [];				// an array holding all our sources
	var defStack = [];				// an array holding all the deferreds
	var stackDone = 0;				// the number of sources we have completed downloading
	var allDone = $.Deferred();		// General deferred, notifies upon source completion
	var images = {};

	// load a single source
	function load(src, type){
		type = type || 'image';
		// if we haven't loaded this yet
		if ($.inArray(src, srcStack) == -1) {
			var deferred = $.Deferred();

			switch (type) {
				case 'template':
					requirejs(['text!' + src], function(){
						deferred.resolve();
					}, function(){
						throw new Error('Template not found: ' + src);
					});
					break;
				case 'image':
					/* falls through */
				default :
					var img = new Image();	// create img object
					$(img).on('load',function(){deferred.resolve();}); // resolve deferred on load
					$(img).one('error',function(){
						img.src = "";
						img.src = src;
						$(img).on('error', function(){throw new Error('Image not found: "' + src + '"');});
					}); // reject deferred on error
					img.src = src;
					images[src] = img;
					break;
			}

			// keep defered and source for later.
			defStack.push(deferred);
			srcStack.push(src);

			// count this defered as done
			deferred
				.done(function(){
					// increment the completed counter
					stackDone++;
					// notify allDone that we advanced another step
					allDone.notify(stackDone,defStack.length);
				});

			return deferred;
		}
		// the source was already loaded
		return false;
	}

	return {
		// loads a single source
		add: load,

		getImage: function(url){
			return images[url].cloneNode();
		},

		activate: function(){
			// fail or reject allDone according to our defStack
			$.when.apply($,defStack)
				.done(function(){allDone.resolve();})
				.fail(function(){allDone.reject();});

			return allDone.promise();
		},

		// reset globals so we can reuse this object
		reset: function(){
			srcStack = [];
			defStack = [];
			stackDone = 0;
			allDone = this.state = $.Deferred();
		},

		// returns a deferred describing the state of this preload
		state: allDone
	};

});