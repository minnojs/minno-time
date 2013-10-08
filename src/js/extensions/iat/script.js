/* global $ */
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
		fontSize: '12',
		fontColor: 'green',
		defaultStimulus: {size:{height:40, width:40}},
		instructionStimulus: {css:{'font-size':'1.3em',color:'white', lineHeight:1.2}},

		// optional of course, the same settings as the main API
		canvas: {
			maxWidth: 800,
			proportions : 1
		},

		// Interface.
		left: 'e', // default: e
		right: 'i', // default: i
		leftTouch: '<div>left</div>', // default: system
		rightTouch: $('<div>',{text:'right'}), // default: system
		notouch: false, // default: true

		timeout: 450, // default: 0 - no timeout
		timeout_value: '', // how to treat timeouts, default: '' always error.

		// behaviour
		// The duration after you removed the target stimulus but you still wait before moving to the next trial.
		inter_trial_interval: 500,
		post_instruction_interval: 500,

		// do we make the user go back on errors? default: true
		correct_errors: true,

		error_feedback : {
			active: true, // default: true
			media: 'X', // default: X
			stimulus: {css:{color:'red'}}, // optional
			duration: 300 // default?
		},

		correct_feedback : {
			active: false, // default: false
			media: 'OK', // default: V
			stimulus: {css:{color:'green'}}, // optional
			duration: 300 // default?
		},

		timeout_feedback : {
			active: false, // default: false
			media: 'TO', // default: X
			stimulus: {css:{color:'blue'}}, // optional
			duration: 300 // default?
		},

		// category seperator
		separator: {
			media: 'or', // default: 'or'
			css : {} // optional
		},


		// URLS
		images_base_url: '../myFolder/IAT', // default: ''

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
		title: 'Caucasions',
		media: [
			{word:'wm1'},
			{word:'wm2'},
			{word:'wm3'},
			{word:'wf1'},
			{word:'wf2'},
			{word:'wf3'}
		]
	});

	IAT.setCategory('concept2',{
		name: 'black',
		title: 'African People', // default: same as name, can be set as a media
		height: 0, // offset to add to following titles
		css: {location:{top:20, bottom:20}}, // optional modifier for all media in this category
		media: [
			{word:'bm1'},
			{word:'bm2'},
			{word:'bm3'},
			{word:'bf1'},
			{word:'bf2'},
			{word:'bf3'}
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
/*
	IAT.setInstructions(1, {
		escape_key: 32, // default: space
		time_before_trial: 500,
		media: 'press space' // takes any media object, default: custom template (we need to work on this),
		css: {}
	});

	IAT.setInstructions(2, {
		escape_key: 32, // default: space
		text: 'press space' // takes any media object, default: custom template (we need to work on this)
	});

	IAT.setInstructions(3, {
		escape_key: 32, // default: space
		text: 'press space' // takes any media object, default: custom template (we need to work on this)
	});

	// this is a special instruction page to be displayed at the end of the task
	IAT.setInstructions('last', {
		escape_key: 32, // default: space
		text: 'press space' // takes any media object, default: custom template (we need to work on this)
	});
*/
	IAT.play();
});
