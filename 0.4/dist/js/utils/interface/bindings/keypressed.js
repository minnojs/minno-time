define(function(){
    /*
     * key pressed listener
     * reqires key
     *
     * key can be either charCode or string.
     * or an array of charCode/strings.
     */

    // we monitor all key up events so that we trigger only once per key down
    var keyDownArr = [];
    document.addEventListener('keyup',function(e){ keyDownArr[e.which] = false; });// unset flag to prevent multi pressing of a key 

    return function(listener,definitions){
        // make sure key is array
        var key = Array.isArray(definitions.key) ? definitions.key : [definitions.key];

        // map keys to keyCodes
        var target = key.map(function(value){ return typeof value == 'string' ? value.toUpperCase().charCodeAt(0) : value; });

        // attach listener
        listener.on = function on(callback){
            this.listener = keypressListener;
            document.addEventListener('keydown', this.listener);

            function keypressListener(e){
                if (keyDownArr[e.which] || (target.indexOf(e.which) === -1)) return;
                e.preventDefault(); // prevent FF from wasting about 10ms in browser-content.js (and fast search)
                keyDownArr[e.which] = true; // set flag to prevent multi pressing of a key
                callback(e,'keydown');
            }
        };

        // remove listener
        listener.off = function off(){
            document.removeEventListener('keydown', this.listener);
        };
    };
});
