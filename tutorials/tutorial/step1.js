define(['app/API'], function(API) {

	// ### Hello world

	// #### Create trial sequence
	API.addSequence([
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'Hello world'}}],
			interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
		}
	]);

	// #### Activate the player
	API.play();
});
/* don't forget to close the define wrapper */