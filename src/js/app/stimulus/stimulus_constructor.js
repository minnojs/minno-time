define(function(require){
	var Stim_model = require('./stimulus_model');

	return function Stimulus_constructor(source, options){

		var data = source;
		// keep source for later use
		// @TODO probably depracated
		data.source = source;

		return new Stim_model(data, options);
	};

});