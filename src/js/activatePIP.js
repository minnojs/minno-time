/**
 * Activate pip script
 * @param  {Object} script    The pip script we want to run
 * @param  {?function} done   A function to call once pip is over
 * @return {promise}
 */
define(function(require){
    require('utils/polyfills');

    var _ = require('underscore');

    var mainScript = require('app/task/script');
    var global = require('app/global');

    var parse = require('app/task/parser');
    var canvasSetup = require('app/task/canvasSetup');
    var preloadPhase = require('app/preloadPhase');
    var playPhase = require('app/playPhase');

    function activate(canvas, script){
        var $resize = canvasSetup(canvas, script);
        var playSink = playPhase(canvas, script);

        setupVars(script);
        parse(script); // Build db (can this be pure?) - maybe inject db into playphase

        $resize.map(function(){
            var trial = playSink.$trial();
            if (trial) trial.stimulusCollection.render();
        });

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

    return activate;
});
