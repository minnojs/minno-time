define(function(require){

	// initiate piGloabl
	window.piGlobal || (window.piGlobal = {});

	var _ = require('underscore');
	var glob = window.piGlobal;


	/**
	 * getter setter for the global object
	 * @param  {Object} obj     The object to add to the global
	 * @param  {Bool} 	replace A new object to fully replace the old global
	 * @return {Object}         The full global
	 */
	function global(obj, replace){

		if (replace) {
			glob = obj;
			return glob;
		}

		if (_.isPlainObject(obj)){
			_.each(function(value, key){
				console.warn && global[key] && console.warn('Overwriting "' + key  + '" in global object.');
			});
			_.merge(glob, obj);
		}

		return glob;
	}

	return global;
});