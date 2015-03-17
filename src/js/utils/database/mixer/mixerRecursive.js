define(function(require){
	var _ = require('underscore');

	mixerRecursiveProvider.$inject = ['mixer'];
	function mixerRecursiveProvider(mix){
		function mixerRecursive(sequence, context, depth){
			var mixed = [];

			depth = depth || 0;
			if (depth++ >= 10){
				throw new Error('Mixer: the mixer allows a maximum depth of 10');
			}

			mixed = _(sequence)
				.map(function(obj){

					if (_.isUndefined(obj.mixer)){
						return obj;
					}

					// mix object, and recursively mix the result
					return mixerRecursive(mix(obj, context), context, depth);
				})
				.flatten()
				.value();

			return mixed;
		}

		return mixerRecursive;
	}

	return mixerRecursiveProvider;
});