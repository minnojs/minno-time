/*
 * this file is resposible for taking the experiment script (json) and parsing it
 */

define(function(require){
	// load dependancies
	var _ = require('underscore');
	var scriptGetter = require('app/task/script');
	var db = require('../sequencer/database');
	var go = require('../sequencer/sequenceGoto');
	var sequenceSetter = require('../sequencer/taskSequence');
	var preload = require('../sequencer/sequencePreload');

	return function(){
		var script = scriptGetter();


		db.createColl('trial');
		db.createColl('stimulus');
		db.createColl('media');

		db.add('trial', script.trialSets || []);
		db.add('stimulus', script.stimulusSets || []);
		db.add('media', script.mediaSets || []);

		if (!_.isArray(script.sequence)){
			throw new Error('You must set a sequence array.');
		}

		var sequence = db.sequence('trial', script.sequence);
		sequence.go = go; // see sequence/goto.js to understand why we are doing this
		sequenceSetter(sequence);

		// preload and return deferred
		return preload(script);
	};
});
