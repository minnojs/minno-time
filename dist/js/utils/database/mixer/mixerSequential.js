define(function(require){
	var _ = require('underscore');

	mixerSequentialProvider.$inject = ['mixer'];
	function mixerSequentialProvider(mix){
		function mixerSequential(sequence, context, depth){
			var mixed;
			var obj = sequence[0];

			depth = depth || 0;
			if (depth++ >= 10){
				throw new Error('Mixer: the mixer allows a maximum depth of 10');
			}

			if (_.isUndefined(obj.mixer)){
				return sequence;
			}

			// mix obj
			mixed = mix(obj, context);

			// remove obj from sequence
			sequence.shift();

			// concat mixed and sequence
			mixed = mixed.concat(sequence);

			return _.isUndefined(mixed[0]) || _.isUndefined(mixed[0].mixer) ? mixed : mixerSequential(mixed, context, depth);
		}

		return mixerSequential;
	}

	return mixerSequentialProvider;
});