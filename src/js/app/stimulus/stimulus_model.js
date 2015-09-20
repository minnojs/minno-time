define(function(require) {
	var Model = require('backbone').Model
		,MediaView = require('app/media/media_constructor')
		,_ = require('underscore')
		,is_touch = require('utils/is_touch');

	var Stimulus = Model.extend({
		initialize: function(source, options){
			// set trial in the model
			this.trial = options.trial;
			this.settings = options.settings;

			// set model handle
			this.attributes.data = source.data || {}; // make sure we have a data object
			this.attributes.data.handle = this.attributes.data.handle || this.attributes.handle; // set the handle in the data object
			this.handle = this.attributes.data.handle; // set the handle in the stimulus object

			this._setMedia(options.container);
		},

		// Default values for all of the attributes
		defaults: {
			size: {height: 'auto', width: 'auto'},
			css:{}
		},

		// Public functions for activating and deactivating the stimulus
		// -------------------------------------------------------------

		activate: function(){
			this.listenTo(this.trial,'stim:start', this.start);
			this.listenTo(this.trial,'stim:stop', this.stop);
			this.listenTo(this.trial,'stim:setAttr', this.setData);
		},

		disable: function(){
			this.stop();
			this.stopListening();
		},

		// Stimulus actions
		// ----------------

		start: function(handle){
			this._selected(handle) && this.set('$show', true);
		},

		stop: function(handle){
			this._selected(handle) && this.set('$show', false);
		},

		setData: function(handle,setter){
			if (!this._selected(handle)) {return false;}
			var data = this.get('data') || {};

			// if this is a function let it do whatever it wants with this model, otherwise simply call set.
			if (_.isFunction(setter)) {
				setter.call(this,this,data);
			} else {
				this.set('data', _.extend({},data, setter));
			}
		},

		// Helpers
		// -------

		// helper to check whether this stimulus is targeted by an action
		_selected: function(handle){
			return _.include([this.handle, 'All'], handle);
		},

		// setup the media
		_setMedia: function(container){
			// pick the correct media according to if this is a touch device
			var mediaSource = is_touch && this.get('touchMedia') ? this.get('touchMedia') : this.get('media');

			// take the media source and build it into a full fledged view
			this.media = new MediaView({
				model: this,
				source: mediaSource,
				trial: this.trial,
				container: container
			});
		},

		name: function(){
			var attr = this.attributes;
			if (attr.data.alias) {return attr.data.alias;} // if we have an alias ues it
			if (attr.inherit && attr.inherit.set) {return attr.inherit.set;} // otherwise try using the set we inherited from
			if (attr.handle) {return attr.handle;} // otherwise use handle
			return 'Anonymous Stimulus'; // we're out of options here
		},

		mediaName: function(){
			var media = this.media.options;
			var fullpath = _.get(this.settings,'logger.fullpath',false); // should we use the full path or just the file name

			if (media.alias) {return media.alias;} // if we have an alias ues it
			for (var prop in media) {
				if (_.contains(['image','template'],prop)) {
                    return fullpath ? media[prop] : media[prop].replace(/^.*[\\\/]/, '');
				}
				if (_.contains(['word','html','inlineTemplate'],prop) && media[prop]) { // sometimes we have an empty value (this happens when we load a template and then translate it into an inline template)
                    return media[prop];
				}
			}
		}
	});

	// Returns the Model class
	return Stimulus;

});