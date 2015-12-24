/*
 * media preloader
 */
define(function(){

	var srcStack = [];				// an array holding all our sources
	var defStack = [];				// an array holding all the deferreds
	var stackDone = 0;				// the number of sources we have completed downloading
	var images = {};
	var templates = {};

	// load a single source
	function load(src, type){
		var deferred;
		type = type || 'image';
		// if we haven't loaded this yet
		if (srcStack.indexOf(src) == -1) {
			switch (type) {
				case 'template':
					deferred = new Promise(function(resolve, reject){
						requirejs(['text!' + src], resolve, reject);
					})
					.then(function(template){
						templates[src] = template;
					})
					.catch(function(){
						throw new Error('Template not found: ' + src);
					})
					break;

				case 'image':
					/* falls through */
				default :
					deferred = new Promise(function(resolve, reject){
						var img = new Image();	// create img object
						img.onload = resolve;
						img.onerror = function(){
							img.src = '';
							img.src = src;
							img.onerror = reject;
						}
						img.src = src;
						images[src] = img;
					});
					break;
			}

			// keep defered and source for later.
			defStack.push(deferred);
			srcStack.push(src);

			// count this defered as done
			deferred.then(function(){
				stackDone++;
			});

			return deferred;
		}
		// the source was already loaded
		return false;
	}

	return {
		// loads a single source
		add: load,

		getTemplate: function(url){
			return templates[url];
		},

		getImage: function(url){
			return images[url].cloneNode();
		},

		activate: function(){
			return Promise.all(defStack);
		},

		// reset globals so we can reuse this object
		reset: function(){
			srcStack = [];
			defStack = [];
			stackDone = 0;
		}
	};

});