define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	API.addSequence([
		{
			input: [
				{handle:'space',on:'space'}
			],
			layout: [
				{
					media :{word:'Hello world'},
					css:{fontSize:'2em',color:'#D7685A'}
				}
			],
			interactions: [
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

	return API.script;
});