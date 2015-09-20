/*
 * The main view, responsible for managing the canvas
 */
define(function(require){

	var Backbone = require('backbone')
		, $ = require('jquery')
		, _ = require('underscore')
		, adjustCanvas = require('./adjustCanvas')
		, canvas = require('./canvasConstructor')
		,loadingTpl = require('text!./loading.html');


	var ContainerView = Backbone.View.extend({
		id: 'canvas',

		initialize: function(options){
			this.options = options;
			this.canvasSettings = _.get(this.options, 'settings.canvas' ,{});

			_.bindAll(this, ['activate','render','destroy']);

			this.deferred = $.Deferred();
			this.deferred.promise().always(this.destroy);

			/**
			 * Adjust canvas listener
			 * @type {[type]}
			 */
			var adjust = _.bind(this.adjustCanvas,this);
			$(window).on('orientationchange.pip resize.pip', adjust);
		},

		render: function(){
			this.adjustCanvas({init:true});
			return this;
		},

		activate: function(){
			if (document.readyState == 'loading'){
				throw new Error('Player cannot be activated before document is loaded.');
			}

			var self = this;
			var canvasSettings = this.canvasSettings;


			var map = {
				background 			: {element: $('body'), property: 'backgroundColor'},
				canvasBackground	: {element: self.$el, property:'backgroundColor'},
				borderColor			: {element: self.$el, property:'borderColor'},
				borderWidth			: {element: self.$el, property:'borderWidth'}
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
		},

		// display loading page
		loading: function(parseDef){
			var $bar;
			var self = this;

			// if loading has already finished lets skip the loading page
			if (parseDef.state() != "pending"){
				return parseDef;
			}

			// display the loading template
			this.$el.html(loadingTpl);

			$bar = this.$('.meter span');

			return parseDef
				.progress(function(done, remaining){
					// update progress bar
					$bar.width((remaining ? (done/remaining)*100 : 0) + '%');
				})
				.done(function(){
					self.empty();
				});
		},

		empty: function(){
			this.$el.empty();
		},

		destroy: function(){
			$(window).off('.pip');
			this.remove();
			this.unbind();
		},

		// sets canvas size (used also for refreshing upon orientation change)
		adjustCanvas: adjustCanvas
	});

	// Returns the View class
	return ContainerView;
});