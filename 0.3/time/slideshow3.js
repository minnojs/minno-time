define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor('slideshow');


	// Create a trial set with the "Hello world" trial.
	API.addTrialSets('slide',[{
		input: [{handle:'space',on:'space'}],
		layout: [{media :{word:'Hello world'}}],
		interactions: [{
			conditions: [{type:'inputEquals',value:'space'}],
			actions: [{type:'endTrial'}]
		}]
	}]);

	// Create a stimulus set with the default style for all trials.
	API.addStimulusSets('default',[
		{css:{fontSize:'2em',color:'#D7685A'}}
	]);

	// Create the sequence.
	API.addSequence([
		// Trials know to inherit from trial sets.
		{
			inherit:'slide',
			// Stimuli know to inherit from stimulus sets.
			layout: [{
				inherit:'default',
				media :{word:'This'}
			}]
		},
		{
			inherit:'slide',
			layout: [{inherit:'default',media :{word:'is'}}]
		},
		{
			inherit:'slide',
			layout: [{inherit:'default',media :{word:'even'}}]
		},
		{
			inherit:'slide',
			layout: [{inherit:'default',media :{word:'Cooler!'}}]
		}
	]);

	return API.script;
});
