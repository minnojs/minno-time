
/*
 * media preloader
 * TODO: turn into factory, possibly make progress into a stream.
 */
export default loader;

var srcStack = [];				// an array holding all our sources
var defStack = [];				// an array holding all the deferreds
var stackDone = 0;				// the number of sources we have completed downloading
var images = {};

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
    var promise;
    type = type || 'image';
    // the source was already loaded
    if (srcStack.indexOf(src) !== -1) return false;

    // if we haven't loaded this yet
    switch (type) {
        case 'template':
            promise = new Promise(function(resolve, reject){
                // @TODO: get rid of requirejs dependency
                requirejs(['text!' + src], resolve, function(){
                    reject(new Error('Template not found: ' + src));
                });
            });
            break;
        case 'image':
            /* falls through */
        default :
            promise = new Promise(function(resolve, reject){
                var el = document.createElement('img');
                el.onload = function(){resolve(el);};
                el.onerror = function(){reject(new Error('Image not found: ' + el.src ));};
                el.src = src;
                images[src] = el;
            });
            break;
    }

    promise
        .then(function(){stackDone++;})
        .then(function(){
            loader.onload && loader.onload();
        });

    // keep defered and source for later.
    defStack.push(promise);
    srcStack.push(src);

    return promise;
}
