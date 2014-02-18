## Stroop <small>Interactions</small>
So far we created the very general way that the task looks. The next step is to create interactions that will make the player interactive. We will first set up the `input` and `stimuli` properties of the trial and then dig into `interactions`.

We will keep extending the trial we started in the setup section. For now we will develope the *congruent* stimulus trial, later on we will show how to apply it to the *incongruent* trials as well.

### Input
First we want to tell the player to listen for user input. The player has an internal event system that triggers each time a significant event happens. We need listeners that trigger internal events each time that an appropriate key is pressed. We will add a separate input listener for left (congruent) and right (incongruent) responses. They will use the `e` and `i` keys for left and right respectively. These listeners are sensitive to `keypressed` events, you can use any of the [other types of events](./API.md#input) of course.

Listeners are objects that are composed of (at least) two properties; `handle` and `on`. The `on` property defines what type of input we are going to listen to; in this case we listen for `keypressed` events, of specifically `e` or `i`. The `handle` properties defines the name of the internal event to be triggered. In this case we trigger the *congruent* event when `e` is pressed, and the *incongruent* event when `i` is pressed.

```js
{
	input: [
		{handle:'congruent',on:'keypressed',key:'e'},
		{handle:'incongruent',on:'keypressed',key:'i'}
	]
}
```

### Stimuli
The stimuli in the `layout` property are static; this means that interactions do not affect them. If we want stimuli to be interactive we put them into a separate array called `stimuli`. The advantage of this separation is that you never have to worry that you're going to brake the canvas layout when creating interactions.

We will very simply move the target stimulus into the `stimuli` property:

```js
{
	stimuli: [
		{inherit:'congruent', handle:'target'}
	]
}
```

Note that we extend every stimulus we inherit with the (arbitrary) handle `'target'`, this is neccesary so that the various actions in `interactions` can know which stimulus we are refering to.

### Interactions
The `interaction` property controls all the interactive parts of the trial. This is where you will have to carefuly describe exatcly what you want the player to *do*. We will start with an extremely simple set of interactions and slowly build up to a full fledged trial.

`interactions` holds an array of interaction-objects. Each of these objects has two properties: `propositions` and `actions`. `propositions` are a set of conditions that have to all be true in order for respective set of `actions` to be executed. Each of them consists in an array of objects. You can see the [API](./API.md#interactions) for a complete list of propositions and actions.

The proposition system is based on an internal event system. Each time a significan event happens (i.e. a [user input](#input) is detected, or a timer runs out) an event is fired internaly. The propositions compare different data to the event handle (we will see how this works shortly). Each proposition has a `type` property that defines what to compare the event handle to.

We will start with several basic interactions:

Stimuli set into `stimuli` are hidden by default. The first interaction we deal with displays the target stimulus as soon as the trial starts. `begin` is a special event that is fired only once; when a trial starts. In order to listen to it we use the proposition object `{type:'begin'}`. In this case, the associated action is `showStim`; this action tells the player to display the a stimulus that has the handle `'target'` (you can recall that we extended the target stimulus with the handle `'target'`).]

```js
{
	propositions:[
		{type:'begin'}
	],
	actions: [
		{type:'showStim', handle: 'target'}
	]
}
```
Next we will add interactions that deal with the response to the user interaction:

First we will create the interaction for correct responses. The `inputEquals` proposition fires when the input handle (as [set](#input) in the input object) is equal to the value in the `value` property. So in our trial the following action will activate once the `e` key is pressed. It activates three [actions](./API.md#interactions-actions).

* The `log` action logs the user response, including latency and other information about the trial.
* The `endTrial` action simply ends this trail and moves on to the next one.
* Each trial has a built in data object that can be preset when you create the trial (simply add a `data` property to the trial) and is saved each time you `log`. The `setTrialAttr` action merges the `setter` object into the trial data, adding any properties of the `setter` to the trials data object. In this case we set the trial with the score 1 that will signify for us a correct response.

```js
{
	propositions: [
		{type:'inputEquals',value:'congruent'}
	],
	actions: [
		{type:'setTrialAttr', setter:{score:1}},
		{type:'log'},
		{type:'endTrial'}
	]
}
```

Now, lets create the interaction for incorrect responses. This interaction is almost identical to the previous one, with two key differences. First, it fires for *incongruent* stimuli. Second, the score set is `0` which for us signifies an error.

```js
{
	propositions: [
		{type:'inputEquals',value:'incongruent'}
	],
	actions: [
		{type:'setTrialAttr', setter:{score:0}},
		{type:'log'},
		{type:'endTrial'}
	]
}
```

### All together now
So when we put the whole thing together it looks like this:

```js
API.addSequence([
	{
		layout: [
			{
				media:'Congruent',
				location:{left:1,top:1},
				css:{color:'white',fontSize:'1.5em'}
			},
			{
				media:'Incongruent',
				location:{right:1,top:1},
				css:{color:'white',fontSize:'1.5em'}
			}
		],
		input: [
			{handle:'congruent',on:'keypressed',key:'e'},
			{handle:'incongruent',on:'keypressed',key:'i'}
		],
		stimuli:[
			{inherit:'congruent', handle:'target'}
		],
		interactions: [
			// Display the target stimulus.
			{
				propositions:[{type:'begin'}],
				actions: [{type:'showStim', handle: 'target'}]
			},
			// Correct response actions
			{
				propositions: [
					{type:'inputEquals',value:'congruent'}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:1}},
					{type:'log'},
					{type:'endTrial'}
				]
			},
			// Incorrect response actions
			{
				propositions: [
					{type:'inputEquals',value:'incongruent'}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:0}},
					{type:'log'},
					{type:'endTrial'}
				]
			}
		]
	}
]);
```

You can download it [here](../../resources/tutorials/js/stroop-interactions.js). You can see it in action right [here](#{player}../resources/tutorials/js/stroop-interactions.js).

### Epilogue (of sorts)
We've created a single congruent trial for a Stroop task. The next natural step is to copy this trial and change every place where it refers to a congruent task into incongruent and presto! we have two trials ready for action. You can do that, and it would definately work, but there are several disadvantages to this approach. First, every change you want to make to the trial, you will have to make to every copy of the trial that you have. Second, in this simple use case we have only two types of trials, what happens if you have four types? or eight? or ten?

The solution that the player offers for this problem is using inheritance, and we will get into it in the [next](./stroop-inheritance.html) section.