/*
 * build the url for this src (add the generic base_url)
 */
define(function(require){

	var _ = require('underscore');

	return function baseurl(url, type, baseUrl){
		if (!baseUrl){
			baseUrl = '';
		}

		// the base url setting may be either a string, or an object with the type as a field
		if (_.isPlainObject(baseUrl)){
			baseUrl = baseUrl[type];
		}

		// it this is a dataUrl type of image, we don't need to append the baseurl
		if (type == 'image' && /^data:image/.test(url)){
			return url;
		}

		// add trailing slash
		baseUrl = baseUrl.replace(/\/?$/, '/');


		return baseUrl + url;
	};
});
