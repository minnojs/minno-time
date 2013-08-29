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

		setTrialAttr: function(options, eventData){
			pubsub.publish('trial:setAttr',[options.setter, eventData]);
		},

		setInput: function(options){
			if (typeof options.input == 'undefined') {
				throw new Error('The setInput action requires an input property');
			}
			pubsub.publish('trial:setInput',[options.input]);
		},

		trigger: function(options){
			if (typeof options.handle == 'undefined') {
				throw new Error('The trigger action requires a handle property');
			}
			pubsub.publish('trial:setInput',[{handle:options.handle,on:'timeout',duration:0}]);
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

		log: function(options,eventData){
			pubsub.publish('log',[options,eventData]);
		}
	};

	return actions;
});