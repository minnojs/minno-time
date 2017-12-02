import binder from './binder';
import stream from 'mithril-stream';
import _ from 'lodash';

export default createListener;

function createListener(inputObj,canvas){
    var $listener = getListener(inputObj, canvas);

    if (!isStream($listener)) throw new Error('Input functions must return valid streams: ' + logObj(inputObj));
    if ('handle' in inputObj) $listener.handle = inputObj.handle;

    return $listener;
}

function getListener(inputObj, canvas){
    var $listener;

    if (_.isFunction(inputObj)) return inputObj(inputObj, canvas, stream);

    if (_.isPlainObject(inputObj)) {
        if (_.isString(inputObj.on)) return binder(inputObj,canvas,stream);

        if (_.isFunction(inputObj.on )) $listener = inputObj.on(inputObj,canvas,stream);
        if (_.isFunction(inputObj.off)) $listener.end.map(inputObj.off);
    }
        
    throw new Error('Input must only contain objects and functions, do you have an undefined value?');
}

function logObj(obj){
    return _.isFunction(obj) ? obj.toString() : JSON.stringify(obj);
}


function isStream(stream) {return stream._state; }
