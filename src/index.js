import './utils/polyfills';

import _ from 'lodash';

import mainScript from './app/task/script';
import global from './app/global';

import parse from './app/task/parser';
import canvasSetup from './app/task/canvasSetup';
import preloadPhase from './app/preloadPhase';
import playPhase from './app/playPhase';

export default activate;

/**
 * @TODO: document!!!
 **/
function activate(canvas, script){
    var $resize = canvasSetup(canvas, script);
    var db = parse(script); // Build db (can this be pure?) - maybe inject db into playphase
    var playSink = playPhase(canvas, db, script);

    setupVars(script);

    playSink.end.map(function(){$resize.end(true);}); // end resize stream

    // preload Images, then play "playPhase"
    preloadPhase(canvas, script).then(playSink.play.bind(null, ['next', {}]));

    return playSink;
}

function setupVars(script){
    // init global
    var glob = global(global());
    var name = script.name || 'anonymous minno-time';
    var current = _.isPlainObject(script.current) ? script.current : {};

    current.logs || (current.logs = []); // init logs object
    glob[name] = glob.current = current; // create local namespace

    // set the main script as a global
    mainScript(script);
}
