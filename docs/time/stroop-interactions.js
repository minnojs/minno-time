// So far we created the very general way that the task looks.
// The next step is to create interactions that will make the player interactive.
// We will first set up the `input` and `stimuli` properties of the trial and then dig into `interactions`.

// We will keep extending the trial we started in the setup section.
// For now we will develop the *red* stimulus trial, later on we will show how to apply it to the other trials as well.

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

	API.addSequence([
		{
			layout: [
				{media:'1',location:{left:2,top:2},css:{background:'red',padding:'2%',fontSize:'1.5em'}},
				{media:'2',location:{top:2},css:{background:'blue',padding:'2%',fontSize:'1.5em'}},
				{media:'3',location:{right:2,top:2},css:{background:'green',padding:'2%',fontSize:'1.5em'}}
			],

			// ### Input
			// First we want to tell the player to listen for user input.
			// The player has an internal event system that triggers each time a significant event happens.
			// We need listeners that trigger internal events each time that an appropriate key is pressed.
			// We will add a separate input listener for each color. They will use the `1`, `2` and `3` keys for red blue and green respectively.
			// These listeners are sensitive to `keypressed` events, you can change them to any of the [other types of events](./API.md#input) of course.

			// Listeners are objects that are composed of (at least) two properties; `handle` and `on`.
			// The `on` property defines what type of input we are going to listen to; in this case we listen for `keypressed` events, of specifically `e` or `i`.
			// The `handle` properties defines the name of the internal event to be triggered.
			// In this case we trigger the *red* event when `1` is pressed, the *blue* event when `2` is pressed and so on.

			input: [
				{handle:'red',on:'keypressed',key:'1'},
				{handle:'blue',on:'keypressed',key:'2'},
				{handle:'green',on:'keypressed',key:'3'}
			],

			// **Protip**: You can use key codes instead of letters, that way you can use special keys like the left (37) and right (38) arrow keys
			// (see [here](http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) for a full list of key codes).

			// ### Stimuli
			// The stimuli in the `layout` property are static; this means that interactions do not affect them.
			// If we want stimuli to be interactive we put them into a separate array called `stimuli`.
			// The advantage of this separation is that you never have to worry that you're going to break the canvas layout when creating interactions.

			// We will very simply move the target stimulus into the `stimuli` property:

			stimuli:[
				{inherit:'red', handle:'target'}
			],

			// Note that we extend every stimulus we inherit with the (arbitrary) handle `'target'`,
			// this is necessary so that the various actions in `interactions` can know which stimulus we are referring to.

			// ### Interactions
			// The `interaction` property controls all the interactive parts of the trial.
			// This is where you will have to carefully describe exactly what you want the player to *do*.
			// We will start with an extremely simple set of interactions and slowly build up to a full fledged trial.

			// `interactions` holds an array of interaction-objects.
			// Each of these objects has two properties: `conditions` and `actions`.
			// `conditions` are a set of propositions that have to all be true in order for respective set of `actions` to be executed. Each of them consists in an array of objects.
			// You can see the [API](./API.md#interactions) for a complete list of conditions and actions.

			// The condition system is based on an internal event system.
			// Each time a significant event happens (i.e. a [user input](#input) is detected, or a timer runs out) an event is fired internally.
			// The conditions compare different data to the event handle (we will see how this works shortly).
			// Each condition has a `type` property that defines what to compare the event handle to.

			// We will start with several basic interactions:

			// Stimuli set into `stimuli` are hidden by default.

			// The first interaction we deal with displays the target stimulus as soon as the trial starts.
			// `begin` is a special event that is fired only once; when a trial starts. In order to listen to it we use the condition object `{type:'begin'}`.
			// In this case, the associated action is `showStim`; this action tells the player to display the a stimulus that has the handle `'target'`
			// (you can recall that we extended the target stimulus with the handle `'target'`).]

			// Stimuli set into `stimuli` are hidden by default.
			// The first interaction we deal with displays the target stimulus as soon as the trial starts.
			// `begin` is a special event that is fired only once; when a trial starts. In order to listen to it we use the condition object `{type:'begin'}`.
			// In this case, the associated action is `showStim`; this action tells the player to display the a stimulus that has the handle `'target'`
			// (you can recall that we extended the target stimulus with the handle `'target'`).]

			interactions: [
				{
					conditions:[{type:'begin'}],
					actions: [{type:'showStim', handle: 'target'}]
				},

				// Next we will add interactions that deal with the response to the user interaction:

				// First we will create the interaction for correct response.
				// The `inputEquals` condition fires when the input handle (as [set](#input) in the input object) is equal to the value in the `value` property.
				// So in our trial the following action will activate once the `1` key is pressed. It activates three [actions](./API.md#interactions-actions).

				// * The `log` action logs the user response, including latency and other information about the trial.
				// * The `endTrial` action simply ends this trail and moves on to the next one.
				// * Each trial has a built in data object that can be preset when you create the trial (simply add a `data` property to the trial) and is saved each time you `log`. The `setTrialAttr` action merges the `setter` object into the trial data, adding any properties of the `setter` to the trials data object. In this case we set the trial with the score 1 that will signify for us a correct response.

				{
					conditions: [
						{type:'inputEquals',value:'red'}
					],
					actions: [
						{type:'setTrialAttr', setter:{score:1}},
						{type:'log'},
						{type:'endTrial'}
					]
				},

				// Now, lets create the interaction for incorrect responses.
				// This interaction is similar to the previous one, with two key differences.
				// First, it fires only for non *red* responses. Second, the score set is `0` which for us signifies an error.

				{
					conditions: [
						{type:'inputEquals',value:'red', negate:true},
						{type:'inputEquals', value: ['red','blue','green']}
					],
					actions: [
						{type:'setTrialAttr', setter:{score:0}},
						{type:'log'},
						{type:'endTrial'}
					]
				}

				// The change is to the incorrect response condition bears some more explanation.
				// The first condition here is straight forward, it is the same as the correct answer condition, with the added `negate` property.
				// `negate` causes the condition to activate only if it is incorrect. The second condition is needed in order to balance the first one.
				// `negate` will cause the condition to activate on **any** event that is not *red*, this includes the `begin` event, and any other event that we may add later on.
				// Therefore it is best practice to always limit negated conditions to specific input handles.
				// In this case the condition means: any event that is a user response ("red" , "blue" or "green") but is not *red*.
			]
		}
	]); // end sequence

	// #### Activate the player
	return API.script;
});

// ### Epilogue (of sorts)
// We've created a single congruent trial for a Stroop task.
// The next natural step is to copy this trial and change every place where it refers to a congruent task into incongruent and presto! we have two trials ready for action.
// You can do that, and it would definately work, but there are several disadvantages to this approach.
// First, every change you want to make to the trial, you will have to make to every copy of the trial that you have.
// Second, in this simple use case we have only two types of trials, what happens if you have four types? or eight? or ten?

// The solution that the player offers for this problem is using inheritance, and we will get into it in the [next](./stroop-inheritanceDocco.html) section.