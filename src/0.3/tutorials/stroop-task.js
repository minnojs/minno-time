// We've been slowly pulling the stroop task together, now is the time for a few last touches, just to get the feel for how things work.

define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	API.addSettings('canvas',{
		textSize: 5
	});

	API.addStimulusSets('red',[
		{media:'Red', css:{color:'red'}},
		{media:'Blue', css:{color:'red'}},
		{media:'Green', css:{color:'red'}}
	]);

	API.addStimulusSets('blue',[
		{media:'Red', css:{color:'blue'}},
		{media:'Blue', css:{color:'blue'}},
		{media:'Green', css:{color:'blue'}}
	]);

	API.addStimulusSets('green',[
		{media:'Red', css:{color:'green'}},
		{media:'Blue', css:{color:'green'}},
		{media:'Green', css:{color:'green'}}
	]);

	API.addStimulusSets('error',[
		{handle:'error',media:'X', css:{fontSize:'2em',color:'#FF0000'}, location:{top:70}}
	]);

	API.addTrialSets('base',[{
		input: [
			{handle:'red',on:'keypressed',key:'1'},
			{handle:'blue',on:'keypressed',key:'2'},
			{handle:'green',on:'keypressed',key:'3'}
		],
		layout: [
			{media:'1',location:{left:2,top:2},css:{background:'red',padding:'2%',fontSize:'1.5em'}},
			{media:'2',location:{top:2},css:{background:'blue',padding:'2%',fontSize:'1.5em'}},
			{media:'3',location:{right:2,top:2},css:{background:'green',padding:'2%',fontSize:'1.5em'}}
		],
		interactions: [
			/* Display the target stimulus. */
			{
				conditions:[{type:'begin'}],
				actions: [{type:'showStim', handle: 'target'}]
			},

			// ### Error feedback
			// Lets add error feedback to our task.

			// Above, we created the error stimulus. This creates a stimulus that displays a red X at the bottom of the screen.

			// Now that we have the error stimulus in place we can add the instruction how to display it.
			// On incorrect responses we will display the error feedback, and trigger the end of the trial only after another 250 miliseconds.

			/* Correct response actions */
			{
				conditions: [
					{type:'inputEqualsTrial',property:'group'}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:1}},
					{type:'log'},
					{type:'trigger', handle:'ITI'}
				]
			},

			/* Incorrect response actions */
			{
				conditions: [
					{type:'inputEqualsTrial',property:'group',negate:true},
					{type:'inputEquals',value:['red','blue','green']}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:0}},
					{type:'log'},
					{type:'showStim', handle:'error'},
					{type:'removeInput',handle:['red','blue','green']},
					{type:'trigger', handle:'ITI', duration:500}
				]
			},

			// There are several changes done here to achieve this task.

			// First, all the end trial actions have move into an interaction of their own (see below), that is activated when `ITI` is triggered.
			// Second, the correct response now triggers the ITI immediately.
			// Third, The incorrect response first displays the error feedback (`showStim`) and only after 500 milliseconds triggers the ITI.

			// You should also note that the `hideStim` action within the ITI interaction uses the handle `'All'`. When you want to refer to all the stimuli in a trial you can use the handle `'All'` and all stimuli will be affected.

			// ### Inter trial interval
			// We add an inter trial interval (ITI).
			// The way we are going to do this is by adding a set interval to the end of each trial.
			// Instead of directly calling the `endTrial` action, we will trigger a timeout, and end the trial from it.
			// While waiting for the trial to end we want to prevent users from responding again.
			// Note that we only need to do this to the *base* trial, all other trials inherit everything from it...

			/* Inter trial interval */
			{
				conditions: [{type:'inputEquals', value:'ITI'}],
				actions:[
					{type:'hideStim',handle:'All'},
					{type:'removeInput',handle:['red','blue','green']},
					{type:'trigger', handle:'end',duration:500}
				]
			},

			// We've added three actions to each of the responses.
			// `hideStim` hides the target stimulus so that we see a blank screen as soon as a response is made.
			// `removeInput` removes the input listeners that have the handles *red*, *blue* and *green*, this prevents users from giving any further responses.
			// `trigger` triggers an internal player event as if the user has committed an action.
			// In this case, it triggers an event with the input handle `end` after a `duration` of 500 milliseconds.

			// Furthermore, we've added an interaction that responds to the `end` event, that ends the trial.
			// Note that the users can not trigger the `end` event directly, only through the events that were exposed to them using the `keypressed` input.

			/* End trial */
			{
				conditions: [{type:'inputEquals', value:'end'}],
				actions:[
					{type:'endTrial'}
				]
			}


		]
	}]);

	// Finaly, we need to add it to each of the specific color trials.
	// We can't add it to the *base* trial because the specific color trials make changes to `stimuli` and would overwrite it.

	API.addTrialSets('red',[{
		inherit:'base',
		data: {group:'red'},
		stimuli: [
			{inherit:{set:'red',type:'exRandom'}, handle:'target'},
			{inherit:'error'}
		]
	}]);

	API.addTrialSets('blue',[{
		inherit:'base',
		data: {group:'blue'},
		stimuli: [
			{inherit:{set:'blue',type:'exRandom'}, handle:'target'},
			{inherit:'error'}
		]
	}]);

	API.addTrialSets('green',[{
		inherit:'base',
		data: {group:'green'},
		stimuli: [
			{inherit:{set:'green',type:'exRandom'}, handle:'target'},
			{inherit:'error'}
		]
	}]);

	// ### Sequence

	API.addSequence([
		{
			mixer: 'random',
			data: [
				{
					mixer: 'repeat',
					times: 20,
					data: [
						{inherit:'red'},
						{inherit:'blue'},
						{inherit:'green'}
					]
				}
			]
		}
	]);

	// Return script
	return API.script;
});