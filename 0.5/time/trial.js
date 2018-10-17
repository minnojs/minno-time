// All miTime source files are wrapped inside define function
// This function gives you access to the API object that we use to build the various tasks
// If you want to know more about this, you can read up about AMD and check out http://requirejs.org/
define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	// ### The trial sequence
	// The heart of any miTime script is the sequence.
	// Sequences are arrays of Trial objects. In this part of the tutorial we will see a simple sequence encompasing a single trial.

	API.addSequence([
		// #### Trial structure
		/* the trial begins here */
		{
			// The data property of the trial is used to keep user defined data regarding this trial.
			// It can be used to keep track of trial types, blocks, score etc.
			// It becomes incrementaly usefull with more advance features of the miTime.
			data: {
				myProperty: 'information',
				myOtherProperty: 'more information'
			},

			// The input property of the trial is used to create the user interface.
			// In this case we tell the player to listen for hits on the space key.
			// Later on we will tell the player what to do when the space button is clicked.
			input: [
				{handle:'space',on:'space'}
			],

			// The layout property of the trial is used to display statick stimuli.
			// These stimuli are automaticaly displayed at the begining of a trial, and are not affected be user interactions.
			// This property holds an array of stimuli objects, in this case the stimuli are set to display words in the top left and bottom right of the screen.
			// We will learn more about Stimuli in a later tutorial.
			layout:[
				{location:{left:0,top:0},media:{word:'top left'}},
				{location:{left:'auto',right:0,top:'auto',bottom:0},media:{word:'bottom right'}}
			],

			// The stimuli property of the trial holds stimuli that are dynamicaly displayed durring the trial.
			// These trials are not displayed by default, and can be affected by user interactions.
			// Like the layout property the stimuli property holds an array of stimuli objects.
			stimuli: [
				{media :{word:'Hello world'}}
			],

			// The interaction property of the trial is responsible for any interactions the user has through the trial.
			// Each interaction is composed of a propostition (a statement that is either true or false)
			// And of action to execute in case the condition is true.
			// We will learn more about this section in the condition and action tutorials.
			interactions: [
				// 1. Display Stimulus
				{
					/* when we begin the trial (condition) */
					conditions: [{type:'begin'}],
					/* show all stimuli (action) */
					actions: [{type:'showStim',handle:'All'}]
				},

				// 2. End trial on space click
				{
					/* when space is clicked */
					conditions: [{type:'inputEquals',value:'space'}],
					/* end the trial */
					actions: [{type:'endTrial'}]
				}
			]
		}
		/* The trial ends here */
	]);
	/* this is where we close the sequence */

	return API.script;
});
/* don't forget to close the require wrapper */