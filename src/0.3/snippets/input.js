define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	// ### input
	// The trial input attribute lists the input types that the player is familiar with.
	// Each input element must include both a handle and an on propery. </br>
	// The **handle** is the way we refer to this type of input inside the player (in the interaction section), it is basicly the name we give this input.
	// The **on** parameter describes the specific input that triggers this element.

	API.addSequence([
		// ##### Keypressed
		// The keypressed input takes an additional property: *key*.
		{
			input: [
				// Key can take single characters.
				{handle:'end',on:'keypressed', key:'i'},
				// Or key codes (69 is the key code for e).
				{handle:'end',on:'keypressed', key:69},
				// And even arrays
				{handle:'otherHandle',on:'keypressed', key:['i',69]}
			],
			layout: [{media :{word:'Click e or i to move on'}}],
			interactions: [
				{
					// This is where we tell the player to respond to the input.
					// More about this in the conditions tutorial.
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		},
		// There are several shortcuts for usefull keypresses that do not require the *key* paramater.
		{
			input: [
				// Space
				{handle:'end',on:'space'},
				// Enter
				{handle:'end',on:'enter'},
				// Escape
				{handle:'end',on:'esc'}
			],
			layout: [{media :{word:'Click enter escape or space to move on'}}],
			interactions: [
				{
					// This is where we tell the player to respond to the input.
					// More about this in the conditions tutorial.
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### Click
		// React to a click on an element.
		// Takes either a class handle or an html element to present.
		// In case an element is defined it is presented when the input is activated.
		{
			input: [
				// **stimHandle** is used to indicate stimuli with the appropriate Handle (in this case "myStimulus").
				{handle:'end',on:'click',stimHandle:'myStimulus'},
				// **element** allows you to insert an html (or even jquery) element for this interaction
				{handle:'end',on:'click',element:'<div>bump</div>'}
			],
			layout: [{data:{handle:'myStimulus'},media :{word:'Click me too!!'}}],
			interactions: [
				{
					// This is where we tell the player to respond to the input.
					// More about this in the conditions tutorial.
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### Timeout
		// React after a set time.
		// Takes a duration property in miliseconds. </br>
		// This input is especialy usefell together with the removeInput action. (see the actions tutorial)
		{
			input: [
				// This trial will end after five seconds.
				{handle:'end', on: 'timeout', duration: 3000}
			],
			layout: [{media :{word:'Wait just five seconds'}}],
			interactions: [
				{
					// This is where we tell the player to respond to the input.
					// More about this in the conditions tutorial.
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		}
	]);

	return API.script;
});