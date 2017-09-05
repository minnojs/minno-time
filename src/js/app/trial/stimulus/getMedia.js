define(function(){

    function getMedia(media){
        // all templateing is done within the inflate trial function and the sequencer
        var template = media.html || media.inlineTemplate || media.template; // give inline template precedence over template, because tempaltes are loaded into inlinetemplate
        var el;

        if (media.word) {
            el = document.createElement('div');
            el.textContent = media.word;
            return Promise.resolve(el);
        }

        if (media.image) {
            // at this time, we count on the preloader to throw for errors
            // the reject option isn't really being used here...
            return new Promise(function(resolve, reject){
                el = document.createElement('img');
                el.onload = function(){resolve(el);};
                el.onerror = function(){reject(new Error('Image not found: ' + el.src ));};
                el.src = media.image;
            });
        }

        if (media.jquery) Promise.reject(new Error('Jquery is no longer supported in minno-time'));

        if (template) { // html | template | inlineTemplate
            el = document.createElement('div');
            el.innerHTML = template;
            return Promise.resolve(el);
        } 

        return Promise.reject(new Error('Unrecognized media type')); // this is not a supported html type
    }

    return getMedia;
});
