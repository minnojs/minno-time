define(function(require){
	var _ = require('underscore')
		, Backbone = require('backbone')
		, stimModel = require('app/stimulus/stimulus_constructor');

	var Collection = Backbone.Collection.extend({
		model:stimModel,

		initialize: function(models,options){
			options || (options = {});

			// set trial in the collection
			this.trial = options.trial;
		},

		// similar to the collection function where, only searches the data attribute
		whereData: function(attrs) {

			if (_.isEmpty(attrs)) {
				return [];
			}
			return this.filter(function(model) {
				var data = model.get('data') || {};

			for (var key in attrs) {
				if (attrs[key] !== data[key]) {
                    return false;
                }
			}
			return true;
			});
		},

		activate: function(){
			this.each(function(stimulus){
				stimulus.activate();
			});
			return this;
		},

		disable: function(){
			this.each(function(stimulus){
				stimulus.disable();
			});
			return this;
		},

		display_all: function(){
			this.each(function(stimulus){
				stimulus.media.show();
			});
		},

		hide_all: function(){
			this.each(function(stimulus){
				stimulus.media.hide();
			});
		},

		refresh: function(){
			this.each(function(stimulus){
				stimulus.media.render();
			});
		},

		get_stimlist: function(){
			return this
				.chain()
				.filter(function(stimulus){return !stimulus.get('nolog');})
				.map(function(stimulus,index){
					return stimulus.name() || ('stim' + index);
				})
				.value();
		},

		get_medialist: function(){
			return this
				.chain()
				.filter(function(stimulus){return !stimulus.get('nolog');})
				.map(function(stimulus,index){
					return stimulus.mediaName() || ('media' + index);
				})
				.value();
		}

	});

	// Returns the Collection class
	return Collection;

});