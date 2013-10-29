define(['utils/pubsub','utils/now'],function(pubsub,now){
	/*
	 * manages publishing the event
	 */
	return function triggerEvent(event,type,definitions){

		var data = {
			timestamp	: now(),
			handle		: definitions.handle,	// right/left and so on
			type		: type,					// holds click/keypressed and so on
			e			: event					// the original event if available. just in case
		};

		pubsub.publish("input",[data]);
	};

});
