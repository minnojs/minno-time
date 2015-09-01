define(function(require){
	var _ = require('underscore')
		, Listener = require('./listener')
		, is_touch_device = require('../is_touch')
		, now = require('./now');


	/*
	 * adds and removes listeners from the stack
	 *
	 * function add(definitions): add listener, see ./binder.js for more details and options
	 *
	 * definitions = {
	 *		handle: 'listener name',
	 *		on: listener type (click, keypressed, various shortcuts)
	 * }
	 *
	 */

	var listenerStack = [] // holds all active listeners
		, baseTime = 0;

	return {
		// get latency (time since last reset)
		getLatency: function(){
			return now() - baseTime;
		},

		// reset timer
		resetTimer: function(){
			baseTime = now();
		},

		// add listeners
		add: function(definitions){
			if (!definitions){
				throw new Error('Missing input element. Could not add input listener');
			}

			var interfaceObj = this;
			// make sure definitions is set as an array
			var definitionsArr = _.isArray(definitions) ? definitions : [definitions];

			// for each definitions object create a listener
			_.forEach(definitionsArr,function(definition){
				// if this listener is targeted specificaly at a touch\!touch device
				if (!_.isUndefined(definition.touch)) {
					// if needed, skip this listener
					if (is_touch_device && !definition.touch) {
						return true;
					}
					if (!is_touch_device && definition.touch) {
						return true;
					}
				}

				var listener = new Listener(definition, interfaceObj);
				listenerStack.push(listener);
			});

		},

		// remove listeners
		remove: function(handleList){
			handleList = _.isArray(handleList ) ? handleList  : [handleList ];

			// go through the listener stack and remove any listeners that fit the handle list
			// note that we do this in reverse so that the index does not change
			for (var i = listenerStack.length - 1; i >= 0 ; i--){
				var listener = listenerStack[i];
				if (_.indexOf(handleList,listener.handle) != -1){
					listener.off();
					listenerStack.splice(i,1);
				}
			}
		},

		// remove all listeners
		destroy: function(){
			// destroy each listener
			_.invoke(listenerStack,'destroy');

			// empty stack
			listenerStack = [];
		}
	};
});