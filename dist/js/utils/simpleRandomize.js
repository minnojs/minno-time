/**
 *	Takes a properties objects and returns the result of a randomization:
 *	If it is an array - pick a random member
 *	If it is an object pick from within a range
 *	If it is a function return its result using the context
 *	Otherwise simply return the properties
 */
define(function(require){
	var _ = require('underscore');

	function simpleRandomize(properties, context){

		if (_.isArray(properties)) {
			var index = Math.floor(Math.random()*properties.length);
			return properties[index];
		}

		if (_.isFunction(properties)) {
			return properties.call(context);
		}

		// this must be after the test for arrays and functions, because they are considered objects too
		if (_.isPlainObject(properties)) {
			if (!_.isNumber(properties.min) || !_.isNumber(properties.max) || properties.min > properties.max) {
				throw new Error('randomization objects need both a max and a minimum property, also max has to be larger than min');
			}
			return properties.min + (properties.max - properties.min) * Math.random();
		}

		// if this is not a randomization object simply return
		return properties;
	}

	return simpleRandomize;
});