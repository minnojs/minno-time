import css from 'minno-css';
import fastdom from 'fastdom';
import stream from 'mithril-stream';

export default mouseEvents;

function mouseEvents(eventName,inputObj, canvas){
    var $listener = stream();
    var element = inputObj.element;

    if (element){
        css(element, inputObj.css);
        fastdom.mutate(function(){
            canvas.appendChild(element);
        });
    }

    canvas.addEventListener(eventName, clickListener);

    $listener.end.map(removeClickListener);
    return $listener;

    function clickListener(e){
        var target = e.target;
        if (element && element.contains(target)) return $listener(e);
        if (!element && target.closest('[data-handle="' + inputObj.stimHandle + '"]')) return $listener(e);
        return;
    }

    function removeClickListener(){
        if (element) canvas.removeChild(element);
        canvas.removeEventListener(eventName, $listener);
    }
}
