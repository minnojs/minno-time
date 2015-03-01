/**
 *
 * This whole module taken from piManager
 *
 */
define(function(require){

	var _ = require('underscore');

	/**
	 * Takes a map of css rules and applies them.
	 * Returns a function that returns the page to its former condition.
	 *
	 * The rule map is an object of ruleName -> ruleObject.
	 *
	 * var ruleObject = {
	 * 	element : wrapped element to affect
	 * 	property: css property to modify
	 * }
	 *
	 * @param  {Object} map      A hash of rules.
	 * @param  {Object} settings A hash of ruleName -> value
	 * @return {Function}        A function that undoes all the previous changes
	 */
	function canvasContructor(map, settings){
		var offArr;

		if (!_.isPlainObject(map)){
			throw new Error('canvas(map): You must set a rule map for canvas to work properly');
		}

		// if settings is undefined return a function that doesn't do anything
		// just so we don't need to make sure that the user modifies the canvas
		if (_.isUndefined(settings)){
			return _.noop;
		}

		if (!_.isPlainObject(settings)){
			throw new Error('canvas(settings): canvas settings must be an object');
		}

		// create an array of off functions to undo any changes by this action
		offArr = _.map(settings, function(value,key){
			var rule = map[key];
			if (rule){
				return on(rule.element, rule.property, value);
			} else {
				throw new Error('canvas('+ key +'): unknow key in canvas object.');
			}
		});

		return function off(){
			_.forEach(offArr, function(fn){fn.call();});
		};
	}

	function on($el, property, value){
		var old = $el.css(property); // save old value
		$el.css(property, value); // set new value
		return _.bind($el.css, $el, property, old); // create off function: bind $el.css(property, old)
	}

	return canvasContructor;

});