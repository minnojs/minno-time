define(function(require){

    var _ = require('underscore');
    var mouseEvents = require('./bindings/mouseEvents');
    var keypressed = require('./bindings/keypressed');
    var keyup = require('./bindings/keyup');
    var timeout = require('./bindings/timeout');
    var css = require('utils/css');

    /*
     * this function decorates a listener object with on and off functions
     * it takes listener (the object) and the binding definitions as parameters
     *
     * the function returns true in case the decoration was successfull and false in case it was not.
     */
    return function(listener,definitions){
        var on = definitions.on; // what type of binding is this?

        // if the on and off function are set explicitly, set them in;
        if (typeof on === 'function') {
            listener.on = definitions.on;
            listener.off = definitions.off;
            if (typeof listener.off !== 'function') {
                throw new Error('Interface off is not a function for ' + definitions.handle);
            }
            return true;
        }

        switch (on){
            /*
             * the archtipical events
             */

            case 'keypressed'	:
                keypressed(listener, definitions);
                break;

            case 'keyup'		:
                keyup(listener, definitions);
                break;

            case 'click'		:
            case 'mousedown'    :
                mouseEvents('mousedown', listener,definitions);
                break;

            case 'mouseup'	:
                mouseEvents('mouseup', listener,definitions);
                break;

            case 'mouseenter'	:
                mouseEvents('mouseenter', listener,definitions);
                break;

            case 'mouseleave'	:
                mouseEvents('mouseleave', listener,definitions);
                break;

            case 'timeout'		:
                timeout(listener,definitions);
                break;

            /*
             * Shortcuts
             */

            case 'enter'	:
                keypressed(listener, _.assign({key:13},definitions));
                break;

            case 'space'	:
                keypressed(listener, _.assign({key:32},definitions));
                break;

            case 'esc'	:
                keypressed(listener, _.assign({key:27},definitions));
                break;

            case 'leftTouch'	:
                definitions.element = createElement(definitions.css, {
                    position: 'absolute',
                    left: 0,
                    width: '30%',
                    height: '100%',
                    background: '#00FF00',
                    opacity: 0.3
                });

                click(listener,definitions);
                break;

            case 'rightTouch'	:
                definitions.element = createElement(definitions.css, {
                    position: 'absolute',
                    right: 0,
                    width: '30%',
                    height: '100%',
                    background: '#00FF00',
                    opacity: 0.3
                });

                click(listener,definitions);
                break;

            case 'topTouch'	:
                definitions.element = createElement(definitions.css, {
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    height: '30%',
                    background: '#00FF00',
                    opacity: 0.3
                });

                click(listener,definitions);
                break;

            case 'bottomTouch'	:
                definitions.element = createElement(definitions.css, {
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: '30%',
                    background: '#00FF00',
                    opacity: 0.3
                });

                click(listener,definitions);
                break;

            default:
                throw new Error('You have an input element without a recognized "on" property: ' + on);

        }
        return true;

        function createElement(css2, css1){
            var el = document.createElement('div');
            css(el, css1);
            css(el, css2);
            return el;
        }

    };
});
