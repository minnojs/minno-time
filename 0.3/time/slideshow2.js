define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();


	// Create a trial set with the hello world trial
	API.addTrialSets('slide',[{
		input: [{handle:'space',on:'space'}],
		layout: [{media :{word:'Hello world'}}],
		interactions: [{
			conditions: [{type:'inputEquals',value:'space'}],
			actions: [{type:'endTrial'}]
		}]
	}]);

	// Create the sequence (Each trial extends the slide and overwrites the layout property)
	API.addSequence([
		{
			inherit:'slide',
			layout: [{media :{word:'This'}}]
		},
		{
			inherit:'slide',
			layout: [{media :{word:'is'}}]
		},
		{
			inherit:'slide',
			layout: [{media :{word:'even'}}]
		},
		{
			inherit:'slide',
			layout: [{media :{word:'Cooler!!'}}]
		}
	]);

	return API.script;
});
