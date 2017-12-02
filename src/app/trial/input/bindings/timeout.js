import randomize from './simpleRandomize';
import stream from 'mithril-stream';

export default timeout;

function timeout(inputObj){
    var $listener = stream();
    var timeoutID;
    var duration = randomize(inputObj.duration) || 0;

    $listener.end.map(cancel);

    if (duration) setTimeout($listener.bind(null, {}), duration);
    else $listener({}); // listener is already registered with $events so this should be immidiate

    return $listener;

    function cancel(){
        clearTimeout(timeoutID);
    }
}
