define(function(require){
    var  _ = require('underscore');
    var post = require('utils/post');
    
    return poster;

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
            // build post data
            var data = {json: JSON.stringify(logs)};
            var postData = _.assign(data, settings.metaData);
            var serializedPost = serialize(postData);

            return post(url,serializedPost)
                .catch(function retry(){ return post(url, serializedPost); })
                .catch(settings.error || _.noop);
        }

        function serialize(data){
            var key, r = [];
            for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            return r.join('&').replace(/%20/g, '+');
        }
    }
});
