define(function(require){

    var fastdom = require('utils/fastdom');
    var getMedia = require('./getMedia');
    var setSize = require('./setSize');
    var setPlace = require('./setPlace');

    function Stimulus(stimulus, trial, canvas){
        var self = {
            el: null, // is set within init, some methods will break if not called before init...
            source: stimulus,
            trial: trial,
            canvas: canvas,
            init: init,
            render: render.bind(self),
            show: show,
            hide: hide,
            name: name,
            mediaName: mediaName
        };

        // make sure we have a data object
        self.data = stimulus.data || {}; 

        // set the handle
        self.handle = self.data.handle = self.data.handle || stimulus.handle || stimulus.set; 

        return self;
    }

    return Stimulus;

    function init(){
        if (!this.source.media) throw new Error('Media object not defined for ' + this.name());
        
        return getMedia(this.source.media)
            .then(setupElement.bind(this, this.canvas))
            .then(render.bind(this)); 
    }

    function setupElement(canvas, el){
        var self = this;
        this.el = el;
        return new Promise(function(resolve){
            fastdom.mutate(function(){
                // setup element
                el.classList.add('stimulus');
                el.setAttribute('data-handle', self.handle); // add data-handle for handeling of mouse/touch interactions
                setSize(el, self.source);

                // @@@@@@@@@@@@@@ TODO @@@@@@@@@@@@@@@@@@@@@@@@@
                //$(el).css(this.source.css || {});



                // append to canvas
                canvas.appendChild(el);
                resolve(el);
            });
        });
    }

    function render(el){
        return setPlace(this.source, this.canvas, el);
    }

    function show(){
        var el = this.el;
        if (!el) throw new Error('A stimulus can not be shown before init is called');

        fastdom.mutate(function(){ 
            el.classList.add('minno-stimulus-visible');
        });
    }

    function hide(){
        var el = this.el;
        if (!el) throw new Error('A stimulus can not be hidden before init is called');

        fastdom.mutate(function(){ 
            el.classList.remove('minno-stimulus-visible');
        });
    }

    function name(){
        var source = this.source;
        // if we have an alias ues it
        if (source.alias) {return source.alias;}
        if (this.data.alias) {return this.data.alias;} // if we have an alias ues it

        if (source.inherit.set) {return source.inherit.set;} // otherwise try using the set we inherited from
        if (this.handle) {return this.handle;} // otherwise use handle

        // if no individual name is given, we set a default at the collection level
    }

    function mediaName(options){
        var media = this.source.media;
        var fullpath = options && options.fullpath;
        // @@@@@@@@@@@@@@@@@ TODO @@@@@@@@@@@@@@@
        // make sure that full path is implemented somewhere higher
        // settings.logger && settings.logger.fullpath; // should we use the full path or just the file name

        if (media.alias) {return media.alias;} // if we have an alias ues it
        for (var prop in media) {
            if (contains(['image','template'],prop)) return fullpath ? media[prop] : media[prop].replace(/^.*[\\\/]/, '');

            // sometimes we have an empty value (this happens when we load a template and then translate it into an inline template)
            if (contains(['word','html','inlineTemplate'],prop) && media[prop]) return media[prop];
        }

        // if no individual name is given, we set a default at the collection level
        
        function contains(arr, val){ return arr.indexOf(val) != -1;}
    }
});
