define(['models/collection','underscore'],function(Collection,_){
	var collection = new Collection();

	var hasFit = function compare(data, properties){

		// if the data does not have one of the properties - this is not a fit
		for (var prop in properties){
			if (properties[prop] !== data[prop]){
				return false;
			}
		}
		// by default this is a fit
		return true;
	};

	// extend the collection with goto functions
	_.extend(collection,{
		nextWhere: function nextWhere(properties){
			while (this.next()) {
				// if we find a fit break out of the loop
				if (hasFit(this.current().data || {}, properties)) {
					break;
				}
			}
			return this.current();
		},

		lastWhere: function lastWhere(properties){
			while (this.previous()) {
				// if we find a fit break out of the loop
				if (hasFit(this.current().data || {}, properties)) {
					break;
				}
			}
			return this.current();
		}
	});

	return collection;
});
