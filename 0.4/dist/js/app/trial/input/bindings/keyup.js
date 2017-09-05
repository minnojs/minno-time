define(function(){
    return function($listener,inputObj){
        // make sure key is array
        var keys = Array.isArray(inputObj.key) ? inputObj.key : [inputObj.key];

        // map keys to keyCodes
        var target = keys.map(function(value){ 
            return typeof value == 'string' ? value.toUpperCase().charCodeAt(0) : value; 
        });

        document.addEventListener('keyup', keypressListener);

        $listener.end.map(removeKeypressListener);
        return $listener;

        function keypressListener(e){
            if (target.indexOf(e.which) === -1) return;
            e.preventDefault();
            return $listener(e);
        }

        function removeKeypressListener(){
            document.removeEventListener('keyup', $listener);
        }
    };
});
