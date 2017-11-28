import _ from 'lodash';
import global from './global';
import createDB from './task/createDB';
import canvasSetup from './task/canvas/canvasSetup';
import mainScript from './task/script';

export default setup;

function setup(canvas, script){
    var $resize = canvasSetup(canvas, _.get(script, 'settings.canvas', {}));
    var db = createDB(script);
    setupVars(script);

    return {
        db:db, 
        $resize:$resize,
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

    // set the main script as a global
    mainScript(script);
}
