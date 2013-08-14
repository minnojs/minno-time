define(["utils/pubsub"],function(pubsub){
	var actions = {
		/*
		 * Stimulus actions
		 *
		 */

		showStim: function(options){
			var handle = options.handle || options;
			pubsub.publish('stim:start',[handle]);
		},

		hideStim: function(options){
			var handle = options.handle || options;
			pubsub.publish('stim:stop',[handle]);
		},

		setStimAttr: function(options){
			var handle = options.handle;
			var setter = options.setter;
			pubsub.publish('stim:setAttr',[handle,setter]);
		},

		/*
		 * Trial actions
		 */

		setTrialAttr: function(options){
			pubsub.publish('trial:setAttr',[options.setter]);
		},


		setInput: function(options){
			pubsub.publish('trial:setInput',[options.input]);
		},

		removeInput: function(options){
			pubsub.publish('trial:removeInput',[options.inputHandle]);
		},

		goto: function(options){
			pubsub.publish('trial:goto',[options]);
		},

		endTrial: function(){
			pubsub.publish('trial:end');
		},

		/*
		 * Logger
		 */

		log: function(options,input_data){
			pubsub.publish('log',[options,input_data]);
		}
	};

	return actions;
});