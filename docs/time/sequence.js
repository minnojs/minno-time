define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();


	// ### The trial sequence
	// The heart of any miTime script is the sequence.
	// In this part of the tutorial we will see some advanced uses of the sequencer. </br>

	API.addSequence([
		// #### Multiple trials
		// The sequence is an array of trials. you can sequentially add in as many trials as you want
		{
			// First trial
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'First trial'}}],
			interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
		},
		{
			// Second trial
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'Second trial'}}],
			interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
		}
		// #### Mixer objects
		// In order to create more complex sequences you can use mixer objects. Mixer objects allow you to repeat and randomize trials. </br>
		// Each mixer object has a mixer property that defines what type of mixer it is, and a data property that holds a sequence array to be mixed. This means that the sequence may include any number of trials and/or mixer objects.</br>

		//        {
		//            mixer: 'mixer-type',
		//            data: [task1, task2]
		//        }
		,

		// ##### Random
		{
			// The mixer property tells the sequence what sort of mixer object this is.
			// This mixer randomizes its sequence.
			mixer : 'random',
			// The data property holds a sequence array to be randomized. These trials will be inserted into the sequence in a random order.
			data : [
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 1'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 2'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 3'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				}
			]
		},

		// ##### Repeat
		{
			// This mixer repeats the trials in the data property.
			mixer : 'repeat',
			// The repeat mixer requires the times property that defines how many times to repeat the trials.
			times : 3,
			// The data property holds a sequence array to be repeated.
			data : [
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'I am repeated !!'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				}
			]
		},

		// ##### Choose
		{
			// This mixer randomly chooses one or more trials
			mixer : 'choose',
			// The number of trials to choose (by default only one)
			n : 1,
			// The data property holds a sequence array from which the mixer picks trials.
			data : [
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Choose only one (1)'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Choose only one (2)'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Choose only one (3)'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				}

			]
		},

		// ##### Weighted Random
		{
			// The weighted random mixer chooses an element from `data` with specific weights for each entry.
			mixer : 'weightedRandom',
			// The weights of the elements. The numbers in this array are the relative weights of each respective element in data.
			weights: [0.2,0.8],
			// The data property holds a sequence array to be randomized.
			data : [
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 1 (20%)'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 2 (80%)'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				}
			]
		},

		// ##### Wrapper (blocks within randomize)
		{
			// This mixer randomizes its sequence
			mixer : 'random',
			// The data property holds a sequence array to be randomized.
			data : [
				// This trial is randomized normally
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Complex - may be before or after the pair'}}],
					interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				// The wrapper mixer tells the sequencer to keep the data inside it together despite the randomization. It is analogous to parenthesis in math. </br>
				// In contrast, if we has a repeat mixer here, its content would be randomized.
				{
					mixer: 'wrapper',
					data: [
						{
							input: [{handle:'space',on:'space'}],
							layout: [{media :{word:'Pair 1'}}],
							interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
						},
						{
							input: [{handle:'space',on:'space'}],
							layout: [{media :{word:'Pair 2'}}],
							interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
						}
					]
				}
			]
		},

		// ##### Wrapper (randomization within repeat)
		{
			// This mixer repeats its sequence.
			mixer : 'repeat',
			// Two times.
			times: 2,
			// The data property holds a sequence array to be repeated.
			data : [
				// The wrapper mixer tells the sequencer to deffer the randomization until after the repeat</br>
				// In contrast, if we didn't have the wrapper the randomizer would be run only once, and we would always randomize the same sequence.
				{
					mixer: 'wrapper',
					data: [
						{
							mixer:'random',
							data: [
								{
									input: [{handle:'space',on:'space'}],
									layout: [{media :{word:'First Stim'}}],
									interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
								},
								{
									input: [{handle:'space',on:'space'}],
									layout: [{media :{word:'Second Stim'}}],
									interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
								}
							]
						}
					]
				}
			]
		},


		// ##### The End
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'The End'}}],
			interactions: [{conditions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
		}
	]);
	/* this is where we close the sequence */

	// ### Pro tip
	// *This section goes beyond the normal scope of the miTime, and is intended for use by advanced users only.* </br>
	// The sequencer allows for many complex configurations. There are times that you want a quick easy way to test that the sequence you created really does what it is supposed to.
	// The proper way to do that is to create a mock sequence and check that it is mixed correctly. </br>
	// Following is such an example. </br>

	// Require the mixer function
	require(['utils/mixer'], function(mixer) {
		var sequence;

		// Create a sequence using numbers (or strings) instead of trials.
		// You may use all the regular mixer objects.
		// This sequence creates an array of four sets of numbers.
		// Each one of these begins with a `1`, ends with a `9`, and has all the digits between `2` and `8` randomized between them.
		sequence = [
			{
				mixer : 'repeat',
				times : 4,
				data : [
					// Parse the wrapper only **after** repeating.
					{
						mixer: 'wrapper',
						data: [
							{
								mixer : 'wrapper',
								data : [
									1,
									{
										mixer: 'random',
										// Note that we use numbers instead of trials here. This allows us to follow the order that this mixer follows.
										data: [
											2,3,4,5,6,7,8
										] /* end random data */
									},
									9
								] /* end repeat data */
							}
						] /* end random data */
					}
				] /* end repeat data */
			}
		];

		// We log the results of the mixer into the console (click F12 to Open Developer Tools - in Firefox requires Firebug extension.) </br>
		// Now you can check to see if the order is what you intend.
		/* global console */
		console.log(mixer(sequence));
	});

	return API.script;

});
/* don't forget to close the define wrapper */