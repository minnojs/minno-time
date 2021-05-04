import randomize from './simpleRandomize';
import stream from 'mithril-stream';
import fastdom from 'fastdom';
import now from '../now';

export default timeout;

/*
 * We set timeout to trigger half a frame before the target time.
 * This is done so that on overage we hit as close as possible to the true duration
 * `offset` is updated dynamically by correctOfset() below
 **/
var offset = 8;

function timeout(inputObj){
    var $listener = stream();
    var timeoutID;
    var duration = randomize(inputObj.duration) || 0;

    $listener.end.map(cancel);

    // start timeout the same time that current visual stimuli occur
    if (duration) fastdom.mutate(function(){
        timeoutID = setTimeout($listener.bind(null, {}), duration-offset);
    });

    else $listener({}); // listener is already registered with $events so this should be immidiate

    return $listener;

    function cancel(){
        clearTimeout(timeoutID);
    }
}

// compute true frame rate for this specific machine
// and set offset to half of that
(function correctOfset(){
    var itterations = 50;
    var a,b, results = [];
    requestAnimationFrame(function(){
        a = now();
        update();
    });

    function update(){
        requestAnimationFrame(function(){
            b = now();
            results.push(b-a)
            a = b;
            if (results.length < itterations)  return setTimeout(update);
            else offset = mean(results)/2; // we want an offset of half of the frame rate, so on average we hit the closest frame possible to the target.
        });   
    }

    function mean(arr){return arr.reduce(function(v,s){return v+s},0)/arr.length}
})();
