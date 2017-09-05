define(function(require){
    var css = require('utils/css');
    var fastdom = require('utils/fastdom');

    return function(eventName, $listener,inputObj, canvas){
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
            if (element && target === element) return $listener(e);
            if (!element && target.getAttribute('data-handle') === inputObj.stimHandle) return $listener(e);
            return;
        }

        function removeClickListener(){
            if (element) canvas.removeChild(element);
            canvas.removeEventListener(eventName, $listener);
        }
    };
});
