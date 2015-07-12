define(function(require) {
	var MyModel = require("models/model")
		,MediaView = require("app/media/media_constructor")
		,pubsub = require("utils/pubsub")
		,_ = require("underscore")
		,is_touch = require("utils/is_touch")
		,settings = require("app/task/settings");


	var Model = MyModel.extend({
		initialize: function(){
			// set trial in the model
			if (this.collection.trial) {
				this.trial = this.collection.trial;
			}

			// set model handle
			this.attributes.data = this.attributes.data || {}; // make sure we have a data object
			this.attributes.data.handle = this.attributes.data.handle || this.attributes.handle; // set the handle in the data object
			this.handle =  this.attributes.data.handle; // set the handle in the stimulus object

			// pick the correct media according to if this is a touch device
			var mediaSource = is_touch && this.get('touchMedia') ? this.get('touchMedia') : this.get('media');

			// take the media source and build it into a full fledged view
			this.media = new MediaView(mediaSource,this);

		},

		// Default values for all of the attributes
		defaults: {
			size: {height: 'auto', width: 'auto'},
			css:{}
		},


		// activate stimulus listeners (maybe these shoud sit in one of the trial modules? call with apply)
		// ----------------------------------------------------------------------------------------------------------

		activate: function(){
			var self = this;
			var stimHandle = this.handle;
			this.timeStack = this.timeStack || [];
			this.pubsubStack = this.pubsubStack || [];

			// subscribe to start action
			// -------------------------
			pubsub.subscribe('stim:start', self.pubsubStack, function(handle){
				if (!_.include([stimHandle,'All'], handle)) {
					// make sure this publication is aimed at us
					return false;
				}

				// present the stimulus
				self.media.show();
			});

			// subscribe to set attribute action
			// ---------------------------------

			pubsub.subscribe('stim:setAttr', self.pubsubStack, function(handle,setter){
				if (!_.include([stimHandle,'All'], handle)) {
					// make sure this publication is aimed at us
					return false;
				}

				// if this is a function let it do whatever it wants with this model, otherwise simply call set.
				if (_.isFunction(setter)) {
					setter.apply(self);
				} else {
					var data = self.get('data') || {};
					data = _.extend(data, setter);
					self.set('data', data);
				}
			});

			// subscribe to stop stimulus action
			// ---------------------------------
			pubsub.subscribe('stim:stop', self.pubsubStack, function(handle){
				if (!_.include([stimHandle,'All'], handle)) {
					// make sure this publication is aimed at us
					return false;
				}

				// hide the stimulus
				self.media.hide();
			});
		},

		disable: function(){
			// hide the stimulus
			this.media.hide();

			// make sure the stacks exist
			this.timeStack = this.timeStack || [];
			this.pubsubStack = this.pubsubStack || [];

			_.each(this.pubsubStack, function(handle) {
				pubsub.unsubscribe(handle);
			});

			// empty stacks
			this.timeStack = [];
			this.pubsubStack = [];
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
			var fullpath = settings.logger && settings.logger.fullpath; // should we use the full path or just the file name
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
	return Model;

});