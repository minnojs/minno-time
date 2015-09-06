/*
 * activate logger
 * note that we are loading modules into the global object here (json2)
 */
define(function(require){

	var $ = require('jquery')
		, _ = require('underscore')
		, post = require('./post')
		, logStackGetter = require('./log_stack');


	function Logger(settings){
		this.settings = settings || {};
		this.lastSend = 0;
		this.allSent = $.when();
	}

	_.extend(Logger.prototype, {
		log: pushLog,
		sendChunk: sendChunk,
		sendAll: sendAll
	});


	function sendAll(){
		var logStack = logStackGetter();
		var logChunk =  logStack.slice(this.lastSend, logStack.length);

		// reset lastSend counter
		this.lastSend = logStack.length;

		if (logChunk.length){
			this.allSent = $.when(this.allSent, post(logChunk, this.settings));
		}

		return this.allSent;
	}
	/*
	 * Send all logs since lastSend
	 * @returns $.Deferred
	 */
	function sendChunk(){
		var logStack = logStackGetter();
		var pulse = this.settings.pulse || 0;

		// send if we have reached the pulse limit
		if (pulse && logStack.length - this.lastSend >= pulse) {
			this.sendAll();
		}

		return this.allSent;
	}

	/*
	 * create log row and push it into log stack
	 */
	function pushLog(trial, options, input_data){
		var logStack = logStackGetter();
		var logger = this.settings;
		// get the logger function
		var callback = logger.logger || defaultLogger;

		// add row to log stack
		var trialObj = trial;
		var row = callback.apply(trialObj,[trialObj.data, input_data, options,logStack]);

		if (logger.meta){
			if ($.isPlainObject(logger.meta)){
				$.extend(row, logger.meta);
			} else {
				throw new Error ('LOGGER: logger.meta must be an object but instead was a ' + typeof logger.meta);
			}
		}

		logStack.push(row);
	}

	function defaultLogger(trialData, inputData, actionData,logStack){

		var stimList = this._stimulus_collection.get_stimlist();
		var mediaList = this._stimulus_collection.get_medialist();

		return {
			log_serial : logStack.length,
			trial_id: this.counter,
			name: this.name(),
			responseHandle: inputData.handle,
			latency: Math.floor(inputData.latency),
			stimuli: stimList,
			media: mediaList,
			data: trialData
		};
	}

	return Logger;
});