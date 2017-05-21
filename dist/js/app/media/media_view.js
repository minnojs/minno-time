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

    if (!Date.now) Date.now = function() { return new Date().getTime(); };

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
        fastdom = require('utils/fastdom'),
        main_view = require('app/task/main_view');

    var canvas = main_view.$el;

    var View = Backbone.View.extend({
        
        // build element according to simulus
        initialize: function(options){
            var self = this;
            var $el = this.$el;
            this.options = options || {}; // needed since backbone v1.1.0

            fastdom.mutate(function(){
                $el.addClass('stimulus');
                $el.attr('data-handle', self.model.handle);     // add data-handle for handeling of mouse/touch interactions
                $el.css(self.model.get('css'));
                $el.appendTo(canvas);
            });

            this.render();
        },

        // we keep all stimuli appended to the canvas so that the render function can apply to them
        // they shouldn't affect each other because they have absolute positioning
        // we hide and show them using opacity

        render: function(){
            // these are the things that need recalibrating on refresh
            this.size();
            this.place();
        },

        show: function(){
            var $el = this.$el;
            fastdom.mutate(function(){ 
                $el.addClass('minno-stimulus-visible');
            });
        },

        hide: function(){
            var $el = this.$el;
            fastdom.mutate(function(){
                $el.removeClass('minno-stimulus-visible');
            });
        },

        size: function(){
            var self = this;
            var style = this.$el[0].style;

            fastdom.mutate(function(){
                var size = self.model.get('size');

                if (size.font_size) style.fontSize = size.font_size;

                // if this is a word, we don't want to set height (it breaks centering)
                if (size.height != 'auto' && self.options.type != 'word') style.height = size.height + '%';

                if (size.width != 'auto') style.width = size.width + '%';
            });

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

            var canvasSize, elSize;
            var self = this;
            var $el = this.$el;

            fastdom.measure(function(){
                canvasSize = size(canvas);
                elSize = size($el);
            });

            fastdom.mutate(function(){
                var top, bottom, left, right; // will hold the offset for the locations
                // get location setting and set center as default
                var location = self.model.get('location') || {};
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

                var style = $el[0].style;
                style.top = top;
                style.bottom = bottom;
                style.left = left;
                style.right = right;
            });
        }

    });

    // Returns the View Constructor
    return View;
});
