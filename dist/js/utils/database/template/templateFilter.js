define(function(require){
	var _ = require('underscore');

	templateFilter.$inject = ['$log','templateDefaultContext'];
	function templateFilter($log, defaultContext){

		function template(input, context){

			// if there is no template just return the string
			if (!~input.indexOf('<%')){
				return input;
			}

			// build context (extend it with the default context)
			context = _.extend(context || {}, defaultContext);

			// filters don't throw errors when used from within templates
			// therefore we need catch any errors here... (we may decide to drop this if it hits performance too mutch...)
			try{
				return _.template(input)(context);
			} catch(e){
				$log.error("ERROR: \"" + e.message + "\" in the following template: ", input);
				return "";
			}

		}

		return template;

	}

	return templateFilter;
});