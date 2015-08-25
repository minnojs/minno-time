define(function(require) {
	var MediaView = require('./media_view')
		,html = require('./html')
		,global = require('app/global');

	function Media(source, model){

		var options;

		// make sure we have a media object
		if (!source){
			throw new Error('Media object not defined for ' + model.name());
		}

		options = {
			model: model,
			source: source,
			el: html(source,{
				global: global(),
				trialData: model.trial.data,
				stimulusData: model.get('data')
			})
		};

		// return a new media view
		return new MediaView(options);
	}

	return Media;
});

