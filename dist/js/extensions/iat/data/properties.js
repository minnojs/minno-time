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
		fontColor: '#31b404',
		defaultStimulus: {},
		instructionsStimulus: {css:{'font-size':'1.3em',color:'black', lineHeight:1.2,'text-align':'left',margin:'25px'}},

		// optional of course, the same settings as the main API
		background : '#EEEEEE', // the default background (for both canvas background and the generic background)
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
		IATversion: 'long', // Takes 'long'\'short'. default: 'long'

		inter_trial_interval: 250,
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

		// pick the appropriate layout interface
		simpleLayout: true,

		separatorColor: 'black', // the separator color (for simple_layout)
		separatorSize: '1em', // the separator size (for simple_layout)

		// category seperator (for the advanced layout)
		separator: {
			media: 'or', // default: 'or'
			height: 5,
			css : {fontSize:'1.2em'} // optional
		},

		endMedia: undefined, // if you want to replace the message at the end of the task, you can use this property... just set any media you like.

		pulse: 20,

		images_base_url: "",
		templates_base_url: "extensions/iat/jst"

	};
});