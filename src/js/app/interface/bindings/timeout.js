define(function(require){
	var timeout = require('utils/timeout')
		, randomize = require('utils/simpleRandomize');

	/*
	 * timeout listenter
	 *
	 * requires definitions.duration, otherwise fires immediately
	 */

	return function(listener, definitions){

		// all this has to happen in a seperate module (closure) so that the different timers don't overide one anather
		var Timeout = (function(){

			var duration = randomize(definitions.duration) || 0;
			var timerID;

			return {
				on : function(callback){
					timerID = timeout(duration,function(){
						callback({},'timeout');
					});
				},

				off : function(){
					clearTimeout(timerID);
				}
			};
		})();

		listener.on = Timeout.on;
		listener.off = Timeout.off;
	};
});