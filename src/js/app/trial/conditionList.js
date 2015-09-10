define(function(require){

	var _ = require('underscore');

	function assert(condition, message){
		if (!condition){
			throw new Error('Conditions: ' + message);
		}
	}

	var conditionList = {
		begin: function(trial, condition, inputData){
			return condition.type == 'begin' && inputData.type == 'begin';
		},

		inputEquals: function(trial, condition, inputData){
			// make sure condition.value is an array
			_.isArray(condition.value) || (condition.value = [condition.value]);

			// inputData.handle is in the valueArr
			return _.indexOf(condition.value,inputData.handle) != -1;
		},

		inputEqualsTrial: function(trial, condition, inputData){
			assert(condition.property, 'inputEqualsTrial requires "property" to be defined');
			return inputData.handle === trial.data[condition.property];
		},

		inputEqualsStim: function(trial, condition, inputData){
			assert(condition.property, 'inputEqualsStim requires "property" to be defined');

			var result;
			var searchObj = {};
			condition.handle && (searchObj.handle = condition.handle);
			searchObj[condition.property] = inputData.handle;

			// are there stimuli answering this descriptions?
			result = trial._stimulus_collection.whereData(searchObj);
			return result.length !== 0;
		},
		trialEquals: function(trial, condition){
			assert(_.isUndefined(condition.property), 'trialEquals requires "property" to be defined');
			return condition.value === _.get(trial.data,condition.property);
		},

		inputEqualsGlobal: function(trial, condition, inputData){
			assert(_.isUndefined(condition.property), 'inputEqualsGlobal requires "property" to be defined');
			return inputData.handle === _.get(global,condition.property);
		},

		globalEquals: function(trial, condition, inputData){
			assert(_.isUndefined(condition.property), 'globalEquals requires "property" to be defined');
			return inputData.handle === _.get(global,condition.property);
		},

		globalEqualsTrial: function(trial, condition){
			assert(condition.globalProp, 'globalEqualsTrial requires both "globalProp" to be defined');
			assert(condition.trialProp, 'globalEqualsTrial requires both "trialProp" to be defined');
			return _.get(global, condition.globalProp) === _.get(trial.data, condition.trialProp);
		},

		globalEqualsStim: function(trial, condition){
			assert(condition.globalProp, 'globalEqualsStim requires both "globalProp" to be defined');
			assert(condition.stimProp, 'globalEqualsStim requires both "stimProp" to be defined');

			// create search object
			var result;
			var searchObj = {};
			condition.handle && (searchObj.handle = condition.handle);
			searchObj[condition.stimProp] = _.get(global,condition.globalProp);

			// are there stimuli answering this descriptions?
			result = trial._stimulus_collection.whereData(searchObj);
			return result.length > 0;
		},

		inputEqualsCurrent: function(trial, condition, inputData, global){
			var current = global.current;
			assert(_.isUndefined(condition.property), 'inputEqualsCurrent requires "property" to be defined');
			return inputData.handle === _.get(current,condition.property);
		},

		currentEquals: function(trial, condition, inputData, global){
			var current = global.current;
			assert(condition.property, 'currentEquals requires "property" to be defined');
			return condition.value === _.get(current,condition.property);
		},

		currentEqualsTrial: function(trial, condition, inputData, global){
			var current = global.current;
			assert(condition.currentProp, 'currentEqualsTrial requires "currentProp" to be defined');
			assert(condition.trialProp, 'currentEqualsTrial requires "trialProp" to be defined');
			return _.get(current, condition.currentProp) === _.get(trial.data, condition.trialProp);
		},

		currentEqualsStim: function(trial, condition, inputData, global){
			var current = global.current;
			assert(condition.currentProp, 'currentEqualsStim requires "currentProp" to be defined');
			assert(condition.stimProp, 'currentEqualsStim requires "stimProp" to be defined');

			var result;
			var searchObj = {};
			condition.handle && (searchObj.handle = condition.handle);
			searchObj[condition.stimProp] = current[condition.currentProp];

			// are there stimuli answering this descriptions?
			result = trial._stimulus_collection.whereData(searchObj);
			return result.length > 0;
		},

		'function' : function(trial, condition, inputData){
			return condition.value.apply(trial,[condition,inputData, trial]);
		},

		custom: function(trial, condition, inputData){
			return condition.fn.apply(trial,[condition,inputData, trial]);
		}
	};

	return conditionList;
});