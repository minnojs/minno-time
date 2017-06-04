/*
 * gets all media that needs preloading and preloads it
 */
define(function(require){
    var _ = require('underscore');
    var preloader = require('utils/preloader');
    var build_url = require('app/task/build_url');

    return sequencePreload;

    function loadMedia(media){
        if (!_.isUndefined(media.image)) preloader.load(build_url(media.image, 'image'),'image');
        if (!_.isUndefined(media.template)) preloader.load(build_url(media.template,'template'),'template');
    }

    function loadStimulus(stimulus) {
        if (stimulus.media) loadMedia(stimulus.media);
    }

    function loadInput(input){
        if (input.element) loadMedia(input.element);
    }

    function loadTrial(trial){
        _.each(trial.layout || [], loadStimulus);
        _.each(trial.stimuli || [], loadStimulus);
        _.each(trial.input || [], loadInput);
    }

	// load trials in sequence (essentialy, recursively pick out the trials out of the mixer)
    function loadSequence (sequence){
        _.each(sequence,function(element){
            if (!_.isUndefined(element.mixer)) loadSequence(element.data);
            else loadTrial(element);
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

	// accepts a piece of script and a type
	// @param script: a piece of script
	// @param type: what sort of object this is (media/stimulus/trial)
	// @param reset: should we reset the preloader before activating it (use if for some reason we lost the cache...)
	// @returns a deferred object
    function sequencePreload (script, type, reset){
        if (reset) preloader.reset();

        switch (type){
            case 'media'	: loadMedia(script); break;
            case 'stimulus'	: loadStimulus(script); break;
            case 'trial'	: loadTrial(script); break;
            case 'script'	:
				/* falls through */
            default:
                loadScript(script); break;
        }
        return preloader;
    }
});
