define(function(require){

	var _ 					= require('underscore');
	var globalGetter 		= require('../global');
	var sequenceGetter		= require('./taskSequence');
	var db 					= require('./database');
	var buildUrl 			= require('../task/build_url');

	function inflateTrial(destination, properties){
		var sequence = sequenceGetter();
		var global = globalGetter();
		var context = {global: global, current: global.current};
		var source;

		sequence.go(destination, properties, context);
		source = sequence.current(context, {skip:['layout','stimuli']});

		if (!source){
			return;
		}

		source.stimuli = _.map(source.stimuli || [], buildStim, context);
		source.layout = _.map(source.layout || [], buildStim, context);

		context.trialData = null;
		return source;
	}

	return inflateTrial;

	function buildMedia(stim, prop, context){
		var val = stim[prop];

		if (!val) {
			return false;
		}

		if (_.isString(val)){
			stim[prop] = val = {word: val};
		}

		val = db.inflate('media', val, context);

		// note that the base url is added to the media object during the sequence preload
		// if needed, build url
		if (val.image){
			val.image = buildUrl(val.image,'image');
		}

		if (val.template){
			val.inlineTemplate = requirejs('text!' + buildUrl(val.template, 'template'));
			val.inlineTemplate = _.template(val.inlineTemplate)(context);
		}

		stim[prop] = val;

		context.mediaData = null;
		context.mediaMeta = null;
	}

	function buildStim(stim){
		var context = this;

		stim = db.inflate('stimulus', stim, context, {skip:['media','touchMedia']});
		buildMedia(stim, 'media', context);
		buildMedia(stim, 'touchMedia', context);
		context.stimulusData = null;
		context.stimulusMeta = null;
		return stim;
	}
});