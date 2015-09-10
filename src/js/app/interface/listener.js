define(function(require){

	var binder = require('./binder')
		, trigger = require('./triggerEvent');
	/*
	 * listener constructor
	 */
	function Listener(definitions, interfaceObj){

		// set listener handle
		this.handle = definitions.handle;

		// decorate listener with on and off functions
		binder(this,definitions);

		// activate listener:
		this.on(function(e,type){
			var eventData = trigger(e,type,definitions, interfaceObj.getLatency());
			interfaceObj.trigger(type,eventData);
		});

		// for now the destroyer simply unbinds the event
		this.destroy = this.off;
	}

	return Listener;

});
