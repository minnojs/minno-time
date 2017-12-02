
import _ from 'lodash';
import mouseEvents from './bindings/mouseEvents';
import keypressed from './bindings/keypressed';
import keyup from './bindings/keyup';
import timeout from './bindings/timeout';
import css from 'minno-css';

export default inputBinder;

/**
 * The input binder is a hash of default input types
 * It returns a stream of events
 **/
function inputBinder(inputObj, canvas){
    var on = inputObj.on; // what type of binding is this?

    switch (on){

        case 'keypressed'	: return keypressed(inputObj);

        case 'keyup'		: return keyup(inputObj);

        case 'click'		:
        case 'mousedown'    :
            return mouseEvents('mousedown', inputObj, canvas);

        case 'mouseup'	    : return mouseEvents('mouseup', inputObj);

        case 'mouseenter'	: return mouseEvents('mouseenter', inputObj);

        case 'mouseleave'	: return mouseEvents('mouseleave', inputObj);

        case 'timeout'		: return timeout(inputObj);

        /*
         * Shortcuts
         */

        case 'enter'	: return keypressed(_.assign({key:13},inputObj));

        case 'space'	: return keypressed(_.assign({key:32},inputObj));

        case 'esc'	    : return keypressed(_.assign({key:27},inputObj));

        case 'leftTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                left: 0,
                width: '30%',
                height: '100%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents('mousedown', inputObj);

        case 'rightTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                right: 0,
                width: '30%',
                height: '100%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents('mousedown', inputObj);

        case 'topTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '30%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents('mousedown', inputObj);

        case 'bottomTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '30%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents('mousedown', inputObj);

        default:
            throw new Error('You have an input element with an unrecognized "on" property: ' + on);

    }


    function createElement(css2, css1){
        var el = document.createElement('div');
        css(el, css1);
        css(el, css2);
        return el;
    }
}
