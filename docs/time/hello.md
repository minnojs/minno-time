# Hello world

We will create a simple task that says "Hello world". As we go, we will comment on several of the player's features and explain some of the ways you can customize your task.

You can follow along and play around with the code right [here](./helloPlay.js).

### The wrapper
miTime's scripts are usually a single JavaScript file. The script is wrapped within a define function (You don't have to understand what it does, but if you are interested look up [requirejs](http://requirejs.org/)).

```javascript
/* The script wrapper */
define(['pipAPI'], function(APIconstructor) {
	var API = new APIconstructor();

	/*
		Your script comes here...
	*/

	return API.script;
});
/* don't forget to close the wrapper */
```

The wrapper creates the `API` object for you. The `API` object is the instrument that we will use to create and run tasks. The whole task is written by creating a bunch of objects and arrays. The API object has functions that accept those objects and arrays and know how to create a task from them. 

### The task structure
Each task is composed of one or more trials, that are activated sequentially. We set trials into the player using a function called [`API.addSequence`](./API.html#add-sequence) that accepts an array of trials as its argument. After adding any trials that you like all that is left is activating the player by calling [`API.play`](API.html#play):

```javascript
define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	API.addSequence([
		/*
			This is where you input all your trials.
			We will see below how to write trials.
		*/
	]);

	return API.script;
});
```

In the following section we will see how to populate the trial sequence. Later, we will see that `API` provides many additional functions that allow us to further customize the player.


### Hello world
Let's populate the sequence with a simple trial. The following trial displays the words "Hello world" at the center of the screen, and ends when you press `space`.

```javascript
{
	input: [
		// What input to accept from the participant (user)
		{handle:'space',on:'space'}
	],
	layout: [
		// What to show throughout the trial.
		{
			media :{word:'Hello world'},
			css:{fontSize:'2em',color:'#D7685A'}
		}
	],
	interactions: [
		// What to do when different events occur.
		{
			conditions: [
				{type:'inputEquals',value:'space'}
			],
			actions: [
				{type:'endTrial'}
			]
		}
	]
}
```

What we see above is a definition of a trial. A trial is a JavaScript object. Inside that object, there are three other objects: `input`, `layout` and `interaction`. Each of these objects defines a different aspect in the trial. Let's learn about these three objects, one by one.

#### **input**

The `input` object is an array of objects that define the input we expect the participant to use. Each object in the`input` array defines one input element (full documentation [here](./API.html#input)).

```javascript
[//Open the array of input objects.
	//An input object that defines what to do when the user hits space.
	{handle:'space', on:'space'} 
]//Close the array
```

Each input object must include the properties `handle` and `on`. The `handle` property defines the name of this input. Other parts of the script can then refer to this input using this name (e.g., check whether the input was activated). The `on` property defines what type of input this object listens to.

In this case, we created an input object that listens to the "space keypressed" event (`on:'space'`), and triggers an event called "space" (`handle:'space'`). We will use the event name in the `interactions` section.

The player supports [many](./API.html#input) types of input. For now, let's learn only about `keypressed`. `keypressed` creates an input listener for simple keyboard interactions. The following code creates a listener for the event of hitting the `'e'` key:

```javascript
[
	{handle:'space', on:'keypressed', key:'e'}
]
```

Note that the event type is now `keypressed` and we added an additional property to the object, `key` which defines what type of keypressed triggers this event. 
Note also that the name that we give the event is absolutely arbitrary, so we can leave the handle as `'space'` and it still works. However, it is generally a good practice to use meaningful names (e.g., `'key_e'`). You can try replacing the old input object with this one, and see what happens. Then try creating an object that responds to the `'i'` key being pressed.

#### **layout**

The `layout` object is responsible for stimuli that are presented during the whole trial. All the stimuli that are set into the `layout` array will be displayed automatically from the beginning of the trial until its end. (We use a different object, named `stimuli` to define stimuli that are displayed only for a part of the trial. We will learn about the `stimuli` object in more advanced examples).

The layout is an array of objects. Each object represents a stimulus. The [stimulus object](./API.html#stimuli) is a complex objects, and we'll learn more about it in more advanced examples. For now, let's start with a simple example:

```javascript
[//This opens an array of stimulus objects to show in the layout.
	{//Each object is a stimulus object.
		media :{word:'Hello world'}, //Media defines what to show
		css:{fontSize:'2em',color:'#FF0000'} //css defines its style.
	}
]
```

This stimulus displays the words "Hello world" at the center of the player's canvas.

Stimulus objects hold a [`media`](./API.html#media) object to display, and relevant data regarding how to display it. This particular stimulus sets the style for the media using the `css` property. [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) is the language used by browsers to describe styles. Using the stimulus `css` property we can control css in any way we want. In this case we use the css object to set the *font size* and *color* of the stimulus.

The font size of this stimulus is set to `2em`. `em` is a css size unit, `1em` is the standard (default) font size, `2em` is twice that size and so on (you can use fractions too: e.g., `1.3em`). So that the text displayed by this stimulus is double the default text size.

The color attribute accepts any valid css color. You can try the following: `'#0000FF'`, `'#FFFFFF'`, `'#00FF00'` or use [this](http://html-color-codes.info/) site to find additional colors.

The `css` object can do far more than this. If you want to know more you can check out the full API  [`here`](http://api.jquery.com/css/#css2)

#### **interactions**

[Interactions](./API.html#interactions) are a grouping of [`conditions`](./API.html#interactions-conditions) (statements of truth) and [`actions`](./API.html#interactions-actions) to perform if (and only if) all conditions are true. We won't really get into interactions here, but these are the basics:

```javascript
[
	{
		conditions: [
			{type:'inputEquals',value:'space'}
		],
		actions: [
			{type:'endTrial'}
		]
	}
]
```

Each interaction object has a `conditions` property and an `actions` property. The `conditions` property is an array of condition objects. Each condition objects defines a condition that can be true of false. For instance, the condition in the example above is that the name (i.e., handle) of currently active input is 'space'. This condition is true only when the participant hits space (that is what we defined in the input section). There are a few other possible conditions that can be defined, and we will learn about them in more advanced examples (to see the full list of conditions, see [here](./API.html#interactions-conditions)).
If all the condition objects in the conditions array are true, then all the actions in the `actions` array are executed. 

The `actions` array holds an array of actions to perform if all `conditions` are evaluated as true. In this case the only action is to end this trial. We will learn about other forms of actions in more advanced examples (to see the full list of conditions, see [here](./API.html#interactions-actions)).

###Detailed recap
Here is the whole code again, with comments that explain each and every line. Before you read those comments, it might be good to look at the simple not-commented code [here](hello.js), and try again to understand what you see. Whenever you have a question about a line in the code, have a look at that line in the heavily commented code below:

```javascript
/* The script wrapper */
define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	//The whole script is inside a function. 
	//The function accepts an API object. 
	//We use the API object to set the task.
	//The function addSequence creates a sequence of trials.
	//That function accepts an array of trials.
	API.addSequence([ //Open the array of trials
	//This array has only one object in it. So, the task will run one trial only.
		{ //This object defines a trial

			//A trial is defined by setting a few properties.

			//The first property in this trial is called input.
			input: [ //The trial's "input" property is an array of input objects.
				//This array has only one object, so it will handle only one input from the users.
				//The input object has a few different properties to define what kind of user input this trial handles.
				{handle:'space',on:'space'}
			], //Close the array of inputs, and continue to the trial's next property.

			//Another property in this is trial is called "layout".
			//layout defines what to show throughout the trial.
			layout: [//The trial's "layout" property is an array of stimulus objects.
				//In our example, the layout array has only one item (object).
				{// This is a stimulus object. It has a few properties.
					//The media property is an object that defines what to show.
					media :{word:'Hello world'},
					//The css property is an object that defines how to show it.
					css:{fontSize:'2em',color:'#D7685A'}
				}
			],//Close the layout array, and continue to the trial's next property.

			//Interactions is an array of if-then scenarios. It defines the flow of the trial (what to do when certain conditions are met).
			interactions: [ //Start the array of interactions.
				// Our array in this example has only one object in it.
				{//This is an interaction object. It has two properties: conditions, and actions.
					//conditions is an array of conditions.
					conditions: [ //Open the array of conditions.
						//Our example has only one condition.
						//The condition: if the input named 'space' was activated (tip: go back to the input property: that's were we defined this event).
						{type:'inputEquals',value:'space'}
					],
					//actions is an array of actions: each action defines something that should be done when the interaction's conditions are true.
					actions: [ //Open the array of actions.
						//There is only one action here: end the trial.
						{type:'endTrial'}
					] //Close the array of actions
				} //Close the interaction object.
			] //Close the array of interactions
		} //Close the trial object.
	]); //Close the array of trials and the addSequence function. use ; to execute the function.

	//In summary, in this trial we showed the text 'Hello World!' with the layout property.
	//We then waited for the user to hit space (we used the input object to define that). 
	//When the user hit space, we ended the trial (this was done with an interaction object).

	// Activate the player. This will play the trial sequence. In our case, it will play a single trial.
	return API.script;
}); //Close the define wrapper.
```

### Epilogue (of sorts)
You've learned how to create a single trial, and the different elements that compose it. The next stage is seeing how different trials come together to form a task.

We will now go on to creating a simple slide-show.
