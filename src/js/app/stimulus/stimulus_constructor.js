define(['./stimulus_model', '../inflator'], function(Stim_model,inflate) {

	return function Stimulus_constructor(modelData, options){

		// inflate trial source
		var data = inflate(modelData,'stimulus');
		// keep source for later use
		data.source = modelData;

		return new Stim_model(data, options);
	};

});