define(function(require){

    var _               = require('underscore');
    var Trial           = require('app/trial/Trial');
    var nextTrial       = require('./sequencer/nextTrial');
    var stream          = require('utils/stream');
    var fastdom = require('utils/fastdom');
    var createLogs      = require('./task/logger/createLogs');

    return playerPhase;

    /**
     * run the task
     * @param canvas : htmlElement
     * @returns sink : {end, promise}
     **/

    function playerPhase(canvas, db, script){
        var $source = stream();
        var $trial = $source.map(activateTrial());
        var $logs = stream();

        var onDone = _.get(script, 'settings.hooks.endTask', script.settings.onEnd || _.noop);

        $source.end
            .map(clearCanvas)
            .map(onDone);

        return {
            $trial:$trial, 
            end: $source.end,  // TODO:  possibly bind to true?
            $logs: createLogs($logs, script.settings.logger || {}), 
            play: play // TODO: possibly rename to start
        };

        function clearCanvas(){
            var trial = $trial();
            if (trial) trial.stimulusCollection.destroy();
        }

        function play(goto){
            var next = nextTrial(db, goto);
            if (next.done) $source.end(true);
            else $source(next.value);
        }

        function activateTrial(cache){
            return activate;
            function activate(source){
                var oldTrial = cache;
                var trial = cache = new Trial(source, canvas, script.settings);
                trial.$logs.map($logs); 
                trial.$end
                    .map(function(){
                        play(trial._next); // when we're done try to play the next one
                    }); 
                    
                trial.start();

                if (oldTrial) {
                    // we leave the old stimuli until the current ones are visiblie to maintain the continuity between trials
                    // This mutate waits until the first mutation in order to schedudual the removal of the old stimuli
                    fastdom.mutate(function oldtrial(){
                        oldTrial.stimulusCollection.destroy();
                    });
                }

                return trial;
            }
        }

    }
});
