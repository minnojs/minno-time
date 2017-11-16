import fastdom from 'fastdom';
import getMedia from './getMedia';
import setSize from './setSize';
import setPlace, {fixIE} from './setPlace';
import css from 'css';

export default Stimulus;

function Stimulus(stimulus, trial, canvas){
    var self = {
        el: null, // is set within init, some methods will break if not called before init...
        source: stimulus,
        trial: trial,
        canvas: canvas,
        init: init,
        show: show,
        hide: hide,
        name: name,
        mediaName: mediaName,
        destroy: destroy
    };

    // make sure we have a data object
    self.data = stimulus.data || {};

    // set the handle
    self.handle = self.data.handle = self.data.handle || stimulus.handle || stimulus.set;

    return self;
}


function init(){
    if (!this.source.media) throw new Error('Media object not defined for ' + this.name());

    return getMedia(this.source.media)
        .then(setupElement.bind(this, this.canvas));
}

function setupElement(canvas, el){
    var self = this;
    this.el = el;
    return new Promise(function(resolve){
        fastdom.mutate(function initStim(){
            // setup element
            el.classList.add('minno-stimulus');
            el.setAttribute('data-handle', self.handle); // data-handle for handeling of mouse/touch interactions
            setSize(el, self.source);
            setPlace(el, self.source);
            css(el, self.source.css || {});

            if (self.source.isLayout) el.classList.add('minno-stimulus-visible');

            // append to canvas
            canvas.appendChild(el);

            if (document.documentMode) fixIE(el, resolve);
            else resolve(el);
        });
    });
}

function show(){
    var el = this.el;
    if (!el) throw new Error('A stimulus can not be shown before init is called');

    fastdom.mutate(function showStim(){
        el.classList.add('minno-stimulus-visible');
    });
}

function hide(){
    var el = this.el;
    if (!el) throw new Error('A stimulus can not be hidden before init is called');

    fastdom.mutate(function hideStim(){
        el.classList.remove('minno-stimulus-visible');
    });
}

function destroy(){
    var el = this.el;
    var canvas = this.canvas;
    fastdom.mutate(function removeStim(){
        canvas.removeChild(el);
    });
}

function name(){
    var source = this.source;
    // if we have an alias ues it
    if (source.alias) {return source.alias;}
    if (this.data.alias) {return this.data.alias;} // if we have an alias ues it

    if (source.inherit && source.inherit.set) {return source.inherit.set;} // otherwise try using the set we inherited from
    if (this.handle) {return this.handle;} // otherwise use handle

    // if no individual name is given, we set a default at the collection level
}

function mediaName(options){
    var media = this.source.media;
    var fullpath = options && options.fullpath; // as set within settings

    if (media.alias) {return media.alias;} // if we have an alias ues it

    for (var prop in media) {
        if (contains(['image','template'],prop)) return fullpath ? media[prop] : media[prop].replace(/^.*[\\/]/, '');

        // sometimes we have an empty value (this happens when we load a template and then translate it into an inline template)
        if (contains(['word','html','inlineTemplate'],prop) && media[prop]) return media[prop];
    }

    // if no individual name is given, we set a default at the collection level
}

function contains(arr, val){ return arr.indexOf(val) != -1;}
