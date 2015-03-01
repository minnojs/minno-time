define(['jquery','./action_list'],function($,action_list){
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

	return function(actions,eventData){
		// marks whether this is the final action to take
		var continueActions = true;

		if (!actions){
			throw new Error("There is an interaction without actions!!");
		}
		actions = $.isArray(actions) ? actions : [actions];

		$.each(actions,function(index,action){
			if (action_list[action.type]) {
				// currently the only reason to halt action activation is the endTrial command
				if (action.type === 'endTrial'){
					continueActions = false;
				}
				action_list[action.type](action, eventData);
			} else {
				throw new Error('unknown action: ' + action.type);
			}
		});

		return continueActions;
	};
});
