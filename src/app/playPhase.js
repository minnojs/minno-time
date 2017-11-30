import _ from 'lodash';
import stream from 'mithril-stream';
import fastdom from 'fastdom';

import Trial from './trial/Trial';
import nextTrial from './task/sequencer/nextTrial';
import createLogs from './task/logger/createLogs';

export default playerPhase;

/**
 * run the task
 * @param canvas : htmlElement
 * @returns sink : {end, promise}
 **/

function playerPhase(sink){
    var canvas = sink.canvas;
    var db = sink.db;
    var settings = sink.settings;

    var $source = stream();
    var $trial = $source.map(activateTrial());
    var $logs = stream();

    var onDone = _.get(settings, 'hooks.endTask', settings.onEnd || _.noop);

    $source.end
        .map(clearCanvas)
        .map(onDone);

    return _.extend({
        $trial:$trial, 
        end: $source.end.bind(null,true), 
        $logs: createLogs($logs, settings.logger || {}), 
        start: play.bind(null, ['next', {}])
    }, sink);

    function clearCanvas(){
        var trial = $trial();
        if (trial) trial.stimulusCollection.destroy();
    }

    function play(goto){
        var next = nextTrial(db, settings, goto);
        if (next.done) $source.end(true);
        else $source(next.value);
    }

    function activateTrial(cache){
        return activate;
        function activate(source){
            var oldTrial = cache;
            var trial = cache = new Trial(source, canvas, settings);
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
