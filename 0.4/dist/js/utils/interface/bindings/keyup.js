define(function(){
    return function(listener,definitions){
        // make sure key is array
        var key = Array.isArray(definitions.key) ? definitions.key : [definitions.key];

        // map keys to keyCodes
        var target = key.map(function(value){ return typeof value == 'string' ? value.toUpperCase().charCodeAt(0) : value; });

        // attach listener
        listener.on = function on(callback){
            this.listener = keypressListener;
            document.addEventListener('keyup', this.listener);

            function keypressListener(e){
                if (target.indexOf(e.which) === -1) return;
                e.preventDefault();
                callback(e,'keydown');
            }
        };

        // remove listener
        listener.off = function off(){
            document.removeEventListener('keyup', this.listener);
        };
    };
});
