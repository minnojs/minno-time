export default getSize;

// helper function: returns sizes of element;
function getSize(el){
    var computedStyle = window.getComputedStyle(el);
    return {
        height    : parse(el.offsetHeight) - parse(computedStyle.borderTopWidth) - parse(computedStyle.borderBottomWidth),
        width    : parse(el.offsetWidth) - parse(computedStyle.borderLeftWidth) - parse(computedStyle.borderRightWidth)
    };
}

function parse(num){ return parseFloat(num, 10) || 0;}
