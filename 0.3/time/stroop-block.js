// We've created the building blocks of our task, the *congruent* and *incongruent* trials, now it is time to put them together into a task.
// The tool that controls the structure and flow of the task is called the [mixer](./API.md#mixer).
// It allows you to duplicate and randomize trials within the sequence.

// The way it works, is that you insert a mixer object inside the sequence and the player replaces it with the appropriate set of trials.
// Each mixer object has a `mixer` property that holds the type of mixing that we want (more about that later),
// and a `data` property that holds an array of trials and/or mixer objects to mix.
// We will use two mixer types here: `repeat` and `random`.

// ### Randomizing the sequence
// We already know how to easily create a sequence of trials; simply drop the trials we want into the sequence. But what if we want each user to run into a different sequence? How do we tell the player to randomize the order? We will use the mixer to randomize the trial order:

// ```javascript
// API.addSequence([
// 	{
// 		mixer: 'random',
// 		data: [
// 			{inherit:'red'},
// 			{inherit:'red'},
// 			{inherit:'blue'},
// 			{inherit:'blue'},
// 			{inherit:'green'},
// 			{inherit:'green'}
// 		]
// 	}
// ]);
// ```

// You will notice that this sequence has only one object, that has two properties; `mixer` and `data`. All the trials per se are set inside the `data` attribute. This mixer object takes all the elements inside the `data` property and randomizes their order. The player then sets the trials into the sequence instead of the mixer object. So that the result of the previous code may be equivalent to this:

// ```javascript
// API.addSequence([
// 	{inherit:'red'},
// 	{inherit:'green'},
// 	{inherit:'blue'},
// 	{inherit:'green'},
// 	{inherit:'red'},
// 	{inherit:'blue'}
// ]);
// ```

// ### Expanding the sequence
// Sometimes we want to repeat a trial (or trials) more than once. In our case, for example, each time you run a trial it displays a different stimulus, so it is useful to display each trial several times. This is the purpose of the `repeat` mixer. The `times` property sets the number of times that the data should be replicated. The following mixer repeats `data` three times:

// ```javascript
// API.addSequence([
// 	{
// 		mixer: 'repeat',
// 		times: 2,
// 		data: [
// 			{inherit:'red'},
// 			{inherit:'blue'},
// 			{inherit:'green'}
// 		]
// 	}
// ]);
// ```

// So that it is directly equivalent to

// ```javascript
// API.addSequence([
// 	{inherit:'red'},
// 	{inherit:'blue'},
// 	{inherit:'green'},
// 	{inherit:'red'},
// 	{inherit:'blue'},
// 	{inherit:'green'}
// ]);
// ```

// ### Exclusive random
// An additional issue that comes up is the order of stimuli do be presented.
// We used the mixer to randomize the order of trials, but the stimuli themselves are randomized when they are inherited from their respective stimulus sets.
// By default inheritance picks a random element out of the target set.
// But this way there is a chance that we pick the same element twice in a row, or not pick one of the elements at all.
// The player offers [additional types](./API.md#inheriting) of inheritance as well, in this case we will want to use `exRandom` which stands for exclusive random.
// Exclusive random makes sure to exclude each element that it picks out of the set,
// so that as long that their are element in the set that have not already been chosen it will pick from among them and not an element that has already been used.

// So far we have inherited the stimuli like this:

// ```javascript
// API.addTrialSets('red',[{
// 	inherit:'base',
// 	data: {group:'red'},
// 	stimuli: [
// 		{inherit:'red', handle:'target'}
// 	]
// }]);
// ```

// In order to use `exRandom`, all we have to do is this:

// ```javascript
// API.addTrialSets('red',[{
// 	inherit:'base',
// 	data: {group:'red'},
// 	stimuli: [
// 		{inherit:{set:'red',type:'exRandom'}, handle:'target'}
// 	]
// }]);
// ```

// Instead of setting `inherit` with the set name, and inheriting randomly we set inherit an object that has two properties; `type` sets the type of inheritance to use (in this case `exRandom`), `set` defines which set should we inherit from.

// ### The script itself
define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor('stroop');


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

	// ### Advanced inheritance
	// Here, we put `exRandom` into use.

	API.addTrialSets('red',[{
		inherit:'base',
		data: {group:'red'},
		stimuli: [
			{inherit:{set:'red',type:'exRandom'}, handle:'target'}
		]
	}]);

	API.addTrialSets('blue',[{
		inherit:'base',
		data: {group:'blue'},
		stimuli: [
			{inherit:{set:'blue',type:'exRandom'}, handle:'target'}
		]
	}]);

	API.addTrialSets('green',[{
		inherit:'base',
		data: {group:'green'},
		stimuli: [
			{inherit:{set:'green',type:'exRandom'}, handle:'target'}
		]
	}]);

	// ### Using the mixer
	// You can put mixers one inside the other in order to get richer combinations.
	// For our Stroop task, we want to repeat each trial 10 times and then randomize their order.
	// The mixer evaluates internal mixers before external ones, so we want the inner mixer to repeat our trials ten times,
	// and only then the external mixer will do the randomization.

	API.addSequence([
		/* random mixer */
		{
			mixer: 'random',
			data: [
				/* repeat mixer */
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

	// Return the script
	return API.script;
});