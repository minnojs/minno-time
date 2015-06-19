define(['underscore'],function(_){

	/**
	 * A function that maps a mixer object into a sequence.
	 *
	 * The basic structure of such an obect is:
	 * {
	 *		mixer: 'functionType',
	 *		remix : false,
	 *		data: [task1, task2]
	 *	}
	 *
	 * The results of the mix are set into `$parsed` within the original mixer object.
	 * if remix is true $parsed is returned instead of recomputing
	 *
	 * @param {Object} [obj] [a mixer object]
	 * @returns {Array} [An array of mixed objects]
	 */

	mixProvider.$inject = ['randomizeShuffle', 'randomizeRandom'];
	function mixProvider(shuffle, random){

		function mix(obj){
			var mixerName = obj.mixer;

			// if this isn't a mixer
			// make sure we catch mixers that are set with undefined by accident...
			if (!(_.isPlainObject(obj) && 'mixer' in obj)){
				return [obj];
			}

			if (_.isUndefined(mix.mixers[mixerName])){
				throw new Error('Mixer: unknow mixer type = ' + mixerName);
			}

			if (!obj.remix && obj.$parsed) {
				return obj.$parsed;
			}

			obj.$parsed = mix.mixers[mixerName].apply(null, arguments);

			return obj.$parsed;
		}

		mix.mixers = {
			wrapper : function(obj){
				return obj.data;
			},

			repeat: function(obj){
					var sequence = obj.data || [];
					var result = [], i;
					for (i=0; i < obj.times; i++){
						result = result.concat(_.clone(sequence,true));
					}
					return result;
			},

			// randomize any elements
			random: function(obj, context){

				function randomDeepMixer(sequence){
					return _.reduce(sequence, function(arr,value){
						if (_.isPlainObject(value) && 'mixer' in value && value.mixer != 'wrapper'){
							var seq = mix(value, context);
							return arr.concat(seq);
						} else {
							return arr.concat([value]);
						}
					}, []);
				}

				var sequence = obj.data || [];
				return shuffle(randomDeepMixer(sequence));
			},

			choose: function(obj){
				var sequence = obj.data || [];
				return _.take(shuffle(sequence), obj.n ? obj.n : 1);
			},

			weightedRandom: function(obj){
				var sequence = obj.data || [];
				var i;
				var total_weight = _.reduce(obj.weights,function (prev, cur) {
					return prev + cur;
				});

				var random_num = random() * total_weight; // cutoff - when we reach this sum - we've reached the desired weight
				var weight_sum = 0;

				for (i = 0; i < sequence.length; i++) {
					weight_sum += obj.weights[i];
					weight_sum = +weight_sum.toFixed(3);

					if (random_num <= weight_sum) {
						return [obj.data[i]];
					}
				}
				throw new Error('Mixer: something went wrong with weightedRandom');
			}
		};

		return mix;
	}

	return mixProvider;
});