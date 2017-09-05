define(function(){
    return setPlace;

    function setPlace(el,stimulus){
        var location = stimulus.location || {};

        // set offsets:
        if (location.top == 'center' || location.bottom == 'center' || (location.top === undefined && location.bottom === undefined)) el.classList.add('minno-stimulus-center-y');
        if (location.left == 'center' || location.right == 'center' || (location.left === undefined && location.right === undefined)) el.classList.add('minno-stimulus-center-x');

        ['top','bottom','left','right'].forEach(setNumericLocation);

        function isNumeric(val) {return !isNaN(+val);}
        function setNumericLocation(attr){ if (isNumeric(location[attr])) el.style[attr] = location[attr] + '%'; }
    }
});
