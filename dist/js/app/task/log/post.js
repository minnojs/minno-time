/*
 * Send log chunk
 * returns a function that takes data and sends it to the server after appending any meta data
 */
define(function(require){
    var $ = require('jquery')
        , _ = require('underscore')
        , settingsGetter = require('app/task/settings');

    function send(data){
        var settings = settingsGetter();
        var url = _.get(settings, 'logger.url');
        var errorFun = _.get(settings, 'logger.error');

        if (!url) return $.Deferred().resolve();
        // build post data
        var post = {
            json: JSON.stringify(data) || ''
        };

        $.extend(post, settings.metaData || {});

        // lets post our data
        return $.post(url,post)
            // now, if there was a failure, lets try to resend
            .then(null,function(){ return $.post(url,post); })
            // finally on error report error
            .then(null, function(){ return _.attempt(errorFun); });
    }

    return send;
});
