define(function(require){
	var _ = require('underscore');

	templateObjProvider.$inject = ['$filter'];
	function templateObjProvider($filter){
		var filter = $filter('template');

		function templateObj(obj, context){
			_.forIn(obj, function(value,key,obj){
				_.isString(value) && (obj[key] = filter(value, context));
			});

			return obj;
		}

		return templateObj;
	}

	return templateObjProvider;
});