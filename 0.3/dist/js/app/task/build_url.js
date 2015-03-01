/*
 * build the url for this src (add the generic base_url)
 */
define(function(require){

	var _ = require('underscore')
		,settingsGetter = require('./settings');

	return function(url, type){
		var settings = settingsGetter();
		var base_url;

		// the base url setting may be either a string, or an object with the type as a field
		if (_.isString(settings.base_url)) {
			base_url = settings.base_url;
		} else {
			if (_.isObject(settings.base_url)) {
				base_url = settings.base_url[type];
			}
		}

		// it this is a dataUrl type of image, we don't need to append the baseurl
		if (type == 'image' && /^data:image/.test(url)){
			return url;
		}

		// make sure base url is set, and add trailing slash if needed
		if (!base_url) {
			base_url="";
		} else {
			if (base_url[base_url.length-1] != "/") {
				base_url+="/";
			}
		}

		return base_url + url;
	};
});
