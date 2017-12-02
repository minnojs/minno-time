/*
* key pressed listener
* reqires key
*
* key can be either charCode or string.
* or an array of charCode/strings.
*/

// we monitor all key up events so that we trigger only once per key down
import stream from 'mithril-stream';
export default keypressed;

var keyDownArr = [];

document.addEventListener('keyup',function(e){ keyDownArr[e.which] = false; });// unset flag to prevent multi pressing of a key 

function keypressed(inputObj){
    var $listener = stream();

    // make sure key is an array
    var keys = Array.isArray(inputObj.key) ? inputObj.key : [inputObj.key];

    // map keys to keyCodes
    var target = keys.map(function(value){ 
        return typeof value == 'string' ? value.toUpperCase().charCodeAt(0) : value; 
    });

    document.addEventListener('keydown', keypressListener);

    $listener.end.map(removeKeypressListener);
    return $listener;

    function keypressListener(e){
        if (keyDownArr[e.which] || (target.indexOf(e.which) === -1)) return;
        e.preventDefault(); // prevent FF from wasting about 10ms in browser-content.js (and fast search)
        keyDownArr[e.which] = true; // set flag to prevent multi pressing of a key
        $listener(e);
    }

    function removeKeypressListener(){
        document.removeEventListener('keydown', keypressListener);
    }
}
