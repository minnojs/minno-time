define(function(require){
	var _ = require('underscore');

	mixerDotNotationProvider.$inject = ['dotNotation'];
	function mixerDotNotationProvider(dotNotation){

		function mixerDotNotation(chain, obj){

			var escapeSeparatorRegex= /[^\/]\./;

			if (!_.isString(chain)){
				return chain;
			}

			// We do not have a non escaped dot: we treat this as a string
			if (!escapeSeparatorRegex.test(chain)){
				return chain.replace('/.','.');
			}

			return dotNotation(chain, obj);
		}

		return mixerDotNotation;
	}

	return mixerDotNotationProvider;

});