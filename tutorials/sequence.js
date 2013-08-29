require(['app/API'], function(API) {

	// ### The trial sequence
	// The heart of any PIP script is the sequence.
	// In this part of the tutorial we will see some advanced uses of the sequencer. </br>

	API.addSequence([
		// #### Multiple trials
		// The sequence is an array of trials. you can sequentialy add in as many trials as you want
		{
			// First trial
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'First trial'}}],
			interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
		},
		{
			// Second trial
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'Second trial'}}],
			interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
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
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 2'}}],
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Random 3'}}],
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
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
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				}
			]
		},

		// ##### Choose
		{
			// This mixer randomly chooses one or more trials
			mixer : 'chose',
			// The number of trials to choose (by default only one)
			n : 1,
			// The data property holds a sequence array from which the mixer picks trials.
			data : [
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Choose only one (1)'}}],
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Choose only one (2)'}}],
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Choose only one (3)'}}],
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				}

			]
		},

		// ##### Complex Randomization (wrapper)
		{
			// This mixer randomizes its sequence
			mixer : 'random',
			// The data property holds a sequence array to be randomized.
			data : [
				// This trial is randomized normaly
				{
					input: [{handle:'space',on:'space'}],
					layout: [{media :{word:'Complex - may be before or after the pair'}}],
					interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
				},
				// The wrapper mixer tells the sequencer to keep the data inside it together despite the randomization. It is analogous to parathesis in math. </br>
				// In contrast, if we has a repeat mixer here, its content would be randomized.
				{
					mixer: 'wrapper',
					data: [
						{
							input: [{handle:'space',on:'space'}],
							layout: [{media :{word:'Pair 1'}}],
							interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
						},
						{
							input: [{handle:'space',on:'space'}],
							layout: [{media :{word:'Pair 2'}}],
							interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
						}
					]
				}
			]
		},

		// ##### The End
		{
			input: [{handle:'space',on:'space'}],
			layout: [{media :{word:'The End'}}],
			interactions: [{propositions: [{type:'inputEquals',value:'space'}],actions: [{type:'endTrial'}]}]
		}
	]);
	/* this is where we close the sequence */

});
/* don't forget to close the require wrapper */

// ### Pro tip
// *This section goes beyond the normal scope of the PIP, and is intended for use by advanced users only.* </br>
// The sequencer allows for many complex configurations. There are times that you want a quick easy way to test that the sequence you created realy does what it is supposed to.
// The proper way to do that is to create a mock sequence and check that it is mixed correcty. </br>
// Following is such an example. </br>
;
// Require the mixer function
require(['utils/mixer'], function(mixer) {
	var sequence;

	// create a sequence using numbers (or strings) instead of trials.
	// you may use all the regular mixer objects.
	sequence = [
		{
			mixer : 'repeat',
			times : 4,
			data : [
				{
					mixer: 'random',
					data: [
						{
							mixer : 'repeat',
							times : 4,
							data : [
								{
									mixer: 'random',
									// Note that we use numbers instead of trials here. This allows us to follow the order that this mixer follows.
									data: [
										1,2,3,4,5,6,7,8
									] /* end random data */
								}
							] /* end repeat data */
						}
					] /* end random data */
				}
			] /* end repeat data */
		}
	];

	// We log the results of the mixer into the console (click F12 to Open Developer Tools - requires Firebug extension for Firefox.) </br>
	// Now you can check to see if the order is what you intend.
	console.log(mixer(sequence));
});

