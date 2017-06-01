/*
 * The main view, responsible for managing the canvas
 */
define(function(require){

    var Backbone = require('backbone')
        , $ = require('jquery')
        , _ = require('underscore')
        , fastdom = require('utils/fastdom')
        , adjust_canvas = require('./adjust_canvas')
        , canvas = require('./canvasConstructor')
        ,script = require('app/task/script')
        ,loadingTpl = require('text!templates/loading.html');


    var View = Backbone.View.extend({

        id: 'canvas',

        initialize: function(){
            _.bindAll(this, ['activate','render','destroy']);

            this.deferred = $.Deferred();
            this.deferred.promise().always(this.destroy);

            /**
             * Adjust canvas listener
             * @type {[type]}
             */
            var adjust = this.adjustCanvas.bind(this);
            $(window).on('orientationchange.pip resize.pip', adjust); // removed on destroy
        },

        render: function(){
            this.adjustCanvas(true);
            return this;
        },

        activate: function(){
            var self = this;
            var canvasSettings = script().settings.canvas || {};

            return new Promise(function(resolve){
                $(document).ready(function(){
                    var el = self.$el[0];

                    var map = {
                        background 			: {element: document.body, property: 'backgroundColor'},
                        canvasBackground	: {element: el, property:'backgroundColor'},
                        borderColor			: {element: el, property:'borderColor'},
                        borderWidth			: {element: el, property:'borderWidth'}
                    };

                    // settings activator
                    var off = canvas(map, _.pick(canvasSettings,['background','canvasBackground','borderColor','borderWidth']));
                    self.deferred.promise().always(off);

                    canvasSettings.css && self.$el.css(canvasSettings.css);

                    // append to body and render
                    if ($('[pi-player]').length){
                        $('[pi-player]').empty().append(self.$el);
                    } else {
                        self.$el.appendTo('body');
                    }

                    self.render();
                    resolve();
                });
            });
        },

        // display loading page
        loading: function(parseDef){
            var $bar;

            // if loading has already finished lets skip the loading page
            if (parseDef.state() != 'pending'){
                return parseDef;
            }

            // display the loading template
            this.$el.html(loadingTpl);

            $bar = this.$('.meter span');

            return parseDef
                .progress(function(done, remaining){
                    // update progress bar
                    $bar.width((remaining ? (done/remaining)*100 : 0) + '%');
                });
        },

        empty: function(){
            var $el = this.$el;
            fastdom.mutate(function(){
                $el.empty();
            });
        },

        destroy: function(){
            $(window).off('.pip');
            this.remove();
            this.unbind();
        },

        // sets canvas size (used also for refreshing upon orientation change)
        adjustCanvas: adjust_canvas
    });

    // Returns the View class
    return new View();
});
