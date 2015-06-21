define(['pipAPI'], function(APIConstructor) {
	var API = new APIConstructor();

	/**
	 * Test the display time for the pip.
	 * This test presents a series of trials that display a white square on input activation.
	 *
	 * The test framework should trigger the input (hit space) And measure the time until the square appears (should be 0).
	 */

	API.addSequence([
		{
			mixer:'repeat',
			times: 10,
			data: [
				{
					input: [
						{handle:'space',on:'space'}
					],

					interactions: [
						// when space is hit =>
						// show all stimuli and after a while proceed to next trial
						{
							conditions: [{type:'inputEquals',value:'space'}],
							actions: [
								{type:'showStim',handle:'All'},
								{type:'trigger',handle : 'end',duration:100}
							]
						},

						// end trial (called after space-click)
						{
							conditions: [{type:'inputEquals',value:'end'}],
							actions: [
								{type:'endTrial'}
							]
						}
					],

					stimuli : [
						{media:' ', css:{background:'white', width:'100%', height:'100%',margin:-5}}
					]
				}
			]
		}
	]);

	return API.script;
});