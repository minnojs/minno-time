## Stroop <small>Task</small>
We've been slowly pulling the stroop task together, now is the time for a few last touches, just to get the feel for how things work.

### Inter trial interval
First we'll add an inter trial interval (ITI). The way we are going to do this is by adding a set interval to the end of each trial. Instead of directly calling the `endTrial` action, we will trigger a timeout, and end the trial from it. While waiting for the trial to end we want to prevent users from responding again. Note that we only need to do this to the *base* trial, all other trials inherit everything from it...


```js
{
	interactions: [
		// Display the target stimulus.
		{
			propositions:[{type:'begin'}],
			actions: [{type:'showStim', handle: 'target'}]
		},
		// Correct response actions
		{
			propositions: [
				{type:'trialEquals',value:'group'}
			],
			actions: [
				{type:'setTrialAttr', setter:{score:1}},
				{type:'log'},
				{type:'hideStim',handle:'target'},
				{type:'removeInput',handle:['congruent','incongruent']},
				{type:'trigger', handle:'end',duration:500}
			]
		},
		// Incorrect response actions
		{
			propositions: [
				{type:'trialEquals',value:'group',negate:true},
				{type:'inputEquals',value:['congruent','incongruent']}
			],
			actions: [
				{type:'setTrialAttr', setter:{score:0}},
				{type:'log'},
				{type:'hideStim',handle:'target'},
				{type:'removeInput',handle:['congruent','incongruent']},
				{type:'trigger', handle:'end',duration:500},
			]
		},
		// End trial
		{
			propositions: [{type:'inputEquals', value:'end'}],
			actions:[{type:'endTrial'}]
		}
	]
}
```


We've added three actions to each of the responses. `hideStim` hides the target stimulus so that we see a blank screen as soon as a response is made. `removeInput` removes the two input listeners that have the handles *congruent* and *incongruent*, this prevents users from giving any further responses. `trigger` triggers an internal player event as if the user has commited an action. In this case, it triggers an event with the input handle `end` after a `duration` of 500 miliseconds.

Furthermore, we've added an interaction that responds to the `end` event, that ends the trial. Note that the users can not trigger the `end` event directly, only through the events that were exposed to them using the `keypressed` input.

### Error feedback
Lets push this paradigm a bit forward and add error feedback to our task.

First we'll create the error stimulus. This creates a stimulus that displays a red X at the bottom of the screen.

```js
API.addStimulusSets('error',[
	{handle:'error',media:'X', css:{fontSize:'2em',color:'#FF0000'}, location:{top:70}}
]);
```

Next, we need to add it to each of the *congruent* and *incongruent* trials. We can't add it to the *base* trial because the specific trials make changes to `stimuli` and would overwrite it.

```js
API.addTrialSets('congruent',[{
	inherit:'base',
	data: {group:'congruent'},
	stimuli: [
		{inherit:{type:'exRandom', set:'congruent'}, handle:'target'},
		{inherit:'error'}
	]
}]);
```
Now that we have the error stimulus in place we can add the instruction how to display it. On incorrect responses we will display the error feedback, and trigger the ITI only after another 250 miliseconds.

```js
{
	interactions: [
		// Display the target stimulus.
		{
			propositions:[{type:'begin'}],
			actions: [{type:'showStim', handle: 'target'}]
		},
		// Correct response actions
		{
			propositions: [
				{type:'trialEquals',value:'group'}
			],
			actions: [
				{type:'setTrialAttr', setter:{score:1}},
				{type:'log'},
				{type:'trigger', handle:'ITI'}
			]
		},
		// Incorrect response actions
		{
			propositions: [
				{type:'trialEquals',value:'group',negate:true},
				{type:'inputEquals',value:['congruent','incongruent']}
			],
			actions: [
				{type:'setTrialAttr', setter:{score:0}},
				{type:'log'},
				{type:'showStim', handle:'error'},
				{type:'removeInput',handle:['congruent','incongruent']},
				{type:'trigger', handle:'ITI', duration:500}
			]
		},
		// Inter trial interval
		{
			propositions: [{type:'inputEquals', value:'ITI'}],
			actions:[
				{type:'hideStim',handle:'All'},
				{type:'removeInput',handle:['congruent','incongruent']},
				{type:'trigger', handle:'end',duration:500}
			]
		},
		// End trial
		{
			propositions: [{type:'inputEquals', value:'end'}],
			actions:[
				{type:'endTrial'}
			]
		}
	]
}
```

There are several changes done here to achieve this task.

First, all the ITI actions have move into an interaction of their own, that is activated when `ITI` is triggered.
Second, the correct response now triggers the ITI imidiately.
Third, The incorrect resonse first displays the error feedback (`showStim`) and only after 500 miliseconds trigers the ITI.

You should also note that the `hideStim` action within the ITI interaction uses the handle `'All'`. When you want to refer to all the stimuli in a trial you can use the handle `'All'` and all stimuli will be affected.

You can download the code [here](../../resources/tutorials/js/stroop-task.js). You can see it in action right [here](#{player}../resources/tutorials/js/stroop-task.js).