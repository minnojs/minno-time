define(['underscore',"utils/pubsub","utils/interface/interface", 'app/global'],function(_,pubsub,input,global){
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
			if (typeof options.setter == 'undefined') {
				throw new Error('The setTrialAttr action requires a setter property');
			}
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
			pubsub.publish('trial:setInput',[{handle:options.handle,on:'timeout',duration:+options.duration || 0}]);
		},

		removeInput: function(options){
			if (typeof options.handle == 'undefined') {
				throw new Error('The removeInput action requires a handle property');
			}
			pubsub.publish('trial:removeInput',[options.handle]);
		},

		// we use es3 true to protect from trailing commas in IE7. Here jshint thinks goto is a reserved word.
		/* jshint es3:false */
		goto: function(options){
		/* jshint es3:true */

			pubsub.publish('trial:goto',[options]);
		},

		endTrial: function(){
			pubsub.publish('trial:end');
		},

		resetTimer: function(options,eventData){
			// set current evenData to 0
			eventData.latency = 0;
			// reset the global timer
			input.resetTimer();
		},

		/*
		 * Logger
		 */

		log: function(options,eventData){
			pubsub.publish('log',[options,eventData]);
		},

		/*
		 * Misc
		 */

		setGlobalAttr: function(options){
			switch (typeof options.setter){
				case 'function':
					options.setter.apply(null,[global(), options]);
					break;
				case 'object':
					_.extend(global(), options.setter);
					break;
				default:
					throw new Error('setGlobalAttr requires a "setter" property');
			}


		},

		custom: function(options,eventData){
			if (typeof options.fn != 'function') {
				throw new Error('The custom action requires a fn propery');
			}
			options.fn.apply(null, [options,eventData,global()]);
		}

	};

	return actions;
});