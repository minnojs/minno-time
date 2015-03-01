define(function(require){

	var $					= require('jquery')
		, sourceSequence	= require('./sourceSequence')
		, trialSequence		= require('./trialSequence')
		, Trial				= require('app/trial/trial_constructor')
		, logger			= require('app/task/log/logger')
		, settingsGetter	= require('app/task/settings')
		, pubsub			= require('utils/pubsub')
		, main 				= require('app/task/main_view');

	/*
	 * the function that plays the source sequence
	 */

	// check if we have another trial, if so plays it, if not ends the task
	function nextTrial(destination, properties){
		var source
			, trial;

		// get next trial
		switch (destination){
			case 'nextWhere':
				source = sourceSequence.nextWhere(properties);
				break;
			case 'previousWhere':
				source = sourceSequence.lastWhere(properties);
				break;
			case 'current':
				source = sourceSequence.current();
				break;
			case 'first':
				source = sourceSequence.first();
				break;
			case 'last':
				source = sourceSequence.last();
				break;
			case 'end':
				source = sourceSequence.end();
				break;
			case 'next' :
				/* falls through */
			default:
				source = sourceSequence.next(); // get the next trial, in case there are no more trials, returns undefined
		}

		// if we have another trial play it (next() both returns the next trial and sets it as current)
		if (source) {
			// create new trial and activate it
			trial = new Trial(sourceSequence.current());
			trial
				.activate()								// activate the trial
				.done(function(){
					pubsub.publish('log:send');			// see if we need to send the log stack
					nextTrial.apply(null,arguments);	// when we're done try to play the next one (move arguments on to nextTrial)
				});

			// let everyone know that we are ready to go
			pubsub.publish("trial:activated",[trial]);

			// push trial into the trial sequence
			trialSequence.add(trial);
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
