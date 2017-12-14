import createListener from './createListener';
import now from './now';

export default interfaceFn;

function interfaceFn($events, canvas){
    var listenerStack = []; // holds all active listeners
    var baseTime = 0;

    return { add:add,remove:remove,removeAll:removeAll,resetTimer:resetTimer };

    function add(inputObj){
        if (!inputObj) throw new Error('Missing input element. Could not add input listener');
        var $listener = createListener(inputObj, canvas);
        $listener.map(addDetails).map($events); // pipe events to $events
        listenerStack.push($listener);

        function addDetails(event){
            return {
                handle      : $listener.handle,
                event       : event,
                timestamp	: +new Date(),
                latency		: now() - baseTime
            };
        }
    }

    function remove(handle){
        // go through the listener stack and remove any listeners that fit the handle
        // note that we do this in reverse so that the index does not change
        for (var i = listenerStack.length - 1; i >= 0 ; i--){
            var $listener = listenerStack[i];
            if ($listener.handle === handle){
                $listener.end(true);
                listenerStack.splice(i,1);
            }
        }
    }

    function removeAll(){
        listenerStack.forEach(function($listener){
            $listener.end(true);
        });
        listenerStack.length = 0;
    }

    function resetTimer(){ baseTime = now(); }
}
