define(["underscore"],function(_){

	/*
	 * timeout
	 *
	 * timeout(time,callback): shortcut for setTimeout
	 * timeout(time,stack,callback): shortcut for setTimeout, sets timer_id into stack array
	 *
	 * @todo: poll timer instead of using one long timeout
	 * http://ejohn.org/blog/accuracy-of-javascript-time/
	 * http://stackoverflow.com/questions/196027/is-there-a-more-accurate-way-to-create-a-javascript-timer-than-settimeout
	 * http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
	 */

	return function timeout(){
		var time = arguments[0];
		var stack = _.isArray(arguments[1]) ? arguments[1] : [];
		var callback = _.isFunction(arguments[1]) ? arguments[1] : arguments[2];
		var timer_id = 0;

		if (!time) {
			callback.call();
		} else {
			timer_id = setTimeout(callback,time);
			stack.push(timer_id);
		}

		return timer_id;
	};

});
