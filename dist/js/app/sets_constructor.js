/*
 * returns a constructor for sets
 *
 * the constructur returns a function that can optionaly be used to create new sets: function sets(setData)
 *
 * and returns the set stack:
 *
 * {
 *		setName: [component,component,component]
 *		setName: [component,component,component]
 * }
 *
 */
define(function(require){
	var _ = require('underscore');
	var Set = require('models/set');
	// the constructor
	function Set_constructor(){
		// the (private) set stack
		var setStack = {};

		// setter function (optionaly adds sets, returns the set stack)
		// this is the interface to this object
		function sets(setArr){
			_.each(setArr,function(value,key){
				setStack[key] = new Set(value);
				setStack[key].name = key;
			});

			return setStack;
		}

		// return the setter function
		return sets;
	}

	return Set_constructor;
});
