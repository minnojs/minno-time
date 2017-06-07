define(function(require){

    var Trial				= require('app/trial/trial_constructor');
    var logger			= require('app/task/logger/logger');
    var settingsGetter	= require('app/task/settings');
    var inflateTrial 		= require('./inflateTrial');
    var noop = function(){};


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
            trial = new Trial(source, canvas);
            trial.onend = nextTrial; // when we're done try to play the next one (move arguments on to nextTrial)
            trial.start();
        } else {
            // @TODO: this realy shouldn't be here. this whole function is responsible for too many things...
            //
            // post any data that hasn't been posted yet.
            // and then proceed to the end task hook or to redirect
            logger()
            .always(function(){
                var hooks = settingsGetter('hooks') || {};
                var endTask = hooks.endTask || settingsGetter('onEnd') || noop;
                return Promise.resolve(endTask());
            });
        }
    }

    return nextTrial;
});
