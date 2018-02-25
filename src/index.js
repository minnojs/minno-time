import './polyfills';
import './time.css';

import setup from './app/setup';
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
    var sink = setup(canvas, script);
    var playSink = playPhase(sink);

    playSink.$trial.end.map(playSink.$resize.end); // end resize stream

    // preload Images, then start "playPhase"
    preloadPhase(canvas, script, playSink.$messages).then(playSink.start);

    return playSink;
}

