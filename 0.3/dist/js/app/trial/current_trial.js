define(function(){
	/*
	 * holds a "global" instance of the current trial so we don't have to pass it on blindly.
	 *
	 * returns a function that return trial.
	 * if it gets input, it replaces the current trial with the input;
	 */

	var trial;

	return function(newTrial){
		if (newTrial) {
			trial = newTrial;
		}

		return trial;
	};
});