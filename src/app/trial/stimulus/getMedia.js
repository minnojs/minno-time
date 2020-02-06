import _ from 'lodash';
export default getMedia;

function getMedia(media, $messages){
    // all templateing is done within the inflate trial function and the sequencer
    var template = media.html || media.inlineTemplate || media.template; // give inline template precedence over template, because tempaltes are loaded into inlinetemplate
    var el;

    if (_.isFunction(media)) return customMedia(media);

    if (isWord(media)) media = {word:media};

    if (isWord(media.word)) {
        el = document.createElement('div');
        el.textContent = media.word;
        return Promise.resolve(el);
    }

    if (template) { // html | template | inlineTemplate
        el = document.createElement('div');
        el.innerHTML = template;
        return Promise.resolve(el);
    } 

    // at this time, we count on the preloader to throw for errors
    // the reject option isn't really being used here...
    if (media.$image) return new Promise(function(resolve, reject){
        var startTime = performance.now();
        var src = media.$image;
        el = document.createElement('img');
        el.onload = function(){
            var latency = performance.now() - startTime ;
            if (latency > 16) $messages({
                type:'warn',
                message: 'It took too long to load "' + src + '" (' + latency +'ms). Make sure that it was preloaded properly.',
                context:src
            });
            resolve(el);
        };
        el.onerror = function(){reject(new Error('Image not found: ' + el.src ));};
        el.src = src;
    });

    if (media.jquery) return Promise.reject(new Error('Jquery is no longer supported in minno-time'));

    return Promise.reject(new Error('Unrecognized media type')); // this is not a supported html type
}

function isWord(val){ return _.isString(val) || _.isNumber(val); }

function customMedia(media){
    var promise = media();
    if (!isThenable(promise)) return Promise.reject(new Error('Custom media must return a promise'));
    return promise.then(forceElement);

    function isThenable(p){ return p && _.isFunction(p.then); }
    function forceElement(el){ return _.isElement(el) ? el : Promise.reject('Custom media must resolve with an element');}
}
