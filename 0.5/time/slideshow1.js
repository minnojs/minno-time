define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();


	API.addSequence([
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'Is\'nt'}}],
			interactions: [{
				conditions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}]
		},
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'this'}}],
			interactions: [{
				conditions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}]
		},
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'cool?'}}],
			interactions: [{
				conditions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}]
		}
	]);

	return API.script;
});
