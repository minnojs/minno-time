// # Race IAT
// **An advanced example of the IAT component**
define(['extensions/iat/component'],function(IAT){

	// ### Properties
	//

	/**
	 * Set Properties
	 * ************************************************************************
	 */

	IAT.setProperties({
		// ##### General settings
		// ----------------------

		// Activate skip block
		DEBUG: true,

		// Set canvas size and properties.
		// Uses the same settings as the PIP [API](/documentation.markdown#canvas).
		canvas: {
			maxWidth: 800,
			proportions : 0.8
		},

		// Image URLS
		images_base_url: '../resources/examples/images/',

		// Image URLS
		templates_base_url: '../../resources/examples/IAT_component_long/',

		// How many trials per logging pulse.
		pulse: 5,

		// Where should we post to.
		post_url: 'my.domain.com/post',

		// After the task where should we redirect
		next_url: '',

		// ##### Default stimulus properties.
		// ----------------------------------

		// These are all optional.
		font: 'Arial',
		fontSize: '3em',
		fontColor: '#253529',

		// A template for all target stimuli
		defaultStimulus: {size:{height:40, width:40}},

		// A template for all instruction stimuli
		instructionsStimulus: {css:{'font-size':'1.3em',color:'#3B444B', lineHeight:1.2}},

		// ##### Interface
		// ---------------

		// Set the user interface to use the left and right arrow keys
		left: 37, // default: 'e'
		right: 39, // default: 'i'

		// Do not allow touch interface
		notouch: true,

		// How long (in miliseconds) before a trial times out.
		timeout: 1000,

		// ##### Task behaviour
		// --------------------

		// Randomly decide which side the concept will be on first (left or right)
		randomize_order: true,

		// Use the short (5 block) version of the IAT
		IATversion: 'short',

		// The interval between each consecutive trials
		inter_trial_interval: 250,

		// The interval after displaying the instructions
		post_instructions_interval: 500,

		// Do we Force the user to correct errors?
		correct_errors: true,

		// ##### Feedback
		// --------------

		// **Error feedback settings**:
		error_feedback : {
			// Activate error feedback
			active: true,
			// Show the word 'Error'
			media: 'Error',
			// Color it red and make it 4em
			css:{color:'red', fontSize: '4em'},
			// Don't hide it until we get another response
			duration: 'static'
		},

		// **Correct feedback settings**:
		correct_feedback : {
			// Activate correct feedback
			active: true,
			// Show the word 'OK'
			media: 'OK',
			// Color it green and make it 4em
			css:{color:'green',fontSize:'4em'},
			// Display it for 300 miliseconds before ending the trial
			duration: 300
		},

		// **Timeout feedback settings**:
		timeout_feedback : {
			// Activate timeout feedback
			active: true,
			// Show the word 'Timout'
			media: 'TimeOut',
			// Color it blue and make it 4em
			css:{color:'blue',fontSize:'4em'},
			// Display it for 300 miliseconds before ending the trial
			duration: 300
		},

		// ##### Layout
		// ------------
		// Use the advance layout for the player. This allows us more flexibility displaying the category labels.
		simpleLayout:false,

		// category seperator
		separator: {
			// Use the word or as a seperator
			media: 'and',
			// This property controls the height of the separator in percent of the canvas.
			// Play with it in order to change the location of the second category label.
			height:4,
			// This property controls the distance of the label from the canvas border.
			margin: 6,
			// Set separator css
			css : {color:'#3B444B',fontSize:'1.2em'}
		}
	});


	// ### Categories
	// --------------

	/**
	 * Set Categories
	 * ************************************************************************
	 */

	// ##### Concept 1
	// ---------------
	IAT.setCategory('concept1',{
		// The category name (used for logging)
		name: 'White people',
		// A media object responsible for the category label
		title: 'White people',
		// A CSS object responsible for the title style
		titleCss: {color:'#31b404',fontSize:'1.2em'},
		// Controls the titles margin from the canvas border
		margin:1,

		// The media for this category
		media: [
			{image: 'wf2_nc.jpg'},
			{image: 'wf3_nc.jpg'},
			{image: 'wf6_nc.jpg'},
			{image: 'wm1_nc.jpg'}
		]
	});

	// ##### Concept 2
	// ---------------
	IAT.setCategory('concept2',{
		name: 'Black People',
		title: 'Black People',
		titleCss: {color:'#31b404',fontSize:'1.2em'},
		media: [
			{image: 'bf14_nc.jpg'},
			{image: 'bf23_nc.jpg'},
			{image: 'bf56_nc.jpg'},
			{image: 'bm14_nc.jpg'}
		]
	});

	// ##### Attribute 1
	// -----------------
	IAT.setCategory('attribute1',{
		name: 'Good words',
		// Note that title can take any media object
		title: {image:'thumbs_up.png'},
		// The height of this label, so that any subsequent labels can be placed appropriately
		height: 20,
		// Offset from the borders, so that the category labels are centered
		margin: 2,
		// A css object to control how the targets looks (in this case - red)
		css:{color:'red',fontSize:'2em'},
		media: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Splendid'},
			{word: 'Love'}
		]
	});

	// ##### Attribute 2
	// -----------------
	IAT.setCategory('attribute2',{
		name: 'Bad words',
		// Note that title can take any media object
		title: {image:'thumbs_down.png'},
		// The height of this label, so that any subsequent labels can be placed appropriately
		height: 20,
		// Offset from the borders, so that the category labels are centered
		margin: 2,
		// A css object to control how the targets looks (in this case - green)
		css:{color:'green',fontSize:'2em'},
		media: [
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'}
		]
	});


	// ### Instructions
	// ----------------

	/**
	 * Create Instructions
	 * ************************************************************************
	 * usage: IAT.setInstructions(block_number, properties)
	 */

	// Set the instructions for block number 1. </br>
	// `setInstructions()` first argument is the block to target, the second is a settings object.
	IAT.setInstructions(1, {
		// By default we use a custom template, if you want to create your own templates either use inline templates (like in this example),
		// or set the `templates_base_url` property and create templates of your own naming them inst1.jst through inst7.jst.
		// `template` here can take any media object (a plain string like in this example is treated as an [inlineTemplate](/documentation.markdown#media))
		template: '<div>' +
				'<p align="center"><u>Part <%= trialData.part%> of 5</u></p>' +
				'<br/>' +
				'Put a left finger on the <b>left arrow</b> key for <font color="<%= trialData.concept1Color || "#0000FF" %>"><%= trialData.concept1 %></font> images.<br/>' +
				'Put a right finger on the <b>right arrow</b> key for <font color="<%= trialData.concept2Color || "#0000FF" %>"><%= trialData.concept2 %></font> images.<br/>' +
				'Items will appear one at a time.<br/><br/>' +
				'If you make a mistake, a red <font color="#ff0000"><b>X</b></font> will appear. Press the other key to continue. <u>Go as fast as you can</u> while being accurate.<br/><br/>' +
				'You have 1 second to make a response, otherwise you will get a <font color="blue"><b>TIMEOUT</b></font> message<br/><br/>' +
				'<p align="center">Press the <b>space bar</b> to begin.</p>' +
			'</div>',
		// set custom css for the instruction stimulus
		css: {fontSize:'1.2em',color:'#3B444B'}
	});

	IAT.play();
});
