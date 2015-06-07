define(function(require){
	var _ = require('underscore');

	SequenceProvider.$inject = ['MixerSequence'];
	function SequenceProvider(MixerSequence){

		/**
		 * Sequence Constructor:
		 * Manage the progression of a sequence, including parsing (mixing, inheritance and templating).
		 * @param  {String  } namespace [pages or questions (the type of db.Store)]
		 * @param  {Array   } arr       [a sequence to manage]
		 * @param  {Database} db        [the db itself]
		 */

		function Sequence(namespace, arr,db){
			this.namespace = namespace;
			this.mixerSequence = new MixerSequence(arr);
			this.db = db;
		}

		_.extend(Sequence.prototype, {
			// only mix
			next: function(context){
				this.mixerSequence.next(context);
				return this;
			},

			// anti mix
			prev: function(context){
				this.mixerSequence.prev(context);
				return this;
			},

			/**
			 * Return the element currently in focus.
			 * It always returns either an element or undefined (mixers are abstrcted away)
			 * @param  {[type]} context [description]
			 * @return {[type]}         [description]
			 */
			current: function(context, options){
				context || (context = {});
				// must returned an element or undefined
				var obj = this.mixerSequence.current(context);

				// in case this is the end of the sequence
				if (!obj){
					return obj;
				}

				return this.db.inflate(this.namespace, obj, context, options);
			},

			/**
			 * Returns an array of elements, created by proceeding through the whole sequence.
			 * @return {[type]} [description]
			 */
			all: function(context, options){
				var sequence = [];

				var el = this.next().current(context, options);
				while (el){
					sequence.push(el);
					el = this.next().current(context, options);
				}

				return sequence;
			}
		});

		return Sequence;
	}

	return SequenceProvider;
});