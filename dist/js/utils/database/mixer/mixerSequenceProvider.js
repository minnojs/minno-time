define(function(require){
	var _ = require('underscore');

	mixerSequenceProvider.$inject = ['mixer'];
	function mixerSequenceProvider(mix){

		/**
		 * MixerSequence takes an mixer array and allows browsing back and forth within it
		 * @param {Array} arr [a mixer array]
		 */
		function MixerSequence(arr){
			this.sequence = arr;
			this.stack = [];
			this.add(arr);
			this.pointer = 0;
		}

		_.extend(MixerSequence.prototype, {
			/**
			 * Add sequence to mixer
			 * @param {[type]} arr     Sequence
			 * @param {[type]} reverse Whether to start from begining or end
			 */
			add: function(arr, reverse){
				this.stack.push({pointer:reverse ? arr.length : -1,sequence:arr});
			},

			proceed: function(direction, context){
				// get last subSequence
				var subSequence = this.stack[this.stack.length-1];
				var isNext = (direction === 'next');

				// if we ran out of sequence
				// add the original sequence back in
				if (!subSequence) {
					throw new Error ('mixerSequence: subSequence not found');
				}

				subSequence.pointer += isNext ? 1 : -1;

				var el = subSequence.sequence[subSequence.pointer];

				// if we ran out of elements, go to previous level (unless we are on the root sequence)
				if (_.isUndefined(el) && this.stack.length > 1){
					this.stack.pop();
					return this.proceed.call(this,direction,context);
				}

				// if element is a mixer, mix it
				if (el && el.mixer){
					this.add(mix(el,context), !isNext);
					return this.proceed.call(this,direction,context);
				}

				// regular element or undefined (end of sequence)
				return this;
			},

			next: function(context){
				this.pointer++;
				return this.proceed.call(this, 'next',context);
			},

			prev: function(context){
				this.pointer--;
				return this.proceed.call(this, 'prev',context);
			},

			/**
			 * Return current element
			 * should **never** return a mixer - supposed to abstract them away
			 * @return {[type]} undefined or element
			 */
			current:function(){
				// get last subSequence
				var subSequence = this.stack[this.stack.length-1];

				if (!subSequence) {
					throw new Error ('mixerSequence: subSequence not found');
				}

				var el = subSequence.sequence[subSequence.pointer];

				if (!el){
					return undefined;
				}

				// extend element with meta data
				el.$meta = this.meta();

				return el;
			},

			meta: function(){
				return {
					number: this.pointer,

					// sum of sequence length, minus one (the mixer) for each level of stack except the last
					outOf:  _.reduce(this.stack, function(memo,sub){return memo + sub.sequence.length-1;},0)+1
				};
			}

		});

		return MixerSequence;
	}

	return mixerSequenceProvider;
});





