define(function(require){
	var _ = require('underscore');

	templateObjProvider.$inject = ['$filter'];
	function templateObjProvider($filter){
		var filter = $filter('template');

		function templateObj(obj, context, options){
			options || (options = {});
			var deepTemplate = obj.deepTemplate;

			_.forEach(obj, function(value,key,obj){
				obj[key] = expand(value, context, {deep: _.includes(deepTemplate, key)});
			});

			return obj;
		}

		return templateObj;

		function expand(value, context, options){
			var deep = options && options.deep;

			if (_.isString(value)){
				return filter(value, context);
			}

			if (deep && _.isArray(value)){
				return _.map(value, _.bind(expand, null, _, context, options));
			}

			if (deep && _.isPlainObject(value)){
				return _.mapValues(value, _.bind(expand, null, _, context, options));
			}

			return value;
		}

	}


	return templateObjProvider;
});