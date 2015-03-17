define(function(require){
	var _ = require('underscore');

	function dotNotation(chain, obj){

		if (_.isString(chain)){
			chain = chain.split('.');
		}

		return _.reduce(chain, function(result, link){

			if (_.isPlainObject(result) || _.isArray(result)){
				return result[link];
			}

			return undefined;

		}, obj);
	}

	return dotNotation;
});