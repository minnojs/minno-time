import _ from 'lodash';
import adjustCanvas from './adjust_canvas';
import applyCanvasStyles from './applyCanvasStyles';
import stream from 'mithril-stream';
import css from 'minno-css';

export default setupCanvas;

function setupCanvas(canvas, canvasSettings){
    canvasSettings || (canvasSettings = {});
    var $resize = stream();

    if (!_.isElement(canvas)) throw new Error('Minno-time: canvas is not a DOM element');

    canvas.classList.add('minno-canvas');

    // apply canvas styles
    var map = {
        background 			: {element: document.body, property: 'backgroundColor'},
        canvasBackground	: {element: canvas, property:'backgroundColor'},
        borderColor			: {element: canvas, property:'borderColor'},
        borderWidth			: {element: canvas, property:'borderWidth'}
    };

    var off = applyCanvasStyles(map, _.pick(canvasSettings,['background','canvasBackground','borderColor','borderWidth']));

    canvasSettings.css && css(canvas, canvasSettings.css);

    // setup canvas resize
    $resize.map(adjustCanvas(canvas, canvasSettings));
    $resize({});

    window.addEventListener('orientationchange', $resize);
    window.addEventListener('resize', $resize);

    $resize.end
        .map(function(){canvas.classList.remove('minno-canvas');})
        .map(function removeListeners(){
            window.removeEventListener('orientationchange',$resize);
            window.removeEventListener('resize', $resize);
        })
        .map(off);



    return $resize;

}
