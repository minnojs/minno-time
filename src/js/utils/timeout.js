define(function(require){

	/*
	 * timeout
	 *
	 * timeout(time,callback): shortcut for setTimeout
	 * timeout(time,stack,callback): shortcut for setTimeout, sets timer_id into stack array
	 *
	 * @todo: poll timer instead of using one long timeout
	 * http://ejohn.org/blog/accuracy-of-javascript-time/
	 * http://stackoverflow.com/questions/196027/is-there-a-more-accurate-way-to-create-a-javascript-timer-than-settimeout
	 * http://www.sitepoint.com/creating-accurate-timers-in-javascript/
	 * http://stackoverflow.com/questions/6875625/does-javascript-provide-a-high-resolution-timer/6875666#6875666
	 * http://www.websanova.com/blog/javascript/how-to-write-an-accurate-game-timer-in-javascript#.UmZ1PHh4uak
	 */

	var _ = require('underscore');

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
