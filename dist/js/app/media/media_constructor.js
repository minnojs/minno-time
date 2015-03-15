define(function(require) {
	var _ = require('underscore')
		, MediaView = require('./media_view')
		,html = require('utils/html')
		,global = require('app/global');

	function Media(source, model){

		// make sure we have a media object
		if (!source){
			throw new Error('Media object not defined for ' + model.name());
		}

		// keep the source
		source.source = _.cloneDeep(source);

		// keep a reference to the model
		source.model = model;

		html(source,{
			global: global(),
			trialData: model.trial.data,
			stimulusData: model.get('data')
		});

		// return a new media view
		return new MediaView(source);
	}

	return Media;
});

