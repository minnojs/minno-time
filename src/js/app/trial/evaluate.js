define(['underscore','./current_trial'],function(_,current_trial){
	/*
	 * gets a proposition array (or a single proposition) and evaluates it
	 * returns true if all statements are true, false otherwise
	 *
	 * a single proposition looks like this:
	 *
	 *	proposition = {
	 *		type : 'begin/inputEquals/trialEquals/stimEquals/function',
	 *		value: 'right/trialAttribute/stimAttribute/customFunction',
	 *		handle: 'stim handle' (optional in case we're targeting a stimulus)
	 *	}
	 *
	 */

	return function evaluate(propositions, inputData){


		var trial = current_trial();

		// make sure propositions is an array
		propositions = _.isArray(propositions) ? propositions : [propositions];

		// the internal event
		inputData = inputData || {};

		// assume proposition is true
		var isTrue = true;

		// if this is a begin event, make sure we only run propositions that have begin in them
		if (inputData.type == 'begin') {
			// check if this set of propositions has 'begin' in it
			var has_begin = _.reduce(propositions, function(memo, row){return memo || row.type == 'begin';},false);
			if (!has_begin){
				return false;
			}
		}

		// try to refute the proposition
		_.each(propositions,function(proposition){
			var evaluation = true;
			switch (proposition.type){
				case 'begin':
					if (inputData.type !== 'begin') {
						evaluation = false;
					}
					break;

				case 'inputEquals' :
					// make sure proposition.value is an array
					_.isArray(proposition.value) || (proposition.value = [proposition.value]);

					if (_.indexOf(proposition.value,inputData.handle) === -1) {
						evaluation = false;
					}
					break;

				case 'trialEquals':
					if (inputData.handle !== trial.data[proposition.value]) {
						evaluation = false;
					}
					break;

				case 'stimEquals':
					// create search object
					var searchObj = {};
					if (proposition.handle){
						searchObj['handle'] = proposition.handle;
					}
					searchObj[proposition.value] = inputData.handle;

					// are there stimuli answering this descriptions?
					var result = trial._stimulus_collection.whereData(searchObj);
					if (result.length === 0) {
						evaluation = false;
					}
					break;

				case 'function' :
					if (!proposition.value.apply(trial,[trial,inputData])) {
						evaluation = false;
					}
			}

			isTrue = isTrue && (proposition.negate ? !evaluation : evaluation);
		});

		return isTrue;
	};
});