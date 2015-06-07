define(function(require) {
	var _ = require('underscore')
		, Backbone = require('backbone');

	var Model = Backbone.Collection.extend({
		// holds a list of the next members to call if we're using the exclusive randomisation
		orderList: [],
		// the next pick for the bySequence function
		nextPick: 0,

		// similar to the collection function where, only searches the data attribute
		whereData: function(attrs) {
			if (_.isEmpty(attrs)) {
				return [];
			}
			return this.filter(function(model) {
				var data = model.get('data') || {};
				for (var key in attrs) {
					if (attrs[key] !== data[key]){
                        return false;
                    }
				}
                return true;
			});
		},

		// plain randomization
		random: function(){
			return this.at(Math.floor(Math.random()*this.length)).attributes;
		},

		// randomize without repeat
		exRandom: function(){
			this.orderList = this.orderList.length ? this.orderList : _.shuffle(_.range(this.length));
			return this.at(this.orderList.pop()).attributes;
		},

		bySequence: function(){
			// reset the nextPick pointer if needed
			this.nextPick < this.length || (this.nextPick = 0);
			return this.at(this.nextPick++).attributes;
		},

		// find model by data attributes
		// check if all attributes of the handle appear in the model data
		// if the handle is not an abject compare to data.handle
		byData: function(definitions){
			if (_.isUndefined(definitions.data)) {
				throw new Error("A data property must by defined for byData");
			}

			// if a the data property is a string, assume its a handle
			var data =  _.isString(definitions.data) ? {handle:definitions.data} : definitions.data;

			// get the first element that fits the handle
			var element = this.whereData(data)[0];
			if (!element) {
                throw new Error('Inherit by Data failed. Data not found: ' + definitions.data);
            }
			return	element.attributes;
		},

		getInherited: function(definitions){
			// if this is a function, return it with the set as "this"
			if (_.isFunction(definitions.type)) {
                return definitions.type.call(this,definitions);
            }

			// otherwise call the appropriate built in function
			switch (definitions.type) {
				case 'bySequence' : return this.bySequence();
				case 'byData' : return this.byData(definitions);
				case 'exRandom' : return this.exRandom();
				case 'random' :
                    /* falls through */
				default:
					return this.random();
			}
		},

		inherit: function(definitions){
			if (!this.length){
				throw new Error('You attempted to inherit from an empty set ({' + this.name + '})');
			}

			var result = this.getInherited(definitions);

			if (!result){
				throw new Error('You tried to inherit from {' + this.name + '} but an appropriate element was not found');
			}

			return result;
		}

	});

	// Returns the Model class
	return Model;
});