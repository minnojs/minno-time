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
		, logStack = require('./log_stack');

	// counter for the last time we sent (it holds the last length for which we sent)
	var lastSend = 0;

	var defaultLogger = function(trialData, inputData, actionData,logStack){

		var stimList = this._stimulus_collection.get_stimlist();
		var mediaList = this._stimulus_collection.get_medialist();

		return {
			log_serial : logStack.length,
			trial_id: this._id,
			name: this.name(),
			responseHandle: inputData.handle,
			latency: inputData.latency,
			stimuli: stimList,
			media: mediaList,
			data: trialData
		};
	};

	/*
	 * Send all logs since lastSend
	 * @returns $.Deferred
	 */
	var sendChunk = function(){
		var logChunk; // the log chunk we want to send right now

		// if  we've already sent everything,  we don't need to do anything
		if (logStack.length - lastSend <= 0) {
			return $.Deferred().resolve();
		} else {
			// get the log chunk that we want to send
			logChunk =  logStack.slice(lastSend, logStack.length);

			// reset lastSend counter
			lastSend = logStack.length;
			return post(logChunk);
		}
	};

	/*
	 * create log row and push it into log stack
	 */
	pubsub.subscribe('log',function(options, input_data){
		// get settings
		var logger = settings.logger || {};
		// get the logger function
		var callback = logger.logger ? logger.logger : defaultLogger;

		// add row to log stack
		var row = callback.apply(trial(),[trial().data, input_data, options,logStack]);
		logStack.push(row);
	});

	/*
	 * send logstack to server, but only if it is full
	 * The end task send is activated directly using the send function
	 */
	pubsub.subscribe('log:send',function(){
		// get pulse size
		var pulse = settings.logger && settings.logger.pulse;

		// if logstack is full, lets send it
		if (pulse && logStack.length - lastSend >= pulse) {
			sendChunk();
		}
	});

	return sendChunk;
});
