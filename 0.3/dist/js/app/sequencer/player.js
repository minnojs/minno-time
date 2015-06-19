define(function(require){

	var $					= require('jquery')
		, Trial				= require('app/trial/trial_constructor')
		, logger			= require('app/task/log/logger')
		, settingsGetter	= require('app/task/settings')
		, pubsub			= require('utils/pubsub')
		, main 				= require('app/task/main_view')
		, inflateTrial 		= require('./inflateTrial');


	/*
	 * the function that plays the source sequence
	 */

	// check if we have another trial, if so plays it, if not ends the task
	function nextTrial(destination, properties){

		var source = inflateTrial(destination, properties);
		var trial;

		// if we have another trial play it (next() both returns the next trial and sets it as current)
		if (source) {
			// create new trial and activate it
			trial = new Trial(source);
			trial
				.activate()								// activate the trial
				.done(function(){
					pubsub.publish('log:send');			// see if we need to send the log stack
					nextTrial.apply(null,arguments);	// when we're done try to play the next one (move arguments on to nextTrial)
				});

			// let everyone know that we are ready to go
			pubsub.publish("trial:activated",[trial]);
		} else {
			// @TODO: this realy shouldn't be here. this whole function is responsible for too many things...
			//
			// post any data that hasn't been posted yet.
			// and then proceed to the end task hook or to redirect
			logger()
				.always(function(){
					var hooks = settingsGetter('hooks') || {};
					return $.when(hooks.endTask && hooks.endTask());
				})
				.always(function(){
					main.deferred.resolve();
				});
		}
	}

	return nextTrial;

});
