define(function(require){
	var _ = require('underscore');

	// the pubsub object itself
	var pubsub = {};

	// the topic/subscription hash
	var cache = {};
	var counters ={};

	pubsub.publish = function(/* String */topic, /* Array? */args){
		// summary:
		//		Publish some data on a named topic.
		// topic: String
		//		The channel to publish on
		// args: Array?
		//		The data to publish. Each array item is converted into an ordered
		//		arguments on the subscribed functions.
		//
		// example:
		//		Publish stuff on '/some/topic'. Anything subscribed will be called
		//		with a function signature like: function(a,b,c){ ... }
		//
		//	|		$.publish("/some/topic", ["a","b","c"]);
		// log(topic,args);

		cache[topic] && _.each(cache[topic], function(func){
			func.apply(pubsub, args || []);
		});

	};

	pubsub.subscribe = function(/* String */topic, /* Function */callback){
		// summary:
		//		Register a callback on a named topic.
		// topic: String
		//		The channel to subscribe to
		// subStack: Array
		//		Optional, an array to which we push the subscription handle
		// callback: Function
		//		The handler event. Anytime something is $.publish'ed on a
		//		subscribed channel, the callback will be called with the
		//		published array as ordered arguments.
		//
		// returns: Array
		//		A handle which can be used to unsubscribe this particular subscription.
		//
		// example:
		//	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//
		// example:
		//	|	$.subscribe("/some/topic", "/handle/stack", function(a, b, c){ /* handle data */ });

		var subStack;

		// if second argument is not a call back use it as the subscription stack
		if (_.isFunction(callback)) {
			subStack = [];
		} else {
			subStack = arguments[1];
			callback = arguments[2];
		}

		if(!cache[topic]){
			cache[topic] = {};
			counters[topic] = 0;
		}

		cache[topic][counters[topic]++] = callback;

		subStack.push([topic, callback]);
		return [topic, callback]; // Array
	};

	pubsub.unsubscribe = function(/* Array */handle){
		// summary:
		//		Disconnect a subscribed function for a topic.
		// handle: Array
		//		The return value from a $.subscribe call.
		// example:
		//	|	var handle = $.subscribe("/something", function(){});
		//	|	$.unsubscribe(handle);

		var t = handle[0];
		cache[t] && _.each(cache[t], function(func, idx){
			func == handle[1] && delete(cache[t][idx]);
		});
	};

	return pubsub;
});




