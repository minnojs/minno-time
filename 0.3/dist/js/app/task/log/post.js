/*
 * Send log chunk
 * returns a function that takes data and sends it to the server after appending any meta data
 */
define(function(require){
    var $ = require('jquery')
        , _ = require('underscore')
		, settingsGetter = require('app/task/settings');

    window._ = _;
    function send(data){
        var settings = settingsGetter();
        var url = _.get(settings, 'logger.url');
        var deff = $.Deferred();

        if (!url) {
            return deff.resolve();
        }

		// build post data
        var post = {
            json: JSON.stringify(data) || ''
        };

        $.extend(post, settings.metaData || {});

		// lets post our data
        deff = $.post(url,post);

		// now, if there was a failure, lets try to resend
        deff = deff.then(null,function(){
            return $.post(url,post).then(null, _.get(settings, 'logger.error'));
        });

        return deff;
    }

    return send;
});

