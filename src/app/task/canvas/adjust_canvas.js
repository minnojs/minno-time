/*
 * adjust canvas according to window size and settings
 * this module is built to be part of the main view
 */

import _ from 'lodash';
import fastdom from 'fastdom';
import getSize from './getSize';

export default adjust_canvas;

// the function to be used by the main view
function adjust_canvas(canvas, settings, $messages){

    return _.throttle(eventListener, 16);

    function eventListener(event){
        // we put this in a time out because of a latency of orientation change on android devices
        if (event.type == 'orientationchange') setTimeout(resize, 500);
        else resize();
    }

    function resize(){
        fastdom.measure(function(){
            var targetSize = getTargetSize(settings, canvas);

            // remove border width and top margin from calculated width (can't depend on cool box styles yet...)
            // we compute only margin-top because of a difference calculating margins between chrome + IE and firefox + mobile
            var computedStyle = window.getComputedStyle(canvas);
            targetSize.height -= parse(computedStyle.borderTopWidth) + parse(computedStyle.borderBottomWidth) + parse(computedStyle.marginTop);
            targetSize.width -= parse(computedStyle.borderLeftWidth) + parse(computedStyle.borderRightWidth);

            fastdom.mutate(function(){
                // reset canvas size
                canvas.style.width = targetSize.width + 'px';
                canvas.style.height = targetSize.height + 'px';
                canvas.style.fontSize = targetSize.height*(settings.textSize || 3)/100 + 'px';

                // scroll to top of window (hides some of the mess on the top of mobile devices)
                window.scrollTo(0, 1);
            });
        });
    }

    function getProportions(settings){
        var proportions = settings.proportions;
        if (isNumeric(proportions)) return proportions;
        if (_.isPlainObject(proportions)) {
            if ([proportions.height, proportions.width].every(isNumeric)) return proportions.height/proportions.width; 
            $messages({
                type: 'warn',
                message: 'minno settings.canvas.proportions.width and settings.canvas.proportions.height must both be numeric',
                context: settings
            });
        }
        if (proportions) $messages({
            type: 'warn',
            message: 'minno settings.canvas.proportions must be either numeric or a plain object',
            context: settings
        });
        return 0.8;
    }

    function getTargetSize(settings, canvas){
        // calculate proportions (as height/width)
        var proportions = getProportions(settings);

        // static canvas size
        // ------------------
        if (settings.width) {
            if (!isNumeric(settings.width)) $messages({
                type: 'warn',
                message: 'minno settings.canvas.width must be numeric',
                context: settings
            });
            return {
                width: settings.width,
                height: settings.width*proportions
            };
        }

        // dynamic canvas size
        // -------------------
        if (settings.maWidth && !isNumeric(settings.maxWidth)) $messages({
            type: 'warn',
            message: 'minno settings.canvas.maxWidth must be numeric',
            context: settings
        });

        var docElement = window.document.documentElement; // used to get client view size

        var maxHeight = docElement.clientHeight;
        var maxWidth = Math.min(settings.maxWidth || Infinity, docElement.clientWidth, getSize(canvas.parentNode).width);

        // calculate the correct size for this screen size
        if (maxHeight > proportions * maxWidth) return { height: maxWidth*proportions, width: maxWidth };
        else return { height: maxHeight, width: maxHeight/proportions};
    }
}

function parse(num){ return parseFloat(num, 10) || 0;}
function isNumeric(n){ return !isNaN(parseFloat(n)) && isFinite(n); }
