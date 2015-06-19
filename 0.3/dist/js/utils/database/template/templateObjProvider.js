define(function(require){
	var _ = require('underscore');

	templateObjProvider.$inject = ['$filter'];
	function templateObjProvider($filter){
		var filter = $filter('template');

		function templateObj(obj, context, options){
			options || (options = {});
			var result = {};
			var skip = options.skip || [];

			_.forEach(obj, function(value,key,obj){
				if (!_.includes(skip, key)){
					result[key] = expand(value, context);
				} else {
					result[key] = obj[key];
				}
			});

			return result;
		}

		return templateObj;

		function expand(value, context){

			if (_.isString(value)){
				return filter(value, context);
			}

			if (_.isArray(value)){
				return _.map(value, _.bind(expand, null, _, context));
			}

			if (_.isPlainObject(value)){
				return _.mapValues(value, _.bind(expand, null, _, context));
			}

			return value;
		}

	}


	return templateObjProvider;
});