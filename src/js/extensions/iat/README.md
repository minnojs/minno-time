# IAT component
The IAT component is here to allow you to use the powefull features that come with the PIP to create simple and quick IAT tasks. The component uses similar features to the PIP, so if you already know it, it should be a flash to learn.

### The structure of your script
Similarly to the PIP you should wrap your IATcomponent scripts with a define wrapper:

```js
define(['./IATcomponent'],function(IAT){

});
```

Inside the wrapper there are four parts:
1. Defining your categories
2. Setting the IAT properties.
3. Editing instructions.
4. Activating the player.

There the IAT object has a function deditcated to each of these parts, and we will explain each of them in the following sections.
It is notable that the IAT is an extension of the PIP and so you can use any of the PIPs settings or functionality with the IAT.

### Defining categories
The IAT requires you to define four categories; two concepts and two attributes.
Defining a category is done by passing a category object to the `IAT.setCategory` function.

```js
IAT.setCategory('concept1', {
	name: 'white',					// The category name to be passed to the server
	title: 'White people',			// The category description to be displayed to the users.
	titleCss: {color:'green'},		// CSS modifier for this categories media
	height: 5, 						// The height of the category title.
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

The first argument to `IAT.setCategory` is the category name. There are four categories: `concept1`, `concept2`, `attribute1` and `attribute2`. All the categories must be defined for the IAT to work. In the example above we define `concept1`.

The second argument to `IAT.setCategory` is the category object. All the properties of the object are optional except for the media array (although you should realy define at least `name` and `title`).
* The `title` property is the category description to be displayed to the users, it can be any valid PIP media object.
* `titleCss` and `css` are jQuery css objects, and are applied to the title and the category media respectively.
* In case that your category titles do not have the standard height you might need to tweek their location by defining appropriate heights.
* The `stimulus` property allows you to modify the category stimuli (see the PIP documentation for more details).

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
* `css`: a jQuery css object that modifies the feedback stimulus.
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
