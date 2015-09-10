define(function(){
	/*
	 * manages composing the event
	 */
	return function triggerEvent(event,type,definitions, latency){
		return {
			timestamp	: +new Date(),
			latency		: latency,
			handle		: definitions.handle,			// right/left and so on
			type		: type,							// holds click/keypressed and so on
			e			: event							// the original event if available. just in case
		};
	};

});
