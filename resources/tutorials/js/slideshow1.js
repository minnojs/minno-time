/* The script wrapper */
define(['app/API'], function(API) {

	API.addSequence([
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'Is\'nt'}}],
			interactions: [{
				propositions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}]
		},
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'this'}}],
			interactions: [{
				propositions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}]
		},
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'cool?'}}],
			interactions: [{
				propositions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}]
		}
	]);

	API.play();
});
