/*
 * The main view, responsible for managing the canvas
 */
define(['backbone','jquery','underscore','./adjust_canvas','app/task/script','text!templates/loading.html'], function(Backbone, $, _, adjust_canvas,script,loadingTpl){

	var View = Backbone.View.extend({

		id: 'canvas',

		initialize: function(){
			_.bindAll(this, ['activate','render','destroy']);

			this.deferred = $.Deferred();
			this.deferred.promise().then(this.destroy);

			$(window).on('orientationchange.pip resize.pip', $.proxy(this.adjustCanvas,this));
		},

		render: function(){
			this.adjustCanvas(true);
			return this;
		},

		activate: function(){
			var self = this;
			var settings = script().settings.canvas || {};
			var docReady = $.Deferred(); // document ready deferred, so we can continue only after activation has culminated

			$(document).ready(function(){
				// canvas decorations
				if (settings.background) {$('body').css('background-color',settings.background);}
				if (settings.canvasBackground) {self.$el.css('background-color',settings.canvasBackground);}
				if (settings.borderColor) {self.$el.css('border-color',settings.borderColor);}
				if (settings.borderWidth) {self.$el.css('border-width',settings.borderWidth);}
				if (settings.css) {self.$el.css(settings.css);}

				// append to body and render
				if ($('[pi-player]').length){
					$('[pi-player]').empty().append(self.$el);
				} else {
					self.$el.appendTo('body');
				}

				self.render();
				docReady.resolve();
			});

			return docReady;
		},

		// display loading page
		loading: function(parseDef){
			var $bar;

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
		adjustCanvas: adjust_canvas
	});

	// Returns the View class
	return new View();
});