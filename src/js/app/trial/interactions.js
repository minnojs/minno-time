define(function(require){
	/*
	 * Organizer for the interaction function
	 * Allows to subscribe and unsubscribe
	 *
	 */

	var evaluate = require('./evaluate')
		, activate = require('./action');

	return function interact(trial, interactions,inputData){
		var i, row;

		for (i=0;i<interactions.length;i++){
			row = interactions[i];
			if (evaluate(trial, row.conditions,inputData)) {
				// if this action includes endTrial we want to stop evalutation
				// otherwise we might evaluate using data from the next trial by accident...
				if (!activate(trial, row.actions,inputData)){
					break;
				}
			}
		}
	};
});
