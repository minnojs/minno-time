define(function(require){

	var $					= require('jquery')
		, _ 				= require('underscore')
		, Trial				= require('app/trial/trial_constructor')
		, settingsGetter	= require('app/task/settings')
		, LoggerConstrucor	= require('app/task/log/logger')
		, main 				= require('app/task/main_view')
		, inflateTrial 		= require('./inflateTrial')
		, logger;


	/*
	 * the function that plays the source sequence
	 */

	// check if we have another trial, if so plays it, if not ends the task
	function nextTrial(destination, properties){
		// @TODO we should find a better way to pass the logger around. this way we're just cheating a singleton
		logger = logger || new LoggerConstrucor(settingsGetter().logger);

		var source = inflateTrial(destination, properties);
		var trial;

		// if we have another trial play it (next() both returns the next trial and sets it as current)
		if (source) {
			// create new trial and activate it
			trial = new Trial(source, {container:main});
			trial.on('trial:log',logger.log, logger);

			trial
				.activate()	// activate the trial
				.then(function(){
					// remove all stimuli from canvas (needs to be inside timeout to prevent blink in some browsers)
					// @todo: improve very ugly solution to ie7 bug, we need the no timeout solution for ipad where this causes a blink
					if (document.all && !document.addEventListener) {// IE7 or lower
						_.defer(function(){main.empty();});
					} else {
						main.empty();
					}

					logger.sendChunk();

					nextTrial.apply(null,arguments);	// when we're done try to play the next one (move arguments on to nextTrial)
				});
		} else {
			// @TODO: this realy shouldn't be here. this whole function is responsible for too many things...
			//
			// post any data that hasn't been posted yet.
			// and then proceed to the end task hook or to redirect
			logger
				.sendAll()
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