/*
 * gets all media that needs preloading and preloads it
 */
define(function(require){
	var _ = require('underscore')
		,preload = require('utils/preloader')
		,buildUrl = require('app/task/buildUrl');

	// accepts a piece of script and a type
	// @param script: a piece of script
	// @param type: what sort of object this is (media/stimulus/trial)
	// @param reset: should we reset the preloader before activating it (use if for some reason we lost the cache...)
	// @returns a deferred object
	return function(script){
		var settings = script.settings;
		loadScript(script);

		return preload.activate();

		function loadMedia(media){
			var baseUrl = _.get(settings, 'base_url');

			// if this is an image, preload it
			if (!_.isUndefined(media.image)) {
				preload.add(buildUrl(media.image, 'image', baseUrl),'image');
			}
			if (!_.isUndefined(media.template)) {
				preload.add(buildUrl(media.template,'template', baseUrl),'template');
			}
		}

		function loadStimulus(stimulus) {
			if (stimulus.media) {
				loadMedia(stimulus.media);
			}
		}

		function loadInput(input){
			if (input.element) {
				loadMedia(input.element);
			}
		}

		function loadTrial(trial){
			_.each(trial.layout || [], loadStimulus);
			_.each(trial.stimuli || [], loadStimulus);
			_.each(trial.input || [], loadInput);
		}

		// load trials in sequence (essentialy, recursively pick out the trials out of the mixer)
		function loadSequence(sequence){
			_.each(sequence,function(element){
				if (!_.isUndefined(element.mixer)) {
					loadSequence(element.data);
				} else {
					loadTrial(element);
				}
			});
		}

		function loadScript(script){
			// load media sets
			_.each(script.mediaSets || [], loadMedia);

			// load stimsets
			_.each(script.stimulusSets || [], loadStimulus);

			// load trialsets
			_.each(script.trialSets || [], loadTrial);

			loadSequence(script.sequence);
		} // load script

	};
});