define(['underscore'],function(_){

	/*
	 * mixes an array according to mix objects
	 *
	 * The basic structure of such an obect is:
	 * {
	 *		mixer: 'functionType',
	 *		data: [task1, task2]
	 *	}
	 *
	 * @param list - the array to be mixed
	 * @param shallow - for inner use only: mix without opening wrappers. this allows us to open randoms and repeats
	 */
	var mix = function(list,shallow){
		var stack = [];

		_.each(list, function(value){
			var mixer = _.isObject(value) ? value.mixer : undefined;
			var mixed, result, i;

			// if the value is wrapped in a mixer object we want to extract it and push it into the stack
			switch (mixer){
				case 'random' :
					mixed = _.shuffle(mix(value.data,true));
					result = shallow ? mixed : mix(mixed);		// if this is top level lets open all those wrappers now
					stack = stack.concat(result);
					break;
				case 'weightedRandom':
					var total_weight = _.reduce(value.weights,function (prev, cur) {
						return prev + cur;
					});

					var random_num = Math.random() * total_weight; // cutoff - when we reach this sum - we've reached the desired weight
					var weight_sum = 0;

					for (i = 0; i < value.data.length; i++) {
						weight_sum += value.weights[i];
						weight_sum = +weight_sum.toFixed(3);

						if (random_num <= weight_sum) {
							mixed = [value.data[i]];
							break; //break out of the loop
						}
					}
					result = shallow ? mixed : mix(mixed);		// if this is top level lets open all those wrappers now
					stack = stack.concat(result);
					break;
				case 'choose' :
					mixed = _.chain(value.data)
						.shuffle()								// first lets shuffle data so that the choice is random
						.first(value.n ? value.n : 1)			// then we choose the first n items
						.value();								// finaly lets get out of the chain
					result = shallow ? mixed : mix(mixed);		// if this is top level lets open all those wrappers now
					stack = stack.concat(result);
					break;
				case 'repeat' :
					mixed = mix(value.data,true);
					for (i = 0; i < value.times; i++) {
						result = shallow ? mixed : mix(mixed);		// if this is top level lets open all those wrappers now
						stack = stack.concat(result);
					}
					break;
				case 'wrapper' :
					// if this is a shallow mix, don't mix the wrapper yet
					if (shallow) {
						stack.push(value);
					} else {
						stack = stack.concat(mix(value.data));
					}
					break;
				case undefined:
					// the value is unwrapped, lets push it as it is.
					stack.push(value);
					break;
				default:
					throw new Error('Unknown wrapper ' + mixer);
			}
		});

		return stack;
	};

	return mix;
});