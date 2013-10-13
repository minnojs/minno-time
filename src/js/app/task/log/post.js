/*
 * Send log chunk
 * returns a function that takes data and sends it to the server after appending any meta data
 */
define(['jquery','app/task/settings','JSON'],function($, settings,JSON){

	var send = function(data){
		var url = settings.logger && settings.logger.url
			, deff = $.Deferred();

		if (!url) {
			return deff.resolve();
		}

		// build post data
		var post = {
			json: JSON.stringify(data) || ""
		};
		$.extend(post, settings.metaData || {});

		// lets post our data
		deff = $.post(url,post);

		return deff;
	};

	return send;
});