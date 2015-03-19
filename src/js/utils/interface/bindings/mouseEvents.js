define(function(require){
	var $ = require('jquery')
		, _ = require('underscore');

	/**
	 * Decorates a Listener with the on and off functions for a mouse event
	 *
	 * It attaches a listener for event name to all elements that have definitions.stimHandle
	 *
	 * @param  {String} eventName   The event name to bind
	 * @param  {Object} listener    The listener object to decorate
	 * @param  {Object} definitions A definitions (options) object
	 * @return {Object}             A decorator function
	 */
	function mouseEventsDecorator(eventName, listener,definitions){
		listener.on = function(callback){
			function activateCallback(e){
				callback(e,eventName);
			};

			// If we're binding to an existing element, bind to its appropriate handle
			$(document).on(eventName + '.interface','[data-handle="'+definitions.stimHandle + '"]', activateCallback);
		};

		listener.off = function(){
			$(document).off(eventName + '.interface','[data-handle="'+definitions.stimHandle + '"]');
		};
	}

	return mouseEventsDecorator;
});