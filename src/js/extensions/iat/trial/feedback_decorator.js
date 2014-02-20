/*
 * Returns a decorator for trial objects that adds feedback interactions and stimuli
 */
define(['../data/properties'],function(properties){
	var decorator = function(trial){
		var feedback_types = ['correct', 'error', 'timeout'];
		var interactions = trial.interactions;

		for (var i=0; i < feedback_types.length; i++){
			var FBtype = feedback_types[i] + '_feedback';
			var propertiesObj = properties[FBtype] || {};

			// if we're not going to display any feedback, trigger the end action imidiately
			if (!propertiesObj.active) {
				interactions.push({
					conditions: [{type:'inputEquals',value: FBtype}],
					actions: [{type:'trigger',handle : 'remove_' + FBtype}]
				});
			} else {
				// show feedback
				interactions.push({
					conditions: [{type:'inputEquals',value: FBtype}],
					actions: [
						{type:'showStim',handle : FBtype},
						{type:'setInput',input:{handle:'remove_' + FBtype, on:'timeout', duration:propertiesObj.duration >= 0 ? propertiesObj.duration : 300}}
					]
				});
			} // end if FB is active

			// end trial if this isn't an error or if we don't need to correct errors
			if (FBtype !== 'error_feedback' || !properties.correct_errors) {
				interactions.push({
					conditions: [{type:'inputEquals',value: 'remove_' + FBtype}],
					actions: [
						{type:'trigger',handle: 'end'}
					]
				});
			} else {
				// if we need to correct errors
				// and the error feedback is temporary
				if (propertiesObj.duration !== 'static') {
					interactions.push({
						conditions: [{type:'inputEquals',value: 'remove_' + FBtype}],
						actions: [
							{type:'hideStim',handle : FBtype}
						]
					});
				}
			}

		} // end FBtype loop

		return trial;
	};

	return decorator;

});