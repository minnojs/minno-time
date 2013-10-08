/*
 * Returns a decorator for trial objects that adds feedback interactions and stimuli
 */
define(['../properties'],function(properties){
	var decorator = function(trial){
		var feedback_types = ['correct', 'error', 'timeout'];
		var interactions = trial.interactions;

		for (var i=0; i < feedback_types.length; i++){
			var FBtype = feedback_types[i] + '_feedback';
			var propertiesObj = properties[FBtype] || {};

			// if we're not going to display any feedback, trigger the end action imidiately
			if (!propertiesObj.active) {
				interactions.push({
					propositions: [{type:'inputEquals',value: FBtype}],
					actions: [{type:'trigger',handle : 'remove_' + FBtype}]
				});
			} else {
				// actions
				// ******************************************

				// show feedback
				interactions.push({
					propositions: [{type:'inputEquals',value: FBtype}],
					actions: [
						{type:'showStim',handle : FBtype},
						{type:'setInput',input:{handle:'remove_' + FBtype, on:'timeout', duration:propertiesObj.duration || 300}}
					]
				});

				// remove feedback
				interactions.push({
					propositions: [{type:'inputEquals',value: 'remove_' + FBtype}],
					actions: [
						{type:'hideStim',handle : FBtype}
					]
				});

				// end trial if we don't need to correct errors
				if (!properties.correct_errors || FBtype !== 'error_feedback') {
					interactions.push({
						propositions: [{type:'inputEquals',value: 'remove_' + FBtype}],
						actions: [
							{type:'trigger',handle: 'end'}
						]
					});
				}
			}
		} // end FBtype loop
log(interactions)
		return trial;
	};

	return decorator;

});