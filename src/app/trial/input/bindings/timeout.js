import randomize from './simpleRandomize';
import stream from 'mithril-stream';
import fastdom from 'fastdom';
import now from '../now';

export default timeout;

/*
 * We set timeout to trigger half a frame before the target time.
 * This is done so that on overage we hit as close as possible to the true duration
 * `offset` is updated dynamically by correctOffset() below
 **/
var offset = 5;

function timeout(inputObj){
    var $listener = stream();
    var timeoutID;
    var duration = randomize(inputObj.duration) || 0;
    var isCanceled = false;

    $listener.end.map(function(){isCanceled = true;});

    if (!duration) $listener({}); // listener is already registered with $events so this should be immidiate 
    
    // deal with timing dissociated from frames
    else if (inputObj.immediate) setTimeout($listener.bind(null, {}), duration);

    else fastdom.measure(function(){
        // start timeout the same time that current visual stimuli occur
        var target = now() + +duration - offset;
        step();
        function step(){
            if (isCanceled) return;
            fastdom.measure(function(){
                if (now() >= target) $listener({});
                else fastdom.mutate(step); // we use mutate here so that step does not get called within the same RAF
            });
        }
    });

    return $listener;
}


// compute true frame rate for this specific machine
// and set offset to half of that
(function correctOffset(){
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
            else offset = mean(results)/3; 
            // we want an offset of half of the frame rate, so on average we hit the closest frame possible to the target.
            // but it turns out that can create fragile balances and a high variance in display length
            // using an offset of 1/3 we get both improved accuracy (mean closer to target) and improved precission (study number of frames)
        });   
    }

    function mean(arr){return arr.reduce(function(v,s){return v+s},0)/arr.length}
})();
