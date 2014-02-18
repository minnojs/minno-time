## Stroop <small>Setup</small>

Now that we have a few of the basic building blocks of the player available to us, lets start putting together a real task.

We will create a task that demonstrates the stroop effect: When the name of a color (e.g. "blue", "green," or "red") is printed in a color not denoted by the name (e.g., the word "red" printed in blue instead of red), naming the color of the word takes longer and is more prone to errors than when the color of the ink matches the name of the color. The effect is named after John Ridley Stroop who first published the effect in English in 1935.

There is no scripted way that you are supposed to create a task, but we will break down the task in one way that we've found useful.

### Setup
The player has many many [settings](./API.md#settings) that you can tinker with, we will use only one here.

In order to set the default text size you can use the `canvas` [setting](./API.md#canvas) like so:

```js
API.addSettings('canvas',{
	textSize: 5
});

```

`textSize` controls the default font size in the canvas. It takes a single number that represents font size in percentage of the canvas height (similar to the CSS3 `vh` unit). From now on any time we use a relative fontSize (read: everytime we use `em` for fontSize), it will be relative to this size.

### Stimuli
Lets start with the thing that we already know how to do.

We'll create lists of the stimuli we are going to use. We have two groups of stimuli; **congruent** (words that say what color they are in), and **incongruent** (words that say a different color). We will create a separate set of stimuli for each of these groups. This will allow us to randomize and extend them later on.

```js
API.addStimulusSets('congruent',[
	{media:'Red', css:{color:'#FF0000'}},
	{media:'Pink', css:{color:'#FFC0CB'}},
	{media:'Orange', css:{color:'#FFA500'}},
	{media:'Yellow', css:{color:'#FFFF00'}},
	{media:'Purple', css:{color:'#800080'}},
	{media:'Green', css:{color:'#008000'}},
	{media:'Blue', css:{color:'#0000FF'}},
	{media:'Brown', css:{color:'#8B4513'}},
	{media:'White', css:{color:'#FFFFFF'}},
	{media:'Grey', css:{color:'#A9A9A9'}}
]);

API.addStimulusSets('incongruent',[
	{media:'Red', css:{color:'#008000'}}, // Green
	{media:'Pink', css:{color:'#0000FF'}}, // Blue
	{media:'Orange', css:{color:'#8B4513'}},  // Brown
	{media:'Yellow', css:{color:'#FFFFFF'}}, // White
	{media:'Purple', css:{color:'#A9A9A9'}}, // Grey
	{media:'Green', css:{color:'#FF0000'}}, // Red
	{media:'Blue', css:{color:'#FFC0CB'}}, // Pink
	{media:'Brown', css:{color:'#FFA500'}}, // Orange
	{media:'White', css:{color:'#FFFF00'}}, // Yellow
	{media:'Grey', css:{color:'#800080'}} // Purple
]);
```

The congruent words have the correct colors applied to them. You can see the true color of the incongruent words in the comments.

Note also that we use the short cut to plain text media (simply settings a string), and not the full fledged media object (that would look like this: `{word:'Red'}`). You can of course use any type of [media](./API.md#media) here.

### Layout
In the stroop task we sort words into two groups: congruent and incongruent. First things first, lets add labels to the task canvas so that it is clear where the user is sorting the stimuli to. We'll add a two labels one to each of the upper corners of the canvas.

By default stimuli are displayed at the center of the screen, if we want to display them at other locations, we use the `location` property of the [stimulus object](./API.md#stimuli). The location property takes an object with ditances from the border in precentages of the player canvase. Where `left:20` means that the left border of the stimulus should be 20% from the left of the canvas. You may define any of the `left`/`right`/`top`/`bottom` properties. In this case we'll define the labels to be one percent of the canvas away from the borders just so they don't colide.

We also set the font color to white and the size of the labels to be 1.5 times of the default fontSize.

```js
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
		},
		{inherit:'congruent'}
	]
}
```

For now, the target stimulus (the word with the color) is static, so we set it in `layout`. Setting the inherit property to a string name (like `'congruent'` as opposed to an [inherit object](./API.md#inheriting)) tells the player to randomly pick a stimulus from the target set. In this case we inherit a random stimulus out of the `congruent` stimulus set.

**Protip**: You can use key codes instead of letters, that way you can use the left (37) and right (38) arrow keys instead of `e` and `i`.

### Your turn!
You can see this task in action right [here](#{player}../resources/tutorials/js/stroop-setup.js), download it and tinker from [here](../../resources/tutorials/js/stroop-setup.js). Try refreshing the page to see the target stimulus change.

Try moving the labels so that they are located at the top and bottom of the canvas instead of at the corners.