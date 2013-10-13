/* sglobal $ */
define(['./IATcomponent'],function(IAT){
	/**
	 * Set Properties
	 * ************************************************************************
	 */

	// the only truly required properties are the post_url and next_url
	// the rest of the things should have defaults
	IAT.setProperties({
		// activate skip block
		DEBUG: true,

		// Default stimulus properties
		// All optional
		font: 'Arial',
		fontSize: '4em',
		fontColor: 'green',
		//defaultStimulus: {size:{height:40, width:40}},
		instructionStimulus: {css:{'font-size':'1.3em',color:'white', lineHeight:1.2}},

		// optional of course, the same settings as the main API
		canvas: {
			maxWidth: 800,
			proportions : 0.8
		},

		// Interface.
		left: 'e', // default: e
		right: 'i', // default: i
		//leftTouch: '<div>left</div>', // default: system
		//rightTouch: $('<div>',{text:'right'}), // default: system
		notouch: false, // default: false

		timeout: 4500, // default: 0 - no timeout
		timeout_value: '', // how to treat timeouts, default: '' always error.

		// behaviour
		// The duration after you removed the target stimulus but you still wait before moving to the next trial.
		inter_trial_interval: 500,
		post_instruction_interval: 500,

		// do we make the user go back on errors? default: true
		correct_errors: false,

		error_feedback : {
			active: true, // default: true
			media: 'X', // default: X
			//css:{color:'red'}, // optional
			duration: 300 // default?
		},

		correct_feedback : {
			active: true, // default: false
			media: 'OK', // default: V
			//css:{color:'green'}, // optional
			duration: 300 // default?
		},

		timeout_feedback : {
			active: true, // default: false
			media: 'TimeOut', // default: X
			css:{color:'blue',fontSize:'4em'}, // optional
			duration: 300 // default?
		},

		// category seperator
		separator: {
			media: 'or', // default: 'or'
			height:9,
			css : {fontSize:'2em'} // optional
		},

		// URLS
		images_base_url: '../examples/images/', // default: ''

		// how many trials per pulse
		pulse: 5,

		/*
		 * No Defaults !!!!!!!!
		 */
		post_url: 'my.domain.com/post',
		next_url: 'my.domain.com/next' // may take a function (end hook) instead of the url
	});

	/**
	 * Set Categories
	 * ************************************************************************
	 */

	IAT.setCategory('concept1',{
		name: 'white',
		title: 'White people',
		height: 5, // offset to add to following titles
		media: [
			{image: 'wf2_nc.jpg'},
			{image: 'wf3_nc.jpg'},
			{image: 'wf6_nc.jpg'},
			{image: 'wm1_nc.jpg'}
		]
	});

	IAT.setCategory('concept2',{
		name: 'black',
		title: 'Black People', // default: same as name, can be set as a media
		//css: {}, // optional modifier for all media in this category
		media: [
			{image: 'bf14_nc.jpg'},
			{image: 'bf23_nc.jpg'},
			{image: 'bf56_nc.jpg'},
			{image: 'bm14_nc.jpg'}
		]
	});

	IAT.setCategory('attribute1',{
		name: 'Good',

		media: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Splendid'},
			{word: 'Love'}
		]
	});

	IAT.setCategory('attribute2',{
		name: 'Bad',

		media: [
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'}
		]
	});

	/**
	 * Create Instructions
	 * ************************************************************************
	 * usage: IAT.setInstructions(block_number, properties)
	 */

	IAT.setInstructions(1, {
		media: '4 reply redundantly', // takes any media object, default: custom template (we need to work on this),
		css: {fontSize:'0.5em',color:'lily'}
	});

	IAT.setInstructions(5, {
		media: '3 press space' // takes any media object, default: custom template (we need to work on this)
	});

	IAT.setInstructions(2, {
		media: '2 press space' // takes any media object, default: custom template (we need to work on this)
	});

	// this is a special instruction page to be displayed at the end of the task
	IAT.setInstructions('last', {
		media: ' 1 press space' // takes any media object, default: custom template (we need to work on this)
	});

	IAT.play();
});
