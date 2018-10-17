// Now that we have a few of the basic building blocks of the player available to us,
// lets start putting together a real task.

// We will create a task that demonstrates the stroop effect:
// When the name of a color (e.g. "blue", "green," or "red") is printed in a color not denoted by the name (e.g., the word "red" printed in blue instead of red),
// naming the color of the word takes longer and is more prone to errors than when the color of the ink matches the name of the color.
// The effect is named after John Ridley Stroop who first published the effect in English in 1935.

// There is no scripted way that you are supposed to create a task, but we will break down the task in one way that we've found useful.


define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	// ### Setup
	// The player has many many [settings](./API.html#settings) that you can tinker with, we will use only one here.

	// In order to set the default text size you can use the `canvas` [setting](./API.html#canvas) like so:

	API.addSettings('canvas',{
		textSize: 5
	});

	// `textSize` controls the default font size in the canvas.
	// It takes a single number that represents font size in percentage of the canvas height (similar to the CSS3 `vh` unit).
	// From now on any time we use a relative fontSize (read: every time we use `em` for fontSize), it will be relative to this size.

	// ### Stimuli
	// Lets start with the thing that we already know how to do.

	// We'll create lists of the stimuli we are going to use.
	// We have three groups of stimuli; **red**, **blue** and **green**.
	// We will create a separate set of stimuli for each of these groups.
	// These sets will allow us to randomize and extend them later on.

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

	// All the stimuli in each set have the same color, each stimulus in the set has a distinct name.

	// Note also that we use the shortcut to plain text media (simply settings a string),
	// and not the full fledged media object (that would look like this: `{word:'Red'}`).
	// You can of course use any type of [media](./API.md#media) here.

// ### Layout
// We will start by composing the stroop trial.

// In the stroop task we sort words by their colors.
// First things first, lets add labels to the task canvas so that it is clear what the user is sorting the stimuli to.
// We'll add three labels, one for each of the colors we are using.

// By default stimuli are displayed at the center of the screen, if we want to display them at other locations,
// we use the `location` property of the [stimulus object](./API.md#stimuli).
// The location property takes an object with distances from the border in percentages of the player canvas.
// Where `left:20` means that the left border of the stimulus should be 20% from the left of the canvas.
// You may define any of the `left`/`right`/`top`/`bottom` properties.
// In this case we'll define the labels to be two percent of the canvas away from the borders just so they don't collide.

// We use the `css` property to control the style of the labels.
// We set the `background` color to the appropriate color and the `fontSize` of the labels to be 1.5 times of the default fontSize.
// The `padding` property is used to set the size of the labels background (more about padding [here](https://developer.mozilla.org/en-US/docs/Web/CSS/box_model)).

	API.addSequence([
		{
			layout: [
				{
					media:'1',
					location:{left:2,top:2},
					css:{background:'red',padding:'2%',fontSize:'1.5em'}
				},
				{
					media:'2',
					location:{top:2},
					css:{background:'blue',padding:'2%',fontSize:'1.5em'}
				},
				{
					media:'3',
					location:{right:2,top:2},
					css:{background:'green',padding:'2%',fontSize:'1.5em'}
				},
				{inherit:'red'}
			],
			input: [],
			interactions: []
		}
	]);

	// #### Return the script
	return API.script;
});
/* don't forget to close the define wrapper */
