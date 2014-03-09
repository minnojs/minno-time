## Hello world
This section of the tutorial will walk you through creating your first task. We will create a simple task that says "Hello world". As we go, we will comment on several of the players features and explain some of the ways you can customize your player.

You can download the whole task [here](../../resources/tutorials/js/hello.js). You can see it in action right [here](#{player}../resources/tutorials/js/hello.js).

### The wrapper
Every PI player script is wrapped within a define function (You don't have to understand what it does, but if you are interested look up [requirejs](http://requirejs.org/)).

```js
/* The script wrapper */
define(['app/API'], function(API) {

	/*
		Your script comes here...
	*/

});
/* don't forget to close the wrapper */
```

The wrapper creates the `API` object for you. The `API` object is the instrument that we will use to create and run tasks.

### The task structure
Each task is composed of one or more trials, that are activated sequentially. We set trials into the player using a function called [`API.addSequence`](./API.md#add-sequence) that accepts an array of trials as its argument. After adding any trials that you like all that is left is activating the player by calling [`API.play`](API.md#play):

```js
define(['app/API'], function(API) {
	API.addSequence([
		/*
			This is where you input all your trials.
			We will see how to do it in just a moment.
		*/
	]);

	API.play();
});
```

In the following section we will start to see how to populate the trial sequence, later on we will see that `API` exposes many additional functions that allow us to further customize the player.


### Hello world
Let's populate the sequence with a simple trial. The following trial displays the words "Hello world" at the center of the screen, and ends when you press `space`.

```js
{
	input: [
		// This is an input object
		{handle:'space',on:'space'}
	],
	layout: [
		// This is a stimulus object
		{
			media :{word:'Hello world'},
			css:{fontSize:'2em',color:'#D7685A'}
		}
	],
	interactions: [
		// This is an interaction object (it has a condition and an action)
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

Let's see what we've got here. The trial uses three keywords `input`, `layout` and `interaction`. Each one of them holds an array with one object. We will now go through each of these sections and explain how they work.

#### **input**

The `input` keyword defines the input we expect the participant to use, it holds an array of input objects. Full documentation can be found [here](./API.md#input).

```json
[
	{handle:'space', on:'space'}
]
```

Each input object must include both a `handle` and an `on` property. The `handle` property defines the name of this  input. Other parts of the script can then refer to this input using this name (e.g., check whether the input was activated). The `on` property defines what type of input this object listens to.

In this case, we created a input object that listens to the "space keypressed" event (`on:'space'`), and triggers an event called "space" (`handle:'space'`). We will use the event name later on in the `interactions` section.

The player supports [many](./API.md#input) types of input, at this stage we will only review `keypressed`. `keypressed` creates an input listener for simple keyboard interactions, for our purpose we will learn how to listen to a specific keypress. The following code creates a listener for the `'e'` key being pressed:

```js
[
	{handle:'space', on:'keypressed', key:'e'}
]
```

Note that the event type is now `keypressed` and we added an additional property to the object, `key` which defines what type of keypressed triggers this event. Note that the name that we give the event is absolutely arbitrary, so we can leave the handle as `'space'` and everything keeps working. However, it is generally a good practice to use meaningful names (e.g., `'key_e'`). You can try replacing the old input object with this one, and see what happens. Then try creating an object that responds to the `'i'` key being pressed.

#### **layout**

The `layout` keyword is responsible for the static stimuli in the trial. Any stimuli that are set into the `layout` array will be displayed automatically at the beginning of the trial.

[Stimuli](./API.md#stimuli) are complex objects, and we'll get more deeply into them, but for now this will suffice:

```js
[
	{
		media :{word:'Hello world'},
		css:{fontSize:'2em',color:'#FF0000'}
	}
]
```

This stimulus displays the words "Hello world" at the center of the player canvas.

Stimulus objects hold a [`media`](./API.md#media) object to display, and relevant data regarding how to display it. This particular stimulus sets the style for the media using the `css` property. [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) is the language used by browsers to describe styles on the web. Using the stimulus `css` property we can control css in any way we want. In this case we use the css object to set the *font size* and *color* of the stimulus.

The font size of this stimulus is set to `2em`. `em` is a css size unit, `1em` is the standard font size, `2em` is twice that size and so on (you can use fractions too). So that the text displayed by this stimulus is double the default text size.

The color attribute takes any valid css color. You can try the following: `'#0000FF'`, `'#FFFFFF'`, `'#00FF00'` or use [this](http://html-color-codes.info/) site to find additional colors.

The `css` object can do  far more than this. If you want to know more you can check out the full API on [<jquery class="com"></jquery>](http://api.jquery.com/css/#css2)

#### **interactions**

[Interactions](./API.md#interactions) are a grouping of [`conditions`](./API.md#interactions-conditions) (statements of truth) and [`actions`](./API.md#interactions-actions) to perform if (and only if) all conditions are true. We won't really get into interactions here, but these are the basics:

```js
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

Each interaction object has a `conditions` property that holds an array of true/false statements. Each one of these statements is evaluated for every player event (i.e. user input), if all the conditions are true for an event then all associated `actions` are executed. In this case we check if the input handle equals 'space'.

Each interaction object also has an `actions` array that hold an array of actions to perform if all `conditions` are evaluated as true. In this case the only action is to end this trial.

### Epilogue (of sorts)
You've learned how to create a single trial, and the different elements that compose it. The next stage is seeing how different trials come together to form a task.

We will now go on to creating a simple slide-show.
