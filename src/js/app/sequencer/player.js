define(function(require){

	var $					= require('jquery')
		, _ 				= require('underscore')
		, Trial				= require('app/trial/trialConstructor')
		, Events 			= require('backbone').Events
		, LoggerConstrucor	= require('app/task/log/logger')
		, ContainerView		= require('app/task/containerView')
		, inflateTrial 		= require('./inflateTrial')
		, Database 			= require('utils/database/main')
		, parse 			= require('app/task/parser')
		, global 			= require('app/global')
		, preload = require('app/sequencer/sequencePreload');


	function Player(script){
		this.script 		= script;
		this.settings 		= script.settings || {};
		this.db 			= new Database();
		this.logger 		= new LoggerConstrucor(this.settings.logger);
		this.container  	= new ContainerView({settings: this.settings});
		this.sequence 		= parse(this.db, this.script);
		this.currentTrial	= null;

		this._setup();
	}

	_.extend(Player.prototype, Events, {
		start: start,
		stop: stop,
		next: next,
		_activateTrial: activateTrial,
		_setup: setup
	});

	/**
	 * A helper method for setting up the current object
	 * And other stuff when needed...
	 * @return {null}
	 */
	function setup(){
		// init global
		var script = this.script;
		var glob = global();
		var name = script.name || 'anonymous PIP';

		// create local namespace
		glob[name] = glob.current = (_.isPlainObject(script.current) ? script.current : {});
		glob.current.logs || (glob.current.logs = []); // @TODO: set logs object from logger
	}



	/**
	 * The function that proceeds to the next step
	 * @param {Array} nextArr An array of the form [destination, params]
	 */
	// @TODO: this weirds me out, we have a loop jumping between next and activateTrial
	// check if we have another trial, if so plays it, if not ends the task
	function next(nextArr){
		var source = inflateTrial(this.db, nextArr, this.settings);
		if (source) {
			this._activateTrial(source);
		} else {
			this.currentTrial = null;
			this.stop();
		}
	}

	/**
	 * Get the source for a trial and set it up in relation to the logger
	 * Also
	 * @param  {[type]} source [description]
	 * @return {[type]}        [description]
	 */
	function activateTrial(source){
		var logger = this.logger;
		var trial = new Trial(source, {container:this.container, settings: this.settings});
		trial.on('trial:log',logger.log, logger);
		trial.on('trial:end',logger.sendChunk, logger);
		trial.on('trial:end', this.container.empty, this.container);
		trial.on('trial:end', this.next, this);
		trial.start();

		this.currentTrial = trial;
	}

	function start(){
		var container = this.container;
		var parseDef = preload(this.script);
		var player = this;


		container.activate();
		container
			.loading(parseDef) // activate loading screen
			.done(function(){
				player.next(['next', {}]); // activate task
			})
			.fail(function(src){
				throw new Error('loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - ' + src +')');
			});
	}

	function stop(){
		var player = this;
		var trial = this.currentTrial;


		// if we have an active trial, stop it.
		trial && trial.stop();

		// post any data that hasn't been posted yet.
		// and then proceed to the end task hook
		this.logger
			.sendAll()
			.always(function(){
				var endTask = _.get(player.settings, 'hooks.endTask');
				return $.when(endTask && endTask());
			})
			.always(function(){
				player.container.destroy();
				player.trigger('done');
			});
	}

	return Player;
});