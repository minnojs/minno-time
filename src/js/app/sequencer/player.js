define(function(require){

	var $					= require('jquery')
		, _ 				= require('underscore')
		, Trial				= require('app/trial/trialConstructor')
		, LoggerConstrucor	= require('app/task/log/logger')
		, ContainerView		= require('app/task/containerView')
		, inflateTrial 		= require('./inflateTrial')
		, Database 			= require('utils/database/main')
		, parse 			= require('app/task/parser')
		, global 			= require('app/global');


	function Player(script){
		this.script 	= script;
		this.settings 	= script.settings || {};
		this.db 		= new Database();
		this.logger 	= new LoggerConstrucor(this.settings.logger);
		this.container  = new ContainerView({settings: this.settings});
		this.sequence 	= parse(this.db, this.script);
		this.setup();
	}

	_.extend(Player.prototype, {
		next: next,
		end: end,
		_activateTrial: activateTrial,
		setup: setup
	});


	function setup(){
		// init global
		var script = this.script;
		var glob = global();
		var name = script.name || 'anonymous PIP';

		// create local namespace
		glob[name] = glob.current = (_.isPlainObject(script.current) ? script.current : {});
		glob.current.logs || (glob.current.logs = []); // @TODO: set logs object from logger
	}

	/*
	 * the function that plays the source sequence
	 */

	// @TODO: this weirds me out, we have a loop jumping between next and activateTrial
	// check if we have another trial, if so plays it, if not ends the task
	function next(destination, properties){
		var source = inflateTrial(this.db, destination, properties);
		if (source) {
			this._activateTrial(source);
		} else {
			this.end();
		}
	}

	function activateTrial(source){
		var logger = this.logger;
		var trial = new Trial(source, {container:this.container});
		trial.on('trial:log',logger.log, logger);
		trial.on('trial:end',logger.sendChunk, logger);
		trial.on('trial:end', emptyContainer);
		trial.on('trial:end', this.next, this);
		trial.activate();

		function emptyContainer(){
			var main = this.container;
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
		var main = this.container;
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