define(['./binder','./triggerEvent'],function(binder,trigger){

	/*
	 * listener constructor
	 */
	return function Listener(definitions, interfaceObj){

		// set listener handle
		this.handle = definitions.handle;

		// decorate listener with on and off functions
		binder(this,definitions);

		// activate listener:
		this.on(function(e,type){
			trigger(e,type,definitions, interfaceObj.getLatency());
		});

		// for now the destroyer simply unbinds the event
		this.destroy = this.off;
	};

});
