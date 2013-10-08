define(['../properties','./input_decorator','./feedback_decorator'],function(properties,input_decorator,feedback_decorator){
	var trial = {
		// by default each trial is correct, this is modified in case of an error
		data: {score:0},
		input: [],
		layout: [
			{inherit:{type:'byData',set:'layout',data:'left'}},
			{inherit:{type:'byData',set:'layout',data:'right'}}
		],
		interactions: [
			// begin trial : display stimulus imidiately
			{
				propositions: [{type:'begin'}],
				actions: [{type:'showStim',handle:'target'}]
			},

			// correct
			{
				propositions: [{type:'stimEquals',value:'side',handle:'target'}],				// check if the input handle is equal to the "side" attribute of stimulus.data
				actions: [
					{type:'removeInput',handle:['left','right']},
					{type:'log'},																// log this trial
					{type:'trigger',handle:'correct_feedback'}									// trigger the correct feedback (and maybe endtrial)
				]
			},

			// error
			{
				propositions: [
					{type:'stimEquals',value:'side',handle:'target',negate:true},				// check if the input handle is unequal to the "side" attribute of stimulus.data
					{type:'inputEquals',value:['right','left']}									// make sure this is a click interaction
				],
				actions: [
					{type:'trigger',handle:'error_feedback'},									// trigger the error feedback (and maybe endtrial)
					{type:'setTrialAttr', setter:{score:1}}										// set the score to 1
				]
			},

			// end after ITI
			{
				propositions: [{type:'inputEquals',value:'end'}],
				actions: [
					{type:'hideStim',handle:'All'},
					{type:'setInput',input:{handle:'endTrial', on:'timeout', duration:properties.inter_trial_interval || 0}}
				]
			},

			{
				propositions: [{type:'inputEquals',value:'endTrial'}],
				actions: [
					{type:'endTrial'}
				]
			},

			// skip block
			{
				propositions: [{type:'inputEquals',value:'enter'}],
				actions: [
					{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
					{type:'endTrial'}
				]
			}
		],
		stimuli: []
	};

	// adds feedback specific interactions
	feedback_decorator(trial);

	// adds input
	input_decorator(trial);

	return trial;

});