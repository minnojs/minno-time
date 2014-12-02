define(['jquery', './media_view','../inflator','utils/html','app/task/build_url','app/global'], function($, Media,inflate,html,build_url,global) {

	return function(mediaObject,model){

		if (typeof mediaObject == 'string'){
			mediaObject = {word:mediaObject};
		}

		// make sure we have a media object
		if (!mediaObject){
			throw new Error('Media object not defined for ' + model.name());
		}

		// inflate the definitions
		// note that the base url is added to the media object during the sequence preload
		var definitions = inflate(mediaObject,'media');

		// if needed, build url
		if (definitions.template) {
			definitions.template = build_url(definitions.template,'template');
		}
		if (definitions.image){
			definitions.image = build_url(definitions.image,'image');
		}

		// keep the source
		definitions.source = $.extend({},definitions);
		// keep a reference to the model
		definitions.model = model;

		html(definitions,{
			global: global(),
			trialData: model.trial.data,
			stimulusData: model.get('data')
		});

		// return a new media view
		return new Media(definitions);
	};
});

