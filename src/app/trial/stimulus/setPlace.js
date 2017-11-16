import fastdom from 'fastdom';

export default setPlace;

var YCLASS = 'minno-stimulus-center-y';
var XCLASS = 'minno-stimulus-center-x';

function setPlace(el,stimulus){
    var location = stimulus.location || {};

    // set offsets:
    if (location.top == 'center' || location.bottom == 'center' || (location.top === undefined && location.bottom === undefined)) el.classList.add(YCLASS);
    if (location.left == 'center' || location.right == 'center' || (location.left === undefined && location.right === undefined)) el.classList.add(XCLASS);

    ['top','bottom','left','right'].forEach(setNumericLocation);

    function isNumeric(val) {return !isNaN(+val);}
    function setNumericLocation(attr){ if (isNumeric(location[attr])) el.style[attr] = location[attr] + '%'; }
}

export function fixIE(el, resolve){
    var style = el.style;

    // count on setplace to findout when we need to center
    var xCenter = el.classList.contains(XCLASS);
    var yCenter = el.classList.contains(YCLASS);

    if (!xCenter && !yCenter) return resolve(el);

    fastdom.measure(function(){
        var computedStyle = window.getComputedStyle(el);
        var width = parseFloat(computedStyle.width);
        var height = parseFloat(computedStyle.height);

        fastdom.mutate(function(){
            // location (left/top) is set to 50% within the center class
            // we're adding the margin on IE where the transform does not work well
            // we need to cancel the transform set within the class though...
            style.transform = 'none';
            if (xCenter) style.marginLeft = '-' + (width/2) + 'px';
            if (yCenter) style.marginTop = '-' + (height/2) + 'px';
        });

    });
}
