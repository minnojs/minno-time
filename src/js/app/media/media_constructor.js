define(function(require) {
	var MediaView = require('./media_view')
		,html = require('./html')
		,global = require('app/global');

	function Media(options){

		// make sure we have a media object
		if (!options.source){
			throw new Error('Media object not defined for ' + options.model.name());
		}

		options.el = html(options.source,{
			global: global(),
			trialData: options.trial.data,
			stimulusData: options.model.get('data')
		});

		// return a new media view
		return new MediaView(options);
	}

	return Media;
});

