/*
 * activate logger
 * note that we are loading modules into the global object here (json2)
 */
define(function(require){

	var $ = require('jquery')
		, pubsub = require('utils/pubsub')
		, trial = require('app/trial/current_trial')
		, settings = require('app/task/settings')
		, post = require('./post')
		, logStackGetter = require('./log_stack');

	// counter for the last time we sent (it holds the last length for which we sent)
	var lastSend = 0;
	var postDef = $.Deferred().resolve(); // a defered to follow all posting

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

	/*
	 * Send all logs since lastSend
	 * @returns $.Deferred
	 */
	function sendChunk(){
		var logChunk; // the log chunk we want to send right now
		var logStack = logStackGetter();

		// if  we've already sent everything,  we don't need to do anything
		if (logStack.length - lastSend <= 0) {
			return postDef;
		} else {
			// get the log chunk that we want to send
			logChunk =  logStack.slice(lastSend, logStack.length);

			// reset lastSend counter
			lastSend = logStack.length;
			return $.when(postDef, post(logChunk));
		}
	}

	/*
	 * create log row and push it into log stack
	 */
	pubsub.subscribe('log',function(options, input_data){
		var logStack = logStackGetter();
		// get settings
		var logger = settings().logger || {};
		// get the logger function
		var callback = logger.logger ? logger.logger : defaultLogger;

		// add row to log stack
		var trialObj = trial();
		var row = callback.apply(trialObj,[trialObj.data, input_data, options,logStack]);

		if (logger.meta){
			if ($.isPlainObject(logger.meta)){
				$.extend(row, logger.meta);
			} else {
				throw new Error ('LOGGER: logger.meta must be an object but instead was a ' + typeof logger.meta);
			}
		}

		logStack.push(row);
	});

	/*
	 * send logStack to server, but only if it is full
	 * The end task send is activated directly using the send function
	 */
	pubsub.subscribe('log:send',function(){
		var logStack = logStackGetter();
		// get pulse size
		var pulse = settings().logger && settings().logger.pulse;

		// if logStack is full, lets send it
		if (pulse && logStack.length - lastSend >= pulse) {
			sendChunk();
		}
	});

	return sendChunk;
});