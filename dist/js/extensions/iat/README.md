# IAT component
The IAT component allows you to create IATs quickly, using the PI player (PIP). The language is similar to the one used by PIP, so if you already know PIP, it should be a flash to learn.

### The structure of your script
You wrap your IATcomponent code with a define wrapper:

```js
define(['extensions/iat/component'],function(IAT){

});
```

Inside the wrapper there are four parts:
1. Defining your categories
2. Setting the IAT properties.
3. Editing instructions.
4. Activating the player.

### Defining categories
The IAT needs four categories: two concepts and two attributes.
Defining a category is done by passing a category object to the `IAT.setCategory` function.

```js
IAT.setCategory('concept1',{
	name: 'white',
	title: 'White people',
	css: {color:'green'},
	stimulus: {location:{right:20}}
	// the media objects that are part of this category
	media: [
		{image: 'wf2_nc.jpg'},
		{image: 'wf3_nc.jpg'},
		{image: 'wf6_nc.jpg'},
		{image: 'wm1_nc.jpg'}
	]
});
```

The first argument to `IAT.setCategory` is the category type. There are four types: `concept1`, `concept2`, `attribute1` and `attribute2`. All four must be defined for the IAT to work. The example above defined `concept1`.

The second argument to `IAT.setCategory` is the category object. The object contains all the properties of the category. All the properties are optional except for the media array (although you should really define at least `name` and `title`).

`name`: The category name to be passed to the server (recorded in the data object).

`title`: The category description to be displayed to the users (defaults to the values set in `name`). See more about this property in **category layout**.

`css`: Is a jQuery css object that is applied to the category media.

`stimulus`: Allows you to modify the properties of the category stimuli (see the PIP [documentation](/documentation.markdown) for more details).

####Category Layout
When you define the categories, you have two methods to define how to display the titles of the categories at the top of the screen.
The layout method is defined using the `simpleLayout` property, by default `simpleLayout` is set to `true`.

The simpleLayout scheme is simple to use, but it supports only text as the category label (title).

```js
IAT.setCategory('concept1',{
	name: 'white',
	title: 'White people',
	titleColor: 'green',
	titleSize: '2em',
	media: [
		{image: 'wf2_nc.jpg'},
		{image: 'wf3_nc.jpg'},
		{image: 'wf6_nc.jpg'},
		{image: 'wm1_nc.jpg'}
	]
});
```

If you use the **simpleLayout** then these are the settings you can use:
* `title`: The category description to be displayed to the users, it must be text or a [PIP 'word' object](/documentation.markdown#media).
* `titleColor`: Sets the color of the title text.
* `titleSize`: Sets the font-size of the title.

If you are using templates, or if you want to modify the layout, when using simpleLayout, make sure you copy the file [layout.jst](jst/layout.jst) into your template folder. After that, open that file and see whether you want to modify anything.
If you use simpleLayout then you can't use the `separator` property in order to change anything about the separator (it will always say "or", and will have a pre-defined color and font-size).

The **advanced layout** uses standard PIP [media objects](/documentation.markdown#media) as titles for the categories. This means that you have more control over the type of title (e.g., it can an image), and its other properties (e.g., location). You can activate the **advanced layout** by setting the `simpleLayout` property to `false`.

```js
IAT.setCategory('concept1', {
    name: 'white',
	title: 'White people',
	titleCss: {color:'green'},
	height: 5,
	margin: 3,
	media: [
		{image: 'wf1.jpg'},
		{image: 'wf2.jpg'},
		{image: 'wm1.jpg'},
		{image: 'wm2.jpg'}
	]
});
```

If you use the **advanced layout** these are the settings you can use:
* `title`: The category description to be displayed to the users, it can be any valid PIP [media object](/documentation.markdown#media).
* `titleCss`: Is a jQuery css objects that is applied to the category title.
* `height`: In case that your category titles are not simply text you might need to tweak their location by defining appropriate heights.
* `margin`: In case you want to center the categories around a common center instead of aligning them to the outer borders.

### Setting properties
The properties object allows you to control many of the IAT parameters. All the properties are optional (although you should really set `post_url` if you want your data to be saved). We use `IAT.setProperties` in order to set properties.

```js
IAT.setProperties({
	post_url: 'my.domain.com/postPage',
	correct_errors: false
});
```

Another example: (You can set any number of properties using this object)

```js
IAT.setProperties({
	post_url: 'my.domain.com/postPage',
	correct_errors: false,
	font: 'Arial',
	fontSize: '2em',
	fontColor: 'green',
	defaultStimulus: {},
	instructionsStimulus: {css:{'font-size':'1.3em',color:'black', lineHeight:1.2,'text-align':'left',margin:'25px'}},
	simpleLayout: true,
	randomize_order:true
});
```

**Settings**

`IATversion`: Use a 7-block or 5-block IAT. Accepts 'long'\'short' (default:'long').

`randomize_order`: Set whether to counterbalance the experiment by randomly switching blocks 1/5 and blocks 3,4/5,6. Accepts true/false (default:true).

`trialsPerBlock`: Set the number of trials per block. Accepts a hash of block number:trial count. For example: `{1:40,5:40}`, sets block 1 and 5 to have 40 trials. By default, the long IAT's number of trials are: `{1:20,2:20,3:20,4:40,5:40,6:20,7:40}` and the short IAT's numbers are `{1:20,2:20,3:50,4:30,5:50}`.

**URLs**

`post_url`: Defines the url to send any data gathered by the IAT.

`pulse`: The IAT sends the trial data to the server in chunks (i.e., every few trials). Here you set the chunk's size. That is, you set how many trials the player waits before sending another chunk of data (default: 20).

`images_base_url`: The base url for the image files.

`templates_base_url`: The base url for the template files (default: "extensions/iat/jst").

`redirect_url`: Where to redirect when we finish the task. Takes a url or a function to run at the end of the task.

**Debug**

`DEBUG`: Set to true in order to activate the skip block feature (skip block when you click ENTER). By default this is set to false.

**Stimulus properties** (modifiers for the target stimuli)

`font`: Stimulus font (default: Arial).

`fontSize`: Font size (default: 2em).

`fontColor`: Font Color (default: green).

`defaultStimulus`: Default stimulus for all categories. This should be written in [PIP's code](/documentation.markdown#stimuli).

`instructionsStimulus`: Default stimulus for all instructions (default: {css:{'font-size':'1.3em',color:'white', lineHeight:1.2}}).

`canvas`: Canvas size and shape, uses the same [settings object]](/documentation.markdown#canvas) as the PIP.

`background`: The background color for the whole player (if you want to differentiate between canvas background and the surrounding use the `canvas` property)

**Interface**

`left`: The key for the left categories. Accepts a single character or an array of characters. (default:'e')

`right`: The key for the right categories. Accepts a single character or an array of characters. (default:'i')

`leftTouch`: An element to display for the left category in touch displays (default:PIP default touch interface)

`rightTouch`: An element to display for the right category in touch displays (default:PIP default touch interface)

`notouch`: Do not detect touch devices. Accepts true/false (default:false). This is useful for cases we attach a keyboard to touch devices.

**Timing**

`timeout`: If you want to use a response deadline in the trial, this is the duration in milliseconds. (default: 0 - no timeout)

`inter_trial_interval`: The duration (in ms) between the time the IAT hides the target stimulus and before displaying the next target stimulus (default: 500).

`post_instructions_interval`: The duration (in ms) after the instructions are hidden and before the first target stimulus is displayed (default: 500).

**Layout**

`simpleLayout`: Which layout interface should the player use (see "Category Layout" above for details). Accept true for simpleLayout or false for advanced (default:true).

`separatorColor`: Controls the color of the title separator. It is used only in the simple layout scheme (default: 'black').

`separator`: The separator object allows you to control the appearance of the category title separator. It is used only in the advanced layout scheme. By default:

```js
{
	media: 'or',
	height: 5,
	margin: 0,
	css: {fontSize:'1.2em'}
}
```
Properties of the separator object:
* `media`: Any [media object](/documentation.markdown#media) to be used as the separator.
* `height`: You should define the height so that the player knows where to place the second stimulus.
* `margin`: In case you want to center the categories around a common center instead of aligning them to the outer borders.
* `css`: A jQuery css object that modifies the separator stimulus.

**Feedback**

`correct_errors`: Do we wait for the user to correct error responses? Accepts true/false (default: true).

You can set three feedback objects: error_feedback, correct_feedback, and timeout_feedback. Each defines what to do upon a specific event in the trial - a correct response, an error or a timeout. These three objects accepts the same parameters:

```js
{
	active: true,
	media: 'X',
	css:{color:'red'},
	duration: 300
}
```
Properties of the feedback object:
* `active`: Whether to display this feedback at all. Accepts true/false.
* `media`: What to display upon feedback. Accepts a PIP [media object](/documentation.markdown#media).
* `css`: A jQuery css object that modifies the feedback stimulus.
* `duration`: How long to display this feedback before moving on. If you set duration to `static` then the feedback is not hidden until the end of the trial (i.e., until correct response). This is the default for the error_feedback object because we wait until correction.

`correct_feedback`: Feedback after a correct response. Accepts feedback object (default: not active, displays green OK).

`error_feedback`: Feedback after an error.  Accepts feedback object (default: active, displays a red X).

`timeout_feedback`: Feedback after a timeout.  Accepts feedback object (default: active, displays a red X).

### Editing instructions.
The IAT comes with built-in templates that create the appropriate instructions for each block. You can change them if you like using the `IAT.setInstuctions` function.

```js
IAT.setInstructions(1, {
	media: 'Go ahead, sort everything correctly',
	css: {fontSize:'1.3em',color:'white'}
});
```

The first argument (parameter) to the `IAT.setInstructions` function is the block number. You may modify the instructions for any of the seven blocks (simply call the function for each block you want to modify).

The second argument to `IAT.setCategory` is the instructions object.

`media`: Controls the content of the instruction block. It accepts a regular PIP [media object](/documentation.markdown#media).

`css`: Controls the CSS for the instruction block. Accepts a jQuery CSS object.

`extend`: Extends the instructions trial. Accepts an object to extend the trial with (this is an advanced feature, it can be used to attach a scorer or all sorts of hooks)

### The PI component
The IAT component is an extension of the basic IAT component.
It shares all capabilities of the basic IAT component with the default urls used on PI, added functionality of the dscore extension.
In order to activate the component use the following wrapper:

```js
define(['extensions/iat/PIcomponent'],function(IAT){

});
```

In order to tweak the settings of the scorer you can use the following properties:

`scorerObj`: Holds the same object that is normally used to setup the scorer (everything has defaults, of course).

`scorerMessage`: Holds an array of message objects, the same one normally set into messageDef when setting up the scorer.

To read more about the scorer see [here](/src/js/extensions/dscore/README.md)

### More...
This IAT component is an extension of PIP, so you can use any of PIP's settings or functionality with the IAT.
For example, you can add any meta data to your post using the IAT `addSettings` API:

```js
IAT.addSettings('metaData',{
    session_id: 9872356,
    task_id: '43BTW78'
});
```

Alternatively, you can add a custom trial to the end of the sequence using `addSequence`:

```js
IAT.addSequence([
	{
		input: [{handle:'end', on:'space'}],
		layout:[{media:{word:'Just a plain trial that will be added at the end of the sequence'}}],
		interactions: [
			{
				conditions: [{type:'inputEquals',value:'end'}],
				actions: [{type:'endTrial'}]
			}
		]
	}
]);
```