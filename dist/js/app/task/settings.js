/*
 * simply take settings out of the script
 */
define(function(require){

	var script = require('./script');

	/**
	 * get settings from script
	 * @param  {String} name  		Optional name of specific setting to get
	 * @return {*}         			The settings object (or a sub of it)
	 */
	function settingsGetter(name){
		var settings = script().settings || {};

		if (name) {
			return settings[name];
		}
		return settings;
	}

	return settingsGetter;
});