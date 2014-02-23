define(['underscore','./current_trial'],function(_,current_trial){
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

	return function evaluate(conditions, inputData){


		var trial = current_trial();

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
					var searchObj = {};
					if (condition.handle){
						searchObj['handle'] = condition.handle;
					}
					searchObj[condition.property] = inputData.handle;

					// are there stimuli answering this descriptions?
					var result = trial._stimulus_collection.whereData(searchObj);
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