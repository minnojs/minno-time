import './polyfills';

import _ from 'lodash';
import mainScript from './app/task/script';
import global from './app/global';

import createDB from './app/task/createDB';
import canvasSetup from './app/task/canvasSetup';
import preloadPhase from './app/preloadPhase';
import playPhase from './app/playPhase';

export default activate;

/**
 * activate : (HTMLelement, timeScript) -> Sink
 *
 * timeScript : {settings, sequence, trialSets, stimulusSets, mediaSets, current}
 * Sink: {$trial, $logs, play, end}
 **/
function activate(canvas, script){
    var $resize = canvasSetup(canvas, _.get(script, 'settings.canvas', {}));
    var db = createDB(script);
    var sink = {
        canvas: canvas,
        script: script,
        settings: script.settings || {},
        db: db,
        $resize: $resize
    };

    var playSink = playPhase(sink);

    setupVars(script);

    playSink.$trial.end.map($resize.end.bind(null, true)); // end resize stream

    // preload Images, then start "playPhase"
    preloadPhase(canvas, script).then(playSink.start);

    return playSink;
}

function setupVars(script){
    // init global
    var glob = global(global());
    var name = script.name || 'anonymous minno-time';
    var current = script.current ? script.current : {};

    current.logs || (current.logs = []); // init logs object
    glob[name] = glob.current = current; // create local namespace

    // set the main script as a global
    mainScript(script);
}
