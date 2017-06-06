define(function(require){

    var _               = require('underscore');
    var Trial           = require('app/trial/trial_constructor');
    var logger          = require('app/task/logger/logger');
    var nextTrial       = require('./sequencer/nextTrial');
    var stream          = require('utils/stream');

    return playerPhase;

    /**
     * run the task
     * @param canvas : htmlElement
     * @returns sink : {end, promise}
     **/

    function playerPhase(canvas, script){
        var $source = stream();
        var $trial = $source.map(activateTrial);

        var onDone = _.get(script, 'settings.hooks.endTask', script.settings.onEnd || _.noop);


        $source.end
            .map(logger) // @TODO this is a bit awkward here: we're posting any leftover logs
            .map(onDone);

        return {$trial:$trial, end:$source.end, play: play};

        function play(goto){
            var next = nextTrial(goto);
            if (next.done) $source.end();
            $source(next.value);
        }

        function activateTrial(source){
            // create new trial and activate it
            var trial = new Trial(source, canvas);
            trial.onend = play; // when we're done try to play the next one 
            trial.start();
            return trial;
        }

    }
});
