define(function(require){

    var binder      = require('./binder');
    var stream      = require('utils/stream');
    var _           = require('underscore');

    function createListener(inputObj,canvas){
        // @TODO: this API is very confusing
        // the binder MUST return the original stream ($listener)
        // maybe we should simplify this, possibly instead of explicitly exposing streams, expose callbacks?
        var $listener = stream();
        $listener.handle = inputObj.handle;

        if (_.isFunction(inputObj)) {
            $listener = inputObj($listener, inputObj, canvas);
            if (isStream($listener)) return $listener;
            throw new Error('Input functions must return valid streams');
        }

        if (!_.isPlainObject(inputObj)) throw new Error('Input must only contain objects and functions, do you have an undefined value?');

        if (_.isString(inputObj.on)) return binder($listener,inputObj,canvas); // must return $listener :(

        if (_.isFunction(inputObj.on )) inputObj.on($listener, inputObj, canvas);
        if (_.isFunction(inputObj.off)) $listener.end.map(inputObj.off);
        return $listener;
    }

    return createListener;

    function isStream(stream) {return stream._state; }
});
