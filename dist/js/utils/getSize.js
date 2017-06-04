define(function(){

    // helper function: returns sizes of element;
    function getSize(el){
        var computedStyle = window.getComputedStyle(el);
        return {
            height    : parse(el.offsetHeight) - parse(computedStyle.borderTop) - parse(computedStyle.borderBottom),
            width    : parse(el.offsetWidth) - parse(computedStyle.borderLeft) - parse(computedStyle.borderRight)
        };
    }

    function parse(num){ return parseFloat(num, 10) || 0;}

    return getSize;
});
