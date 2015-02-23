define(function(require) {
	var _ = require('underscore')
		, Backbone = require('backbone');

	// ***********  prototypal inheritance  ***********
	// use example: newObject = Object.create(oldObject);
	// @todo: do we realy need this?
	if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() {}
			F.prototype = o;
			return new F();
		};
	}


	var Model = Backbone.Model.extend({

		constructor : function ( attributes, options ) {
			var new_attributes = {};

			// clone attributes so that we prototipicaly inherit objects
			_.each(attributes, function(value, key){

				if (_.isObject(value)) {
					// inherit object
					var child = Object.create(value);

					// default to the default properties of the model
					var defaultObj = this.defaults && this.defaults[key] && _.isObject(this.defaults[key]) ? this.defaults[key] : {};
					new_attributes[key] = _.defaults(child, defaultObj);
				} else {
					new_attributes[key] = value;
				}
			},this);

			// Note that __super__ is not part of the documented API, but
			// it seems to me that a lot of actual Backbone behavior is not
			// documented, and since __super__ is there, so far I've been
			// using it instead of setting my own property to store the
			// reference to the parent class.

			Backbone.Model.apply(this, [new_attributes, options]);

		}

	});

	// Returns the Model class
	return Model;
});