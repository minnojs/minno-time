define(function(require){

    var _               = require('underscore');
    var Trial           = require('app/trial/Trial');
    var logger          = require('app/task/logger/logger');
    var nextTrial       = require('./sequencer/nextTrial');
    var stream          = require('utils/stream');
    var fastdom = require('utils/fastdom');

    return playerPhase;

    /**
     * run the task
     * @param canvas : htmlElement
     * @returns sink : {end, promise}
     **/

    function playerPhase(canvas, script){
        var $source = stream();
        var $trial = $source.map(activateTrial());

        var onDone = _.get(script, 'settings.hooks.endTask', script.settings.onEnd || _.noop);

        $source.end
            .map(logger) // @TODO this is a bit awkward here: we're posting any leftover logs
            .map(clearCanvas)
            .map(onDone);

        return {$trial:$trial, end:$source.end, play: play};

        function clearCanvas(){
            var trial = $trial();
            if (trial) trial.stimulusCollection.destroy();
        }

        function play(goto){
            var next = nextTrial(goto);
            if (next.done) $source.end(true);
            else $source(next.value);
        }

        function activateTrial(cache){
            return activate;
            function activate(source){
                var oldTrial = cache;
                var trial = cache = new Trial(source, canvas);
                trial.onend = play; // when we're done try to play the next one
                trial.start();

                if (oldTrial) {
                    // we leave the old stimuli until the current ones are visiblie to maintain the continuity between trials
                    // otherwise layout blinks between trials because it takes us at least a frame to measure the element sizes
                    // The beginning of a trial is compposed of two mutations, adding the elemnt and resizing them.
                    // This mutate waits until the first mutation in order to schedudual the removal of the old simuli
                    fastdom.mutate(function oldtrial(){
                        oldTrial.stimulusCollection.destroy();
                    });
                }

                return trial;
            }
        }

    }
});
