/*
 * activate logger
 * note that we are loading modules into the global object here (json2)
 */
define(function(require){

    var _ = require('underscore');
    var pubsub = require('utils/pubsub');
    var trial = require('app/trial/current_trial');
    var settings = require('app/task/settings');
    var send = require('./send');
    var logStackGetter = require('./log_stack');

    // counter for the last time we sent (it holds the last length for which we sent)
    var lastSend = 0;
    var promises = [];

    function defaultLogger(trialData, inputData, actionData,logStack){

        var fullpath = _.get(settings(), 'logger.fullpath', false);

        var stimList = this.stimulusCollection.getStimlist();
        var mediaList = this.stimulusCollection.getMedialist({fullpath:fullpath});

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
     * @returns promise
     */
    function sendChunk(){
        var logChunk, promise; // the log chunk we want to send right now
        var logStack = logStackGetter();

        // if we haven't sent all logs
        if (logStack.length - lastSend > 0) {
            // get the log chunk that we want to send
            logChunk =  logStack.slice(lastSend, logStack.length);

            // reset lastSend counter
            lastSend = logStack.length;
            promise = send(logChunk);
            promises.push(promise);
        }

        return Promise.all(promises);
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
            if (_.isPlainObject(logger.meta)) _.assign(row, logger.meta);
            else throw new Error ('LOGGER: logger.meta must be an object but instead was a ' + typeof logger.meta);
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
        var pulse = _.get(settings(), 'logger.pulse', 0);

        // if logStack is full, lets send it
        if (pulse && logStack.length - lastSend >= pulse) {
            sendChunk();
        }
    });

    return sendChunk;
});
