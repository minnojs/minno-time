define(function(require){
	/*
	 * accepts an array of actions (or a single action)
	 * and applies them
	 *
	 * actions = [
	 *		{type:actionName,more:options},
	 *		{actionName:options}
	 * ]
	 * @param actions: single action object or array of action objects
	 * @param eventData: eventData object
	 * @returns Boolean continueActions: whether this action stops further action activations
	 */

	var _ = require('underscore')
		, action_list = require('./action_list');

	function applyActions(actions,eventData){
		// marks whether this is the final action to take
		var continueActions = true;

		if (!actions){
			throw new Error("There is an interaction without actions!!");
		}

		actions = _.isArray(actions) ? actions : [actions];

		_.forEach(actions,function(action){
			var actionFn = action_list[action.type];
			if (action) {
				// currently the only reason to halt action activation is the endTrial command
				if (action.type === 'endTrial'){
					continueActions = false;
				}
				actionFn(action, eventData);
			} else {
				throw new Error('unknown action: ' + action.type);
			}
		});

		return continueActions;
	}

	return applyActions;
});
