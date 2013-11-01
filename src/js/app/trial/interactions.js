define(['jquery','utils/pubsub','./evaluate','./action'],function($,pubsub,evaluate,activate){
	/*
	 * Organizer for the interaction function
	 * Allows to subscribe and unsubscribe
	 *
	 */
	var subscriptionStack = [];

	var interact = function(interactions,input_data){
		$.each(interactions,function(key,row){
			if (evaluate(row.propositions,input_data)) {
				activate(row.actions,input_data);
			}
		});
	};

	return {
		activate : function(interactions){
			// start by checking for "begin" actions
			interact(interactions,{type:'begin', latency:0});

			// subscribe to input and interact with each input
			pubsub.subscribe('input',subscriptionStack,function(input_data){
				interact(interactions,input_data);
			});
		},
		disable : function(){
			// unsubscribe from all interactions
			$.each(subscriptionStack,function(){
				pubsub.unsubscribe(this);
			});
		}
	};
});
