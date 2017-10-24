// This section of the tutorial deals with using the inheritance features of the player in order to keep complex tasks as simple as possible.

// ### Data
// Before we dive into the actual practice of inheritance, it is important to understand the function and use of the trial's `data` property.
// The `data` property holds an object that keeps information that has to do with this trial.
// Remember that all the properties and values of `data` are arbitrary, and you can use them in any way that is convenient to you.

// It is useful for several things.
// First, every time you [log](./API.md#interactions-actions) an event to the server, anything that is in you data object gets logged along with it.
// This means that if you want to mark the type of a trial it is convenient to do it from here, and then you will have access to it from you servers database.
// In this case we will set our trials *group* using the data object:

// ```javascript
// {
// 	data:{group:'congruent'}
// }
// ```

// Furthermore, the data object may be used by player interactions.
// The condition `inputEqualsTrial` compares the input handle to a specified property of the trial's data object.
// This means that we can create interactions that behave a bit differently as a function of trial type as defined in the data object.
// The following interaction fires when the input handle is equal to the *group* property of the data object:

// ```javascript
// {
// 	conditions: [
// 		{type:'inputEqualsTrial',property:'group'}
// 	],
// 	actions: [
// 		/* Some cool stuff of you own design */
// 	]
// }
// ```

// Finally, interactions may change the data object in real time, while the trial is running.
// `setTrialAttr` sets data into the data object. The following interaction sets the *score* property of the data object to *1*
// (go [here](./API.md#interactions-actions) to learn more about the `setTrialAttr` action).

// ```javascript
// {
// 	conditions: [
// 		/* The conditions of your choice */
// 	],
// 	actions: [
// 		{type:'setTrialAttr', setter:{score:1}}
// 	]
// }
// ```

define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor('stroop');


	API.addSettings('canvas',{
		textSize: 5
	});

	// ### Evolving the stroop trial (stimuli)
	// The stroop has several types of trials: one for each color.
	// What we want to do is to create a base trial that has all the properties that they have in common and then evolve them from it.

	// There are three essential differences between stroop trials.
	// One is the stimulus set that they use, the second is the way they evaluate responses (which response is correct),
	// the third is the type of the trial as reported to the server.
	// What we will do is create separate trials that hold these differences and inherit the base trial that has the rest of the trial specifications.

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

	// ### Evolving the stroop trial (trials)

	// We create a base trial that will be the base for anything further that we do.

	// The primary change that we made is in evaluating the correct response.
	// `inputEqualsTrial` compares the input handle to the (trial's) data property *group*.
	// If they are the same then the answer is correct. The incorrect response answer reflects the same principle, only negated.


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
			/* Correct response actions */
			{
				conditions: [
					{type:'inputEqualsTrial',property:'group'}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:1}},
					{type:'log'},
					{type:'endTrial'}
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
					{type:'endTrial'}
				]
			}
		]
	}]);

	// We've created three trials here, one for each of the trial types (colors), and set them into `trialSets` so they can later be inherited themselves.
	// Note that we haven't made any changes to the interactions.
	// We will change the interactions in the base trial so that they depend on the trial type (as set in data *group*).

	API.addTrialSets('red',[{
		inherit:'base',
		data: {group:'red'},
		stimuli: [
			{inherit:'red', handle:'target'}
		]
	}]);

	API.addTrialSets('blue',[{
		inherit:'base',
		data: {group:'blue'},
		stimuli: [
			{inherit:'blue', handle:'target'}
		]
	}]);

	API.addTrialSets('green',[{
		inherit:'base',
		data: {group:'green'},
		stimuli: [
			{inherit:'green', handle:'target'}
		]
	}]);

	// ### Epilogue (of sorts)
	// What we have left now, is to put the task together. Here we display a congruent and incongruent trial consequently.

	API.addSequence([
		{inherit:'red'},
		{inherit:'blue'},
		{inherit:'green'}
	]);

	// We can go ahead now, and create our tasks manually by inserting trials at any order that we want, but that would be static and hard to maintain.
	// In the [next](./stroop-blockDocco.html) section we will learn how to use the sequence mixer in order to randomize and organize our task blocks.
	// In addition we will dabble a bit further into the use of inheritance for randomization.

	// Return the script object
	return API.script;
});