import _ from 'lodash';
import global from './global';
import createDB from './task/sequencer/createDB';
import canvasSetup from './task/canvas/canvasSetup';
import stream from 'mithril-stream';

export default setup;

function setup(canvas, script){
    var $messages = stream();
    var $resize = canvasSetup(canvas, _.get(script, 'settings.canvas', {}),$messages);
    var db = createDB(script);
    setupVars(script);

    return {
        db:db, 
        $resize:$resize,
        $messages: $messages,
        canvas: canvas,
        script: script,
        settings: script.settings || {}
    };
}

function setupVars(script){
    // init global
    var glob = global(global());
    var name = script.name || 'anonymous minno-time';
    var current = script.current ? script.current : {};

    current.logs || (current.logs = []); // init logs object
    glob[name] = glob.current = current; // create local namespace
}
