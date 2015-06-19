/**
 * Go to a destination within the sequence (must be a property of a sequence)
 * @param  {String} target destination type
 * @param  {Object} properties destination options
 * @return {Object}        result element
 */
define(function(require){
	var _ = require('underscore');

	return go;

	function go(destination, properties, context){
		var mixerSequence = this.mixerSequence;

		switch (destination){
			case 'nextWhere':
				where('next', properties, context, mixerSequence);
				break;
			case 'previousWhere':
				where('next', properties, context, mixerSequence);
				break;
			case 'current':
				// don't need to do anything...
				break;
			case 'first':
				do {mixerSequence.prev(context);} while (mixerSequence.current(context));
				break;
			case 'last':
				do {mixerSequence.next(context);} while (mixerSequence.current(context));
				mixerSequence.prev();
				break;
			case 'end':
				do {mixerSequence.next(context);} while (mixerSequence.current(context));
				break;
			case 'next' :
				mixerSequence.next(context); // get the next trial, in case there are no more trials, returns undefined
				break;
			default:
				throw new Error('Unknow destination "' + destination + '" for goto.');
		}

		return this;
	}

	function where(direction, properties, context, sequence){
		var curr;

		do {
			sequence[direction]();
			curr = sequence.current(context);
		} while (curr && !_.callback(properties)(curr.data));
	}
});