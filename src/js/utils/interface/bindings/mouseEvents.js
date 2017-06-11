define(function(require){
    var css = require('utils/css');
    var fastdom = require('utils/fastdom');

    return function(eventName, listener,definitions){
        var canvas = document.getElementsByClassName('minno-canvas')[0]; // how bad is this? @TODO we should really pass canvas as prop
        var element = definitions.element;

        listener.on = function(callback){
            this.listener = clickListener;

            if (element){
                css(element, definitions.css);
                fastdom.mutate(function(){
                    canvas.appendChild(element);
                });
            }

            canvas.addEventListener(eventName, clickListener);

            function clickListener(e){
                var target = e.target;
                if (element && target === element) return callback(e,eventName);
                if (!element && target.getAttribute('data-handle') === definitions.stimHandle) callback(e, eventName);
            }
        };

        listener.off = function(){
            if (element) canvas.removeChild(element);
            canvas.removeEventHandler(eventName, this.listner);
        };
    };
});
