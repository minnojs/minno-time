/*
 * the media view
 *
 */

define(function(require){

    // Adapted from https://gist.github.com/paulirish/1579671 which derived from
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller.
    // Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

    // MIT license

    if (!Date.now)
        Date.now = function() { return new Date().getTime(); };

    (function() {
        'use strict';

        var vendors = ['webkit', 'moz'];
        for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
            var vp = vendors[i];
            window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
            window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                       || window[vp+'CancelRequestAnimationFrame']);
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
            || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function(callback) {
                var now = Date.now();
                var nextTime = Math.max(lastTime + 16, now);
                return setTimeout(function() { callback(lastTime = nextTime); },
                                  nextTime - now);
            };
            window.cancelAnimationFrame = clearTimeout;
        }
    }());



    var Backbone = require('backbone'),
        _ = require('underscore'),
        main_view = require('app/task/main_view');

    var canvas = main_view.$el;

    var View = Backbone.View.extend({

        // build element according to simulus
        initialize: function(options){
            this.options = options || {}; // needed since backbone v1.1.0

            this.$el
                .addClass('stimulus')
                .attr('data-handle', this.model.handle)     // add data-handle for handeling of mouse/touch interactions
                .css('visibility', 'hidden')
                .css(this.model.get('css'))
                .appendTo(canvas);

            this.render();
        },

        // we keep all stimuli appended to the canvas so that the render function can apply to them
        // they shouldn't affect each other because they have absolute positioning
        // we hide and show them using visibility

        render: function(){

            // these are the things that need recalibrating on refresh
            this.size();

            this.deferToLoad(this.place);

            return this;
        },

        deferToLoad: function(cb){
            cb = _.bind(cb, this);
            // if the element does not have a width it has not been loaded yet
            if (this.$el.width()){
                cb();
            } else {
                // we need defer for safari
                // we need raf for chrome on ipad
                _.defer(function(){
                    window.requestAnimationFrame(cb);
                });

            }
        },

        show: function(){
            // if this is a gif, reload it before displaying so that the gif is reset
            if (this.options.type === 'image' && this.options.image.indexOf('gif') !== -1){
                // weird IE bug that prevents refreshing gifs...
				// also, on IE11 you can't refresh a gif when it is not visibility:visible
                if(window.ActiveXObject || 'ActiveXObject' in window){ // true only in IE
                    this.$el.css('visibility', 'visible');
                    this.$el[0].src =  this.options.image + '#' + Math.random();
                } else {
                    // Firefox requires to explicitly empty the "src" before resetting it.
                    this.$el[0].src = '';
                    this.$el[0].src = this.options.image;
                    this.$el.css('visibility', 'visible');
                }

                return this;
            }

            this.deferToLoad(function(){
                this.$el.css('visibility', 'visible');
            });

            return this;
        },

        hide: function(){
            this.$el.css('visibility', 'hidden');
            return this;
        },

        size: function(){
            var size = this.model.get('size');

            if (size.font_size){
                this.$el.css('font-size', size.font_size);
            }
            // if this is a word, we don't want to set height (it breaks centering)
            if (size.height != 'auto' && this.options.type != 'word') {
                this.$el.height(size.height + '%');
            }
            if (size.width != 'auto'){
                this.$el.width(size.width + '%');
            }

            return this;
        },

        // places the element on the canvas (has to be called after size)
        // @TODO: this is way too complex to be left here, we should probably export this to a seperate file or something
        place: function(){

            // helper function: returns sizes of element;
            function size($elem){
                return {
                    height    : $elem.innerHeight(),
                    width    : $elem.innerWidth()
                };
            }

            var top, bottom, left, right; // will hold the offset for the locations
            var canvasSize = size(canvas);
            var elSize = size(this.$el);

            // get location setting and set center as default
            var location = this.model.get('location') || {};
            if (typeof location.top == 'undefined' && typeof location.bottom == 'undefined') {
                location.top = 'center';
            }
            if (typeof location.left == 'undefined' && typeof location.right == 'undefined') {
                location.right = 'center';
            }

            // set offsets:
            switch (location.top){
                case undefined :
                    /* falls through */
                case 'auto'     : top = 'auto'; break;
                case 'center'    : top = (canvasSize.height - elSize.height)/2; break;
                default            : top = (canvasSize.height * location.top)/100;
            }

            switch (location.bottom){
                case undefined :
                    /* falls through */
                case 'auto'     : bottom = 'auto'; break;
                case 'center'    : bottom = (canvasSize.height - elSize.height)/2; break;
                default            : bottom = (canvasSize.height * (location.bottom))/100;
            }

            switch (location.left){
                case undefined :
                    /* falls through */
                case 'auto'     : left = 'auto'; break;
                case 'center'    : left = (canvasSize.width - elSize.width)/2; break;
                default            : left = (canvasSize.width * location.left)/100;
            }

            switch (location.right){
                case undefined :
                    /* falls through */
                case 'auto'     : right = 'auto'; break;
                case 'center'    : right = (canvasSize.width - elSize.width)/2; break;
                default            : right = (canvasSize.width * (location.right))/100;
            }

            this.$el.css({
                top     : top,
                bottom    : bottom,
                left     : left,
                right     : right
            });
        }

    });

    // Returns the View Constructor
    return View;
});