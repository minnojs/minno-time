/*
 * Send log chunk
 * returns a function that takes data and sends it to the server after appending any meta data
 */
define(['jquery','app/task/settings','libs/json2'],function($, settings){

	var send = function(data){
		var url = settings.logger && settings.logger.url
			, deff = $.Deferred();

		if (!url) {
			return deff.resolved();
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