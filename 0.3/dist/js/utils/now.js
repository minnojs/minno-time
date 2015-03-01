/* global performance */
define(function(){

	var nowFn;

	// if performance is set, look for the now function

	if (!!window.performance) {
		nowFn = performance.now  ||
        performance.mozNow    ||
        performance.webkitNow ||
        performance.msNow     ||
        performance.oNow;
	}

	// if we have now proxy it (so it uses perfomance as "this")
	// otherwise use regular date/time
	return nowFn ?
		function now(){return nowFn.apply(performance);}
		: function now(){ return +new Date();};

});
