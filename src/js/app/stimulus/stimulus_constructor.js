define(function(require){
	var Stim_model = require('./stimulus_model')
		, inflate = require('../inflator');

	return function Stimulus_constructor(modelData, options){

		// inflate trial source
		var data = inflate(modelData,'stimulus');
		// keep source for later use
		data.source = modelData;

		return new Stim_model(data, options);
	};

});