export default setPlace;

function setPlace(el,stimulus){
    var location = stimulus.location || {};

    ['top','bottom','left','right'].forEach(setNumericLocation);

    function isNumeric(val) {return !isNaN(+val);}
    function setNumericLocation(attr){ if (isNumeric(location[attr])) el.style[attr] = location[attr] + '%'; }
}
