import fastdom from 'fastdom';
import setSize from './setSize';
import setPlace from './setPlace';
import css from 'minno-css';
var isIE = window.document.documentMode;

export default setupElement;

function setupElement(stimulus, index, el){
    var canvas = stimulus.canvas;

    stimulus.el = el;
    return new Promise(function(resolve){
        fastdom.mutate(function initStim(){
            // setup element
            el.classList.add('minno-stimulus');
            el.setAttribute('data-handle', stimulus.handle); // data-handle for handeling of mouse/touch interactions
            el.style.zIndex = index*10; // make sure elements are layered correctly (becuase sometimes they are not linearly inserted into the dom).
            canvas.appendChild(el);

            setSize(el, stimulus.source);
            setPlace(el, stimulus.source);
            css(el, stimulus.source.css || {});

            if (!isIE) {
                if (stimulus.source.isLayout) el.classList.add('minno-stimulus-visible');
                resolve(el);
            }
            else fixIE(stimulus, resolve);
        });
    });
}

/**
 * sets element dimensions explicitly so that centering works in ie
 **/
function fixIE(stimulus, resolve){
    var canvas = stimulus.canvas;
    var el = stimulus.el;
    var location = stimulus.source.location || {};

    fastdom.measure(function(){
        var width = (100 * el.clientWidth / canvas.clientWidth);
        var height = (100 * el.clientHeight / canvas.clientHeight);
        fastdom.mutate(function(){
            var style = el.style;
            style.width = width + '%';
            style.height = height + '%';
            if (testProps(location.top, location.bottom)) { style.top = (100-height)/2+'%'; }
            if (testProps(location.left, location.right)) { style.left = (100-width)/2+'%'; }
            if (stimulus.source.isLayout) el.classList.add('minno-stimulus-visible');
            resolve(el);
        });
    });

    function testProps(p1, p2){
        return p1 === 'center' || p2 === 'center' || (p1 === undefined && p2 === undefined);
    }
}
