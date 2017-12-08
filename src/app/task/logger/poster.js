import _ from 'lodash';
import post from './post';

export default poster;

function poster($logs, settings){
    var cache = [];
    var url = settings.url;

    if (!url) return; // if we have no url, we can't log anything anyway

    $logs.map(eachLog);
    $logs.end.map(finalizefLogs);

    function eachLog(log){
        cache.push(log);
        if (!settings.pulse) return;
        if (cache.length >= settings.pulse) {
            send(cache);
            cache.length = 0;
        }
    }

    function finalizefLogs(){
        if (cache.length) send(cache);
    }

    function send(logs){
        var serialize = settings.serialize || (settings.newServelet ? buildPost : buildPostOld);
        var serializedPost = serialize(logs, settings.metaData);

        return post(url,serializedPost)
            .catch(function retry(){ return post(url, serializedPost); })
            .catch(settings.error || _.noop);
    }

}

export function buildPost(logs, metaData){
    var data = _.assign({ data:logs }, metaData);
    return JSON.stringify(data);
}

export function buildPostOld(logs, metaData){
    var data = 'json=' + JSON.stringify(logs); // do not re-encode json
    var meta = serialize(metaData);
    return data + (meta ? '&'+meta : '');
}


function serialize(data){
    var key, r = [];
    for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    return r.join('&').replace(/%20/g, '+');
}
