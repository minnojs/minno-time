define(function(require){
    var _ = require('underscore');
    var adjustCanvas = require('./adjust_canvas');
    var applyCanvasStyles = require('./applyCanvasStyles');
    var stream = require('utils/stream');

    return setupCanvas;

    function setupCanvas(canvas, script){
        var canvasSettings = _.get(script, 'settings.canvas', {});
        var $resize = stream();

        canvas.classList.add('minno-canvas');

        $resize.map(adjustCanvas(canvas, canvasSettings));
        $resize({});

        window.addEventListener('orientationchange', $resize);
        window.addEventListener('resize', $resize);

        $resize.end
            .map(function(){canvas.classList.remove('minno-canvas');})
            .map(removeListeners)
            .map(off);


        var map = {
            background 			: {element: document.body, property: 'backgroundColor'},
            canvasBackground	: {element: canvas, property:'backgroundColor'},
            borderColor			: {element: canvas, property:'borderColor'},
            borderWidth			: {element: canvas, property:'borderWidth'}
        };

        // settings activator
        var off = applyCanvasStyles(map, _.pick(canvasSettings,['background','canvasBackground','borderColor','borderWidth']));

        // @TODO connect this with our css from stimulus
        canvasSettings.css && self.$el.css(canvasSettings.css);

        return $resize;
        
        function removeListeners(){
            window.removeEventListener('orientationchange',$resize);
            window.removeEventListener('resize', $resize);
        }
    }
});
