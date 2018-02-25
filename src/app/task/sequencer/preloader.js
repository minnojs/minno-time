
/*
 * media preloader
 * TODO: turn into factory, possibly make progress into a stream.
 */
import _ from 'lodash';
export default loader;

var srcStack = [];				// an array holding all our sources
var defStack = [];				// an array holding all the deferreds
var stackDone = 0;				// the number of sources we have completed downloading
var images = {};
var getText = _.memoize(getXhr);

var loader = {
    // loads a single source
    load: load,

    all: function(){
        return Promise.all(defStack);
    },

    progress: function(){
        return defStack.length ? stackDone/defStack.length : 1;
    }
};

// load a single source
function load(src, type){
    // the source was already loaded
    if (srcStack.indexOf(src) !== -1) return false;

    // if we haven't loaded this yet
    var promise = type == 'template' ? getText(src) : getImage(src);

    promise
        .then(function(){stackDone++;})
        .then(function(){
            loader.onload && loader.onload(src);
        })
        .catch(function(e){
            loader.onerror && loader.onerror(e, src);
        });

    // keep defered and source for later.
    defStack.push(promise);
    srcStack.push(src);

    return promise;
}

function getImage(url){
    return  new Promise(function(resolve, reject){
        var el = document.createElement('img');
        el.onload = function(){resolve(el);};
        el.onerror = function(){reject(new Error('Image not found: ' + url ));};
        el.src = url;
        images[url] = el;
    });
}

function getXhr(url){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('GET',url, true);
        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) resolve(this.responseText);
                else reject(new Error('Template not found:' + url));
            }
        };
        request.send();
    });
}
