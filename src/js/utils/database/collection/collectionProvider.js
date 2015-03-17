define(['underscore'],function(_){
	/*
	 * The constructor for an Array wrapper
	 */

	function collectionService(){

		function Collection (arr) {
			if (arr instanceof Collection) {
				return arr;
			}

			// Make sure we are creating this array out of a valid argument
			if (!_.isUndefined(arr) && !_.isArray(arr) && !(arr instanceof Collection)) {
				throw new Error('Collections can only be constructed from arrays');
			}

			this.collection = arr || [];
			this.length = this.collection.length;

			// pointer to the current location within the array
			// we start with -1 so that the initial next points to the begining of the array
			this.pointer = -1;
		}

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

				this.length = this.collection.length;

				return this;
			},

			// return the item at index
			at: function(index){
				return this.collection[index];
			}
		});


		// Stuff we took out of bootstrap that can augment the collection
		// **************************************************************
		var methods = ['where','filter'];
		var slice = Array.prototype.slice;

		// Mix in each Underscore method as a proxy to `Collection#models`.
		_.each(methods, function(method) {
			Collection.prototype[method] = function() {
				var args = slice.call(arguments);
				args.unshift(this.collection);
				var coll = _[method].apply(_,args);
				return new Collection(coll);
			};
		});

		return Collection;
	}

	return collectionService;


});