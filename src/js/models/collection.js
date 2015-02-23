define(function(require){
	/*
	 * The constructor for an Array wrapper
	 */

	var _ = require('underscore');

	var Collection = function Collection () {
		this.collection = [];

		// pointer to the current location within the array
		// we start with -1 so that the initial next points to the begining of the array
		this.pointer = -1;


	};

	_.extend(Collection.prototype,{

		first : function first(){
			this.pointer = 0;
			return this.collection[this.pointer];
		},

		last : function last(){
			this.pointer = this.collection.length - 1;
			return this.collection[this.pointer];
		},

		end : function end(){
			this.pointer = this.collection.length;
			return undefined;
		},

		current : function(){
			return this.collection[this.pointer];
		},

		next : function(){
			return this.collection[++this.pointer];
		},

		previous : function(){
			return this.collection[--this.pointer];
		},

		// add list of items to the collection
		add : function(list){
			// dont allow adding nothing
			if (!arguments.length) {
				return this;
			}

			// make sure list is as an array
			list = _.isArray(list) ? list : [list];
			this.collection = this.collection.concat(list);

			return this;
		},

		// return the item at index
		at: function(index){
			return this.collection[index];
		}
	});

	return Collection;
});