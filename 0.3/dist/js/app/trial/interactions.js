define(function(require){
	/*
	 * Organizer for the interaction function
	 * Allows to subscribe and unsubscribe
	 *
	 */

	var $ = require('jquery')
		, pubsub = require('utils/pubsub')
		, evaluate = require('./evaluate')
		, activate = require('./action');

	var subscriptionStack = [];

	var interact = function(interactions,input_data){
		$.each(interactions,function(key,row){
			if (evaluate(row.conditions,input_data)) {
				// if this action includes endTrial we want to stop evalutation
				// otherwise we might evaluate using data from the next trial by accident...
				return activate(row.actions,input_data);
			}
		});
	};

	return {
		activate : function(interactions){
			// subscribe to input and interact with each input
			pubsub.subscribe('input',subscriptionStack,function(input_data){
				interact(interactions,input_data);
			});

			// start by checking for "begin" actions (must be after subscribing!)
			interact(interactions,{type:'begin', latency:0});
		},
		disable : function(){
			// unsubscribe from all interactions
			$.each(subscriptionStack,function(){
				pubsub.unsubscribe(this);
			});
		}
	};
});
