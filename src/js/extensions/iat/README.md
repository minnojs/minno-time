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
IAT.setCategory('concept1', {
    name: 'white',				// The category name to be passed to the server (recorded in the data)
	title: 'White people',			// The category description to be displayed to the users.
	titleCss: {color:'green'},		// CSS modifier for this categories media
	height: 5, 				// The height of the category title.
	margin: 3,				// The horizontal margin to add to the title.
	css: {color:'green'},			// CSS modifier for all media in this category
	stimulus: {location:{right:20}}	// A stimulus modifier for media in this category

	// the media objects that are part of this category
	media: [
		{image: 'wf1.jpg'},
		{image: 'wf2.jpg'},
		{image: 'wm1.jpg'},
		{image: 'wm2.jpg'}
	]
});
```

The first argument to `IAT.setCategory` is the category type. There are four types: `concept1`, `concept2`, `attribute1` and `attribute2`. All four must be defined for the IAT to work. The example above defined `concept1`.

The second argument to `IAT.setCategory` is the category object. The object contains all the properties of the category. All the properties are optional except for the media array (although you should really define at least `name` and `title`).

`css`: Is a jQuery css object that is applied to the category media.

`stimulus`: Allows you to modify the properties of the category stimuli (see the PIP documentation for more details).

####Category Layout
When you define the categories, you have two methods to define how to display the titles of the categories at the top of the screen. 

By default the IATcomponent uses the simpleLayout scheme. The simpleLayout is simple to use, but it supports only text as the category label (title). 

If you use the **simpleLayout** then these are the settings you can use:
* `title`: The category description to be displayed to the users, it must be text or a PIP 'word' object.
* `titleColor`: Sets the color of the title text.
* `titleSize`: Sets the font-size of the title.

When using simpleLayout, make sure you copy the file layout.jst (ADD LINK) into your template folder. If you want to modify the IAT layout even further you can copy layout.jst and modify it in your folder. If you use simpleLayout then you can use the `separator` property in order to change anything about the separator (it will always say "or", and will have a pre-defined color and font-size). 

The **classic layout** uses standard PIP media objects as titles for the categories. That means that you have more control over the type of title (e.g., it can an image), and its other properties (e.g., location). 
If you use the **classic layout** these are the settings you can use:
* `title`: The category description to be displayed to the users, it can be any valid PIP media object.
* `titleCss`: Is a jQuery css objects that is applied to the category title.
* `height`: In case that your category titles do not have the standard height you might need to tweak their location by defining appropriate heights.
* `margin`: In case you want to center the categories around a common center instead of aligning them to the outer borders.

### Setting properties
The properties object allows you to control the ways that the IAT behaves. All the properties are optional (although you should realy set `post_url` if you want your data... to be saved). We use `IAT.setProperties` in order to set properties.

```js
IAT.setProperties({
	post_url: 'my.domain.com/postPage',
	correct_errors: false
});
```

**Settings**

`IATversion`: Should we use the 7 or 5 block long IAT. Takes 'long'\'short' (default:'long').

`randomize_order`: Should we counter balance the experiment by randomly switching blocks 1/5 and blocks 34/56? Takes true/false (default:true).

`trialsPerBlock`: Modify the number of trials per block. Takes a hash of block number:trial count. For example: `{1:40,5:40}`, sets block 1 and 5 to have 40 trials. By default, the long IAT has 20 trials for the first two blocks, and 40 trial for the last five. The short IAT has 20 trials for the first two blocks, 50 trials for the third and fifth, and 30 trials for the fourth.

**URLs**

`post_url`: Defines the url to send any data gathered by the IAT.

`pulse`: The size of the post pulses (default: 20).

`images_base_url`: The base url for the images we use.

`templates_base_url`: The base url for the templates we use (default: "extensions/iat/jst").

`redirect_url`: Where to redirect when we finish the task. Takes a url or a function to run at the end of the task.

**Debug**

`DEBUG`: Set to true in order to activate the skip block feature (skip block when you click ENTER). By default this is set to false.

**Stimulus properties** (modifiers for the target stimuli)

`font`: Stimulus font (default: Arial).

`fontSize`: Font size (default: 2em).

`fontColor`: Font Color (default: green).

`defaultStimulus`: Default stimulus for all categories.

`instructionsStimulus`: Default stimulus for all instructions (default: {css:{'font-size':'1.3em',color:'white', lineHeight:1.2}}).

`canvas`: Canvas size and shape, uses the same settings object as the PIP.

**Interface**

`left`: The key for the left categories. Takes a single character or an array of characters. (default:e)

`right`: The key for the right categories. Takes a single character or an array of characters. (default:i)

`leftTouch`: An element to display for the left category in touch displays (default:PIP default element)

`rightTouch`: An element to display for the right category in touch displays (default:PIP default element)

`notouch`: Do not detect touch devices. Takes true/false (default:false). This is usefull for cases we attach a keyboard to touch devices.

**Timing**

`timeout`: The duration in miliseconds before we declare a timeout. (default: 0 - no timeout)

`inter_trial_interval`: The duration after removing the target stimulus before moving to the next trial (default: 500).

`post_instructions_interval`: The duration after the instructions before moving on to the first trial (default: 500).

**Layout**

`simpleLayout`: Which layout interface should the player use (see "Defining categories" for details). Takes true for simpleLayout or false for classical (default:true).

`separator`: The separator object allows you to control the appearance of the category title separator. By default it is simply 'or'.

```js
{
	media: 'or',
	height: 5,
	margin: 0,
	css: {fontSize:'1.2em'}
}
```

* `media`: Any media object to be used as the separator.
* `height`: You should define the height so that the player knows where to place the second stimulus.
* `margin`: In case you want to center the categories around a common center instead of aligning them to the outer borders.
* `css`: A jQuery css object that modifies the separator stimulus.

**Feedback**

There are three feedback objects each describing the feedback to a specific event - a correct response, an error or a timeout. The syntax for these three objects is similar and we will expand on them only once. This is how such an object looks:

```js
{
	active: true,
	media: 'X',
	css:{color:'red'},
	duration: 300
}
```

* `active`: Wether to display this feedback at all. Takes true/false.
* `media`: What to display upon feedback. Takes a PIP media object.
* `css`: A jQuery css object that modifies the feedback stimulus.
* `duration`: How long to display this feedback before moving on. The error object has a special value `static` that causes the feedback not to be hidden after a duration.

`correct_feedback`: Feedback after a correct response. Takes feedback object (default: not active, displays green OK).

`error_feedback`: Feedback after an error.  Takes feedback object (default: active, displays red X).

`timeout_feedback`: Feedback after a timeout.  Takes feedback object (default: active, displays red X).

`correct_errors`: Do we make the user go back on errors? Takes true/false (default: true).

### Editing instructions.
The IAT comes with build in templates that create the appropriate instructions for each block. You can easily change them if you like using the `IAT.setInstuctions` function.

```js
IAT.setInstructions(1, {
	media: 'Go ahead, sort everything correctly',
	css: {fontSize:'1.3em',color:'white'}
});
```

The first argument to `IAT.setInstructions` is the block number. You may modify the instructions for any of the seven blocks (simply call the function for each block you want to modify).

The second argument to `IAT.setCategory` is the instructions object.

`media`: Controls the content of the instruction block. It takes a regular PIP media object.

`css`: Controls the CSS for the instruction block. Takes a jQuery CSS object.

`extend`: Extends the instructions trial. Takes an object to extend the trial with (this is an advanced feature, it can be used to attach a scorer or all sorts of hooks)

### The PI component
The PIP component is an extension of the basic IAT component.
It shares all capabilities of the basic IAT component with the added functionality of the dscore extension.
In order to activate the component use the following wrapper:

```js
define(['extensions/iat/PIcomponent'],function(IAT){

});
```

In order to tweak the settings of the scorer you can use the following properties:

`scorerObj`: Holds the same object that is normaly used to setup the scorer (everything has defaults of course).

`scorerMessage`: Holds an array of message objects, the same one normaly set into messageDef when setting up the scorer.

### More...
This IAT component is an extension of PIP, so you can use any of PIP's settings or functionality with the IAT. For example...
