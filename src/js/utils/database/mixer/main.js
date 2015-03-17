define(function(require){
	var _ = require('underscore');

	var mixer = require('./mixer')(
		_.shuffle, // randomizeShuffle
		Math.random // randomizeRandom
	);

	var dotNotation = require('./branching/dotNotation'); // this is a value, doesn't need to be evaluated

	var mixerDotNotation = require('./branching/mixerDotNotationProvider')(dotNotation);
	var mixerCondition = require('./branching/mixerConditionProvider')(
		mixerDotNotation,
		piConsole
	);

	var mixerEvaluate = require('./branching/mixerEvaluateProvider')(mixerCondition);

	var mixerDefaultContext = {};

	require('./branching/mixerBranchingDecorator')(
		mixer,
		mixerEvaluate,
		mixerDefaultContext
	);

	var MixerSequence = require('./mixerSequenceProvider')(mixer);

	return MixerSequence;

	function piConsole(){
		return console;
	}

});