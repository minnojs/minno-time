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
		instructionStimulus: {css:{'font-size':'1.3em',color:'white', lineHeight:1.2}},

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
		timeout_value: 'none', // how to treat timeouts, default: 'none' always error.

		// behaviour
		// The duration after you removed the target stimulus but you still wait before moving to the next trial.
		inter_trial_interval: 500,
		post_instruction_interval: 500,

		// do we make the user go back on errors? default: true
		correct_errors: true,

		error_feedback : {
			active: true, // default: true
			media: 'X', // default: X
			duration: 300 // default?
		},

		correct_feedback : {
			active: false, // default: false
			media: 'OK', // default: V
			duration: 300 // default?
		},

		timeout_feedback : {
			active: true, // default: false
			media: 'X', // default: X
			duration: 300 // default?
		},

		// category seperator
		seperator: {
			media: 'or', // default: 'or'
			height: 4,
			css : {fontSize:'1.2em'} // optional
		},

		pusle: 20,

		images_base_url: "",
		templates_base_url: "extensions/iat/jst"

	};
});