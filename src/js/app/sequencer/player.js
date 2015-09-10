define(function(require){

	var $					= require('jquery')
		, _ 				= require('underscore')
		, Trial				= require('app/trial/trialConstructor')
		, LoggerConstrucor	= require('app/task/log/logger')
		, main 				= require('app/task/main_view')
		, inflateTrial 		= require('./inflateTrial');


	function Player(settings){
		this.logger = new LoggerConstrucor(settings.logger);
	}

	_.extend(Player.prototype, {
		next: next,
		end: end,
		_activateTrial: activateTrial
	});

	/*
	 * the function that plays the source sequence
	 */

	// check if we have another trial, if so plays it, if not ends the task
	function next(destination, properties){
		var source = inflateTrial(destination, properties);
		if (source) {
			this._activateTrial(source);
		} else {
			this.end();
		}
	}

	function activateTrial(source){
		var logger = this.logger;
		var trial = new Trial(source, {container:main});
		trial.on('trial:log',logger.log, logger);
		trial.on('trial:end',logger.sendChunk, logger);
		trial.on('trial:end', emptyContainer);
		trial.on('trial:end', this.next, this);
		trial.activate();

		function emptyContainer(){
			// remove all stimuli from canvas (needs to be inside timeout to prevent blink in some browsers)
			// @todo: improve very ugly solution to ie7 bug, we need the no timeout solution for ipad where this causes a blink
			if (document.all && !document.addEventListener) {// IE7 or lower
				_.defer(function(){main.empty();});
			} else {
				main.empty();
			}
		}
	}

	function end(){
		var endTask = _.get(this.settings, 'hooks.endTask');
		// @TODO: this realy shouldn't be here. this whole function is responsible for too many things...
		//
		// post any data that hasn't been posted yet.
		// and then proceed to the end task hook or to redirect
		this.logger
			.sendAll()
			.always(function(){
				return $.when(endTask && endTask());
			})
			.always(function(){
				main.deferred.resolve();
			});

	}

	return Player;

});