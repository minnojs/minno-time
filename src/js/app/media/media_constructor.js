define(function(require) {
	var _ = require('underscore')
		, MediaView = require('./media_view')
		,html = require('utils/html')
		,global = require('app/global')
		,$ = require('jquery');

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

		// We can get errors where the element is a text node (#3) because jquery is not set to deal with them
		// this is a bit of a hack, and should probably move to the html.js provider
		if ($(source.el)[0].nodeType !== Node.ELEMENT_NODE){
			throw new Error('Media element must be an ELEMENT_NODE (#1) but was: "#' +  $(source.el)[0].nodeType + '" instead.');
		}

		// return a new media view
		return new MediaView(source);
	}

	return Media;
});

