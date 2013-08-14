define(['jquery','./action_list'],function($,action_list){
	/*
	 * accepts an array of actions (or a single action)
	 * and applies them
	 *
	 * actions = [
	 *		{type:actionName,more:options},
	 *		{actionName:options}
	 * ]
	 */

	return function(actions,input_data){
		actions = $.isArray(actions) ? actions : [actions];

		$.each(actions,function(index,action){
			if (action_list[action.type]) {
				action_list[action.type](action, input_data);
			} else {
				throw new Error('unknown action: ' + action.type);
			}
		});
	};
});
