/*
 * this file is resposible for taking the experiment script (json) and parsing it
 */

define(function(require){
	// load dependancies
	var scriptGetter = require('app/task/script');
	var trialSets = require('../trial/trial_sets');
	var stimulusSets = require('../stimulus/stimulus_sets');
	var mediaSets = require('../media/media_sets');
	var sequence = require('../sequencer/sourceSequence');
	var mix = require('utils/mixer');
	var preload = require('../sequencer/sequencePreload');

	return function(){
		var script = scriptGetter();

		// load component sets
		if (script.trialSets) {
			trialSets(script.trialSets);
		}
		if (script.stimulusSets) {
			stimulusSets(script.stimulusSets);
		}
		if (script.mediaSets) {
			mediaSets(script.mediaSets);
		}

		// load sequence
		sequence.add(mix(script.sequence));

		// preload and return deferred
		return preload(script);
	};
});
