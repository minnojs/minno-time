// The default properties for the IAT component
// These are changed by any user defined properties!
define([],function(){
	return {
		// activate skip block
		DEBUG: true,

		// Default stimulus properties
		// All optional
		font: 'Arial',
		fontSize: '2em',
		fontColor: 'green',
		defaultStimulus: {},
		instructionsStimulus: {css:{'font-size':'1.3em',color:'white', lineHeight:1.2}},

		// optional of course, the same settings as the main API
		canvas: {
			maxWidth: 800,
			proportions : 0.8
		},

		// Interface.
		left: 'e', // default: e
		right: 'i', // default: i
		leftTouch: undefined, // default: system
		rightTouch: undefined, // default: system
		notouch: true, // default: true

		timeout: 0, // default: 0 - no timeout

		// behaviour
		// The duration after you removed the target stimulus but you still wait before moving to the next trial.
		randomize_order: true, // switch blocks 1/5 and 34/67
		inter_trial_interval: 500,
		post_instructions_interval: 500,

		// do we make the user correct errors? default: true
		correct_errors: true,

		error_feedback : {
			active: true, // default: true
			media: 'X', // default: 'X'
			duration: 'static' // default 'static'
		},

		correct_feedback : {
			active: false, // default: false
			media: 'OK', // default: 'OK'
			duration: 300 // default?
		},

		timeout_feedback : {
			active: true, // default: false
			media: 'X', // default: 'X'
			duration: 500 // default: 500
		},

		// category seperator
		separator: {
			media: 'or', // default: 'or'
			height: 5,
			css : {fontSize:'1.2em'} // optional
		},

		pusle: 20,

		images_base_url: "",
		templates_base_url: "extensions/iat/jst"

	};
});