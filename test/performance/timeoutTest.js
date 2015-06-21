define(['pipAPI'], function(APIConstructor) {
	var API = new APIConstructor();

	/**
	 * Test the timer timeout duration for the pip.
	 * This test presents a series of trials that display a white square after n ms on input activation.
	 *
	 * The test framework should trigger the input (hit space) And measure the time until the square appears (should be n ms).
	 *
	 * We might want to add tests for different durations to see if there is a difference for larger or smaller sets...
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
						// trigger a timeout
						{
							conditions: [{type:'inputEquals',value:'space'}],
							actions: [
								{type:'trigger',handle : 'show',duration:100}
							]
						},

						// after the timeout =>
						// display stim and trigger the end
						{
							conditions: [{type:'inputEquals',value:'show'}],
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