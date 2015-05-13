/*
 * gets a condition array (or a single condition) and evaluates it
 * returns true if all statements are true, false otherwise
 *
 * a single condition looks like this:
 *
 *	condition = {
 *		type : 'begin/inputEquals/inputEqualsTrial/inputEqualsStim/function',
 *		value: 'right/trialAttribute/stimAttribute/customFunction',
 *		handle: 'stim handle' (optional in case we're targeting a stimulus)
 *	}
 *
 */

define(function(require){

	var _ = require('underscore')
		, globalGetter = require('app/global')
		, current_trial = require('./current_trial');


	return function evaluate(conditions, inputData){

		var global = globalGetter();
		var current = global.current || {};
		var trial = current_trial();

		if (!conditions){
			throw new Error("There is an interaction without conditions!!");
		}

		// make sure conditions is an array
		conditions = _.isArray(conditions) ? conditions : [conditions];

		// the internal event
		inputData = inputData || {};

		// assume condition is true
		var isTrue = true;

		// if this is a begin event, make sure we only run conditions that have begin in them
		if (inputData.type == 'begin') {
			// check if this set of conditions has 'begin' in it
			var has_begin = _.reduce(conditions, function(memo, row){return memo || row.type == 'begin';},false);
			if (!has_begin){
				return false;
			}
		}

		// try to refute the condition
		_.each(conditions,function(condition){
			var searchObj, result;
			var evaluation = true;
			switch (condition.type){
				case 'begin':
					if (inputData.type !== 'begin') {
						evaluation = false;
					}
					break;

				case 'inputEquals' :
					// make sure condition.value is an array
					_.isArray(condition.value) || (condition.value = [condition.value]);

					if (_.indexOf(condition.value,inputData.handle) === -1) {
						evaluation = false;
					}
					break;

				case 'inputEqualsTrial':
					if (inputData.handle !== trial.data[condition.property]) {
						evaluation = false;
					}
					break;

				case 'inputEqualsStim':
					// create search object
					searchObj = {};
					if (condition.handle){
						searchObj['handle'] = condition.handle;
					}
					searchObj[condition.property] = inputData.handle;

					// are there stimuli answering this descriptions?
					result = trial._stimulus_collection.whereData(searchObj);
					if (result.length === 0) {
						evaluation = false;
					}
					break;

				case 'trialEquals':
					if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined'){
						throw new Error('trialEquals requires both "property" and "value" to be defined');
					}
					if (condition.value !== trial.data[condition.property]){
						evaluation = false;
					}
					break;

				case 'inputEqualsGlobal':
					if (typeof condition.property == 'undefined'){
						throw new Error('inputEqualsGlobal requires "property" to be defined');
					}
					if (inputData.handle !== global[condition.property]){
						evaluation = false;
					}
					break;

				case 'globalEquals':
					if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined'){
						throw new Error('globalEquals requires both "property" and "value" to be defined');
					}
					if (condition.value !== global[condition.property]){
						evaluation = false;
					}
					break;

				case 'globalEqualsTrial':
					if (typeof condition.globalProp == 'undefined' || typeof condition.trialProp == 'undefined'){
						throw new Error('globalEqualsTrial requires both "globalProp" and "trialProp" to be defined');
					}
					if (global[condition.globalProp] !== trial.data[condition.trialProp]) {
						evaluation = false;
					}
					break;

				case 'globalEqualsStim':
					if (typeof condition.globalProp == 'undefined' || typeof condition.stimProp == 'undefined'){
						throw new Error('globalEqualsStim requires both "globalProp" and "stimProp" to be defined');
					}

					// create search object
					searchObj = {};
					if (condition.handle){
						searchObj['handle'] = condition.handle;
					}
					searchObj[condition.stimProp] = global[condition.globalProp];

					// are there stimuli answering this descriptions?
					result = trial._stimulus_collection.whereData(searchObj);
					if (result.length === 0) {
						evaluation = false;
					}
					break;

				case 'inputEqualsCurrent':
					if (typeof condition.property == 'undefined'){
						throw new Error('inputEqualsCurrent requires "property" to be defined');
					}
					if (inputData.handle !== current[condition.property]){
						evaluation = false;
					}
					break;

				case 'currentEquals':
					if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined'){
						throw new Error('currentEquals requires both "property" and "value" to be defined');
					}
					if (condition.value !== current[condition.property]){
						evaluation = false;
					}
					break;

				case 'currentEqualsTrial':
					if (typeof condition.currentProp == 'undefined' || typeof condition.trialProp == 'undefined'){
						throw new Error('currentEqualsTrial requires both "currentProp" and "trialProp" to be defined');
					}
					if (current[condition.currentProp] !== trial.data[condition.trialProp]) {
						evaluation = false;
					}
					break;

				case 'currentEqualsStim':
					if (typeof condition.currentProp == 'undefined' || typeof condition.stimProp == 'undefined'){
						throw new Error('currentEqualsStim requires both "currentProp" and "stimProp" to be defined');
					}

					// create search object
					searchObj = {};
					if (condition.handle){
						searchObj['handle'] = condition.handle;
					}
					searchObj[condition.stimProp] = current[condition.currentProp];

					// are there stimuli answering this descriptions?
					result = trial._stimulus_collection.whereData(searchObj);
					if (result.length === 0) {
						evaluation = false;
					}
					break;

				case 'function' :
					if (!condition.value.apply(trial,[trial,inputData])) {
						evaluation = false;
					}
					break;

				default:
					throw new Error('Unknown condition type: ' + condition.type);
			}

			isTrue = isTrue && (condition.negate ? !evaluation : evaluation);
		});

		return isTrue;
	};
});