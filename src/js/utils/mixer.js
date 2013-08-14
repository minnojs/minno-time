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
			var mixed, result;

			// if the value is wrapped in a mixer object we want to extract it and push it into the stack
			switch (mixer){
				case 'random' :
					mixed = _.shuffle(mix(value.data,true));
					result = shallow ? mixed : mix(mixed);	// if this is top level lets open all those wrappers now
					stack = stack.concat(result);
					break;
				case 'pick' :
					mixed = _.chain(value.data)
						.shuffle()								// first lets shuffle data so that the pick is random
						.first(value.n ? value.n : 1)			// then we pick the first n items
						.value();								// finaly lets get out of the chain
					result = shallow ? mixed : mix(mixed);		// if this is top level lets open all those wrappers now
					stack = stack.concat(result);
					break;
				case 'repeat' :
					mixed = mix(value.data,true);
					result = shallow ? mixed : mix(mixed);		// if this is top level lets open all those wrappers now
					for (var i = 0; i < value.times; i++) {
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
				default:
					// the value is unwrapped, lets push it as it is.
					stack.push(value);
			}
		});

		return stack;
	};

	return mix;
});
