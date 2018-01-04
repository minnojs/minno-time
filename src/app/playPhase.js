import _ from 'lodash';
import stream from 'mithril-stream';
import fastdom from 'fastdom';

import Trial from './trial/Trial';
import nextTrial from './task/sequencer/nextTrial';
import createLogs from './task/logger/createLogStream';
import defaultLogMap from './task/logger/defaultLogMap';
import global from './global';

export default playerPhase;

/**
 * run the task
 * Essentialy wiring up all the play phase stuff
 * @TODO: document this function, its super complicated
 **/

function playerPhase(sink){
    var canvas = sink.canvas;
    var db = sink.db;
    var settings = sink.settings;

    var $source = stream();
    var $trial = $source.map(activateTrial());
    var $sourceLogs = stream();
    var $logs = createLogs($sourceLogs, composeLoggerSettings(sink.script, global()), defaultLogMap);

    $logs.map(function(log){
        global().current.logs.push(log);
    });

    var onDone = _.get(settings, 'hooks.endTask', settings.onEnd || _.noop);

    $source.end
        .map(clearCanvas)
        .map(onDone);

    return _.extend({
        $trial:$trial, 
        end: $source.end.bind(null,true), 
        $logs: $logs,
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
            trial.$logs.map($sourceLogs); 

            // must be *before* the subscription to $end for the next trial
            if (source.DEBUG && window.DEBUG) setupDebug(trial);

            trial.$end.map(function(){
                play(trial._next); // when we're done try to play the next one
            });

            trial.start();

            // we leave the old stimuli until the current ones are visiblie to maintain the continuity between trials
            // This mutate waits until the first mutation in order to schedudual the removal of the old stimuli
            if (oldTrial) fastdom.mutate(function oldtrial(){
                oldTrial.stimulusCollection.destroy();
            });

            return trial;
        }
    }
}

function setupDebug(trial){
    /* eslint-disable no-console */
    var trialName = 'Trial :' + trial.counter;
    console.group(trialName);
    trial.$messages.map(debugLog);
    trial.$events.end.map(function(){ console.groupEnd(trialName); });

    function debugLog(log){
        if (log.type !== 'debug') return log;
        if (log.rows){
            console.groupCollapsed(log.message);
            log.rows.forEach(function(row){ console.log.apply(console, row); });
            console.groupEnd(log.message);
        }
        else console.log(log.message);
        return log;
    }
    /* eslint-enable no-console */
}

// create metaDeta to add to post
export function composeLoggerSettings(script, global){
    var loggerSettings = _.assign({}, _.get(script, 'settings.logger'));
    var metaData = _.assign({taskName:script.name}, global.$meta, loggerSettings.metaData);
    loggerSettings.metaData = metaData;
    return loggerSettings;
}
