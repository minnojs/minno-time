define(['jquery','utils/pubsub','./evaluate','./action','./current_trial'],function($,pubsub,evaluate,activate,trial){
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
			interact(interactions,{type:'begin'});

			// subscribe to input and interact with each input
			pubsub.subscribe('input',subscriptionStack,function(input_data){
				// set latency in input_data
				input_data.latency = input_data.timestamp - trial().beginTime;
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
