/* The script wrapper */
define(['app/API'], function(APIconstructor) {

	var API = new APIconstructor();


	// ### Hello world

	// #### Create trial sequence
	API.addSequence([
		{
			input: [
				{handle:'space',on:'space'}
			],
			layout: [
				// This is a stimulus object
				{
					media :{word:'Hello world'},
					css:{fontSize:'2em',color:'#D7685A'}
				}
			],
			interactions: [
				// This is an interaction (it has a condition and an action)
				{
					conditions: [
						{type:'inputEquals',value:'space'}
					],
					actions: [
						{type:'endTrial'}
					]
				}
			]
		}
	]);

	// #### Activate the player
	return API.script;
});
/* don't forget to close the define wrapper */