define(function(require){
	var _ = require('underscore');

	evaluateProvider.$inject = ['mixerCondition'];
	function evaluateProvider(condition){
		/**
		 * Checks if a conditions set is true
		 * @param  {Array} conditions [an array of conditions]
		 * @param  {Object} context   [A context for the condition checker]
		 * @return {Boolean}          [Are these conditions true]
		 */

		function evaluate(conditions,context){
			// make && the default
			_.isArray(conditions) && (conditions = {and:conditions});

			function test(cond){return evaluate(cond,context);}

			// && objects
			if (conditions.and){
				return _.every(conditions.and, test);
			}
			if (conditions.nand){
				return !_.every(conditions.nand, test);
			}

			// || objects
			if (conditions.or){
				return _.some(conditions.or, test);
			}
			if (conditions.nor){
				return !_.some(conditions.nor, test);
			}

			return condition(conditions, context);
		}

		return evaluate;
	}

	return evaluateProvider;
});