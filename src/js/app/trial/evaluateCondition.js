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
		, conditionList = require('./conditionList');

	function evaluate(trial, conditions, inputData){
		var global = globalGetter();

		if (!conditions){
			throw new Error("There is an interaction without conditions!!");
		}

		// make sure conditions is an array
		conditions = _.isArray(conditions) ? conditions : [conditions];

		// the internal event
		inputData || (inputData = {});

		return _.every(conditions, function predicate(condition){
			var test = conditionList[condition.type];

			if (!_.isFunction(test)){
				throw new Error('Unknown condition type: ' + condition.type);
			}

			var result = test.call(null, trial, condition, inputData, global);
			return condition.negate ? !result : result;
		});
	}



	return evaluate;
});