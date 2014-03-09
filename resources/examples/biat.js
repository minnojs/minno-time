// # Brief IAT
define(['app/API','extensions/dscore/Scorer'], function(API,Scorer) {

	// Preset the attribute and category names
	var attribute1 = 'Pleasant';
	var attribute2 = 'Unpleasant';
	var category1 = 'Black People';
	var category2 = 'White People';
	var practiceCategory1 = 'Birds';
	var practiceCategory2= 'Mammals';

	// Canvas settings
	API.addSettings('canvas',{
		maxWidth: 1000,
		proportions : 0.8,
		background: 'white',
		canvasBackground: 'green',
		borderWidth: 5,
		borderColor: 'black'
	});

	// Set urls for images and templates
	API.addSettings('base_url',{
		image : '../resources/examples/images',
		template : '../../resources/examples/BIAT'
	});

	// Logging url
	API.addSettings('logger',{
		pulse: 20,
		url : '/implicit/PiPlayerApplet'
	});

	// ### Default Trial
	// This trial defines the basic rules that describe the generic trial in this task.
	// Note that it is lacking a `layout` property and `stimuli` property, these are both defined further on in the specific trial section.
	API.addTrialSets('Default',{
		// By default each trial is correct, this is modified in case of an error
		data: {score:0},

		// Set the **interface** ('e' for left, 'i' for right, 'enter' to skip block).
		// Note that throught this task we support touch.
		input: [
			{handle:'enter',on:'enter'},
			{handle:'out',on:'keypressed',key:'e'},
			{handle:'in',on:'keypressed',key:'i'},
			{handle:'out',on:'leftTouch',touch:true},
			{handle:'in',on:'rightTouch',touch:true}
		],

		// User **interactions**
		interactions: [
			// Begin trial : display stimulus imidiately
			{
				conditions: [{type:'begin'}],
				actions: [{type:'showStim',handle:'targetStim'}]
			},

			// Error response handler
			{
				conditions: [
					{type:'inputEqualsStim',property:'side',negate:true}, // this is an error
					{type:'inputEquals',value:['in','out']} // this is an in/out event (and not any timeout or something)
				],
				actions: [
					{type:'showStim',handle:'error'}, // show error stimulus
					{type:'setTrialAttr', setter:{score:1}} // set the score to 1
				]
			},

			// Correct response handler
			{
				conditions: [{type:'inputEqualsStim',property:'side'}], // check if the input handle is equal to the "side" attribute of stimulus.data
				actions: [
					{type:'removeInput',handle:['in','out']}, // don't allow any further input
					{type:'hideStim', handle: 'All'}, // hide everything
					{type:'log'}, // log this trial
					{type:'setInput',input:{handle:'end', on:'timeout',duration:250}} // Wait for the ITI then trigger the end trial trial action.
				]
			},

			// End trial (this is called after the ITI)
			{
				conditions: [{type:'inputEquals',value:'end'}],
				actions: [
					{type:'endTrial'}
				]
			},

			// Skip block
			{
				conditions: [{type:'inputEquals',value:'enter'}],
				actions: [
					{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
					{type:'endTrial'}
				]
			}
		]
	});

	// ### Create specific trials for each block
	// These trials all inherit the Default trial and change only the `stimuli` and the canvas `layout`.
	API.addTrialSets({
		// category1/attribute1 trial
		category1attribute1:{
			data: {condition: category1 + '+' + attribute1,parcel:'first'},

			layout: [
				{inherit:{type:'byData',set:'layout',data:'out'}},
				{inherit:{type:'byData',set:'layout',data:'in'}},
				{inherit:{type:'byData',set:'layout',data:'top'},media:category1},
				{inherit:{type:'byData',set:'layout',data:'separator'}},
				{inherit:{type:'byData',set:'layout',data:'bottom'},media:attribute1}
			],

			inherit: 'Default',

			stimuli: [
				{inherit:{type:'exRandom',set:'category1_attribute1'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		// category1/attribute1 practice trial
		category1attribute1Practice:[{
			data: {condition: category1 + '+' + attribute1},
			layout: [
				{inherit:{type:'byData',set:'layout',data:'out'}},
				{inherit:{type:'byData',set:'layout',data:'in'}},
				{inherit:{type:'byData',set:'layout',data:'top'},media:category1},
				{inherit:{type:'byData',set:'layout',data:'separator'}},
				{inherit:{type:'byData',set:'layout',data:'bottom'},media:attribute1}
			],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'practice_category1'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],

		// category2/attribute1 trial
		category2attribute1:[{
			data: {condition: category2 + '+' + attribute1,parcel:'first'},
			layout: [
				{inherit:{type:'byData',set:'layout',data:'out'}},
				{inherit:{type:'byData',set:'layout',data:'in'}},
				{inherit:{type:'byData',set:'layout',data:'top'},media:category2},
				{inherit:{type:'byData',set:'layout',data:'separator'}},
				{inherit:{type:'byData',set:'layout',data:'bottom'},media:attribute1}
			],
			inherit: 'Default',													// inherit the default trial
			stimuli: [
				{inherit:{type:'exRandom',set:'category2_attribute1'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],

		// category2/attribute1 practice trial
		category2attribute1Practice:[{
			data: {condition: category2 + '+' + attribute1},
			layout: [
				{inherit:{type:'byData',set:'layout',data:'out'}},
				{inherit:{type:'byData',set:'layout',data:'in'}},
				{inherit:{type:'byData',set:'layout',data:'top'},media:category2},
				{inherit:{type:'byData',set:'layout',data:'separator'}},
				{inherit:{type:'byData',set:'layout',data:'bottom'},media:attribute1}
			],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'practice_category2'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],

		// practice block
		practiceBlock:[{
			data: {condition: 'example'},
			layout: [
				{inherit:{type:'byData',set:'layout',data:'out'}},
				{inherit:{type:'byData',set:'layout',data:'in'}},
				{inherit:{type:'byData',set:'layout',data:'top'},media:practiceCategory1},
				{inherit:{type:'byData',set:'layout',data:'separator'}},
				{inherit:{type:'byData',set:'layout',data:'bottom'},media:attribute1}
			],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'example'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}]
	});

	// ### Default Introduction trial
	// This trial holds the basic structure for all instruction trials. It will be extended (by inheritance) inside the sequence.
	API.addTrialSets("introduction", {
		// Generic introduction trial, to be inherited by all other inroduction trials
		data: {block: 'generic'},

		// Create user interface (just click space to move on...)
		input: [
			{handle:'space',on:'space'},
			{handle:'enter',on:'enter'},
			{handle:'space',on:'bottomTouch',touch:true}
		],

		// Display fixed layout
		layout:[
			{inherit:{type:'byData',set:'layout',data:'out'}},
			{inherit:{type:'byData',set:'layout',data:'in'}}
		],

		interactions: [
			// Display instructions
			{
				conditions: [{type:'begin'}],
				actions: [
					{type:'showStim',handle:'All'}
				]
			},

			// End trial
			{
				conditions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			},

			// Skip block
			{
				conditions: [{type:'inputEquals',value:'enter'}],
				actions: [
					{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
					{type:'endTrial'}
				]
			}
		]
	});

	// ### Stimulus Sets
	API.addStimulusSets({
		// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place.
		Default: [
			{css:{color:'white','font-size':'2em'}}
		],

		// This is the default look for the instructions.
		Instructions: [
			{css:{'font-size':'1.3em',color:'black', lineHeight:1.2}}
		],

		// The trial stimuli.
		// There are two types of trials: trials where category1 is focal, and trials where category2 is focal.
		category1_attribute1 : [
			// The `data` property is especialy important here. `data.side` lets the player know what the correct categorization is for this trial.
			// `data.handle` allows us to focus actions (i.e. show/hide) at this specific stimulus.
			{data:{side:'in', handle:'targetStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'out', handle:'targetStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'in', handle:'targetStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'out', handle:'targetStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		category2_attribute1 : [
			{data:{side:'in', handle:'targetStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'out', handle:'targetStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'out', handle:'targetStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'in', handle:'targetStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],

		// The first block uses examples (practiceCategory1/2) instead of the regular categories.
		example: [
			{data:{side:'in', handle:'targetStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'out', handle:'targetStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'in', handle:'targetStim', alias:practiceCategory1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'practiceCategory1'}}},
			{data:{side:'out', handle:'targetStim', alias:practiceCategory2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'practiceCategory2'}}}
		],

		// For the first four trials in each block - we use only categories.
		practice_category1: [
			{data:{side:'in', handle:'targetStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'out', handle:'targetStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		practice_category2: [
			{data:{side:'out', handle:'targetStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'in', handle:'targetStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],

		// This stimulus set is used for giving feedback, in this case only the error notification
		feedback : [
			{handle:'error', location: {top: 80}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true}
		],

		// One central place to define all layout components.
		// Note that top/bottom do not have a media property. They hold the category/attribute, and their media is set individualy within the trials.
		layout: [
			{data:{handle:'out'},location:{left:5,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
			{data:{handle:'in'},location:{right:5,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}},
			{data:{handle:'top'}, location:{top:6}, css:{color:'black','font-size':'2em'}},
			{data:{handle:'separator'},location:{top:14}, css:{color:'black','font-size':'2em'}, media:'or'},
			{data:{handle:'bottom'},location:{top:22}, css:{color:'black','font-size':'2em'}}

		]
	});

	// ### Media Sets
	API.addMediaSets({
		// Pleasant
		attribute1 : [
			{word: 'Nice'},
			{word: 'Heaven'},
			{word: 'Happy'},
			{word: 'Pleasure'}
		],
		// Unpleasant
		attribute2: [
			{word: 'Nasty'},
			{word: 'Hell'},
			{word: 'Horrible'},
			{word: 'Rotten'}
		],
		// Black people
		category1: [
			{image: 'bf14_nc.jpg'},
			{image: 'bf23_nc.jpg'},
			{image: 'bf56_nc.jpg'},
			{image: 'bm14_nc.jpg'}
		],
		// White people
		category2: [
			{image: 'wf2_nc.jpg'},
			{image: 'wf3_nc.jpg'},
			{image: 'wf6_nc.jpg'},
			{image: 'wm1_nc.jpg'}
		],
		// Birds
		practiceCategory1: [
			{image: 'ctsduck.jpg'},
			{image: 'ctsparrot.jpg'},
			{image: 'ctsrobin.jpg'},
			{image: 'ctssparrow.jpg'}
		],
		// Mammals
		practiceCategory2: [
			{image: 'ctsbison.jpg'},
			{image: 'ctsgiraffe.jpg'},
			{image: 'ctshippo.jpg'},
			{image: 'ctsrhino.jpg'}
		]
	});

	// ### Creating the sequence
	// We create two different sequences for the BIAT so that we can randomly choose Which category comes first.

	// #### 'category1' as the first focal category
	var BIAT1 = [
		// ##### The practice trials
		// The instructions
		{
			data: {block:0,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst1.jst'}
			}]
		},
		// Repeat the practice Block trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'practiceBlock',data:{block:0}}
			]
		},

		// ##### Block 1
		// The instructions
		{
			data: {block:1,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:1}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:1}}
			]
		},

		// ##### Block 2
		// The instructions
		{
			data: {block:2,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:2}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:2}}
			]
		},

		// ##### Blocks 3
		// The instructions
		{
			data: {block:3,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: {
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:3}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:3,parcel:'second'}}
			]
		},

		// ##### Blocks 4
		// The instructions
		{
			data: {block:4,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: {
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:4}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:4,parcel:'second'}}
			]
		},

		// ##### block 5
		// The instructions
		{
			data: {block:5,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:5}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:5,parcel:'third'}}
			]
		},

		// ##### block 6
		// The instructions
		{
			data: {block:6,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:6}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:6,parcel:'third'}}
			]
		},

		// ##### blocks 7
		// The instructions
		{
			data: {block:7,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:7}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:7,parcel:'fourth'}}
			]
		},

		// ##### blocks 8
		// The instructions
		{
			data: {block:8,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: {
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:8}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:8,parcel:'fourth'}}
			]
		}
	]; // The end of BIAT1

	// #### 'category2' as the first focal category
	var BIAT2 = [
		// ##### The presentation trials
		// The instructions
		{
			data: {block:0,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst1.jst'}
			}]
		},
		// Repeat the practice Block trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'practiceBlock',data:{block:0}}
			]
		},

		// ##### Block 1
		// The instructions
		{
			data: {block:1,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}]
		},
		// The practice trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:1}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:1}}
			]
		},

		// ##### Block 2
		// The instructions
		{
			data: {block:2,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:2}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:2}}
			]
		},

		// ##### Blocks 3
		// The instructions
		{
			data: {block:3,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: {
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:3}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:3,parcel:'second'}}
			]
		},

		// ##### Blocks 4
		// The instructions
		{
			data: {block:4,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: {
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:4}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:4,parcel:'second'}}
			]
		},

		// ##### block 5
		// The instructions
		{
			data: {block:5,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:5}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:5,parcel:'third'}}
			]
		},

		// ##### block 6
		// The instructions
		{
			data: {block:6,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:6}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:6,parcel:'third'}}
			]
		},

		// ##### blocks 7
		// The instructions
		{
			data: {block:7,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst3.jst'}
			}]
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category2attribute1Practice',data:{block:7}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category2attribute1',data:{block:7,parcel:'fourth'}}
			]
		},

		// ##### blocks 8
		// The instructions
		{
			data: {block:8,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: {
				inherit:'Instructions',
				media:{template:'inst2.jst'}
			}
		},
		// The presentation trials
		{
			mixer: 'repeat',
			times: 4,
			data : [
				{inherit: 'category1attribute1Practice',data:{block:8}}
			]
		},
		// Run the trial 16 times.
		{
			mixer: 'repeat',
			times: 16,
			data : [
				{inherit: 'category1attribute1',data:{block:8,parcel:'fourth'}}
			]
		}
	]; // The end of BIAT2

	// ### Create the task Sequence itself
	API.addSequence([
		// Randomly choose one of the sequences that we created
		{
			mixer: 'choose',
			data: [
				{mixer:'wrapper',data:BIAT1},
				{mixer:'wrapper',data:BIAT2}
			]
		},

		// Create user feedback. We activate the computeD function here.
		{
			data: {blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [],
			customize: function(){
				/* global console */
				var DScoreObj, FBMsg, DScore;
				var trial = this;
				console.log('calling Scorer');
				DScoreObj = Scorer.computeD();
				var DScore1 = DScoreObj.DScore;
				console.log(DScore1);

				//////second call to score//////
				Scorer.addSettings('compute',{
					parcelValue : ['second']
				});

				console.log('calling Scorer for the second time');
				DScoreObj = Scorer.computeD();
				var DScore2 = DScoreObj.DScore;

				//////third call to score//////
				Scorer.addSettings('compute',{
					parcelValue : ['third']
				});
				console.log('calling Scorer for the third time');
				DScoreObj = Scorer.computeD();
				var DScore3 = DScoreObj.DScore;

				//////fourth call to score//////
				Scorer.addSettings('compute',{
					parcelValue : ['fourth']
				});
				console.log('calling Scorer for the fourth time');
				DScoreObj = Scorer.computeD();
				var DScore4 = DScoreObj.DScore;

				if((!isNaN(DScore2)) && (!isNaN(DScore2)) && (!isNaN(DScore3)) && (!isNaN(DScore4))){
					//avrage the 4 scores
					DScore = (parseFloat(DScore1) + parseFloat(DScore2) + parseFloat(DScore3) + parseFloat(DScore4))/4;
					console.log(DScore);
					if(isNaN(DScore)){
						FBMsg = DScoreObj.errorMessage;
					}
					else{
						FBMsg = Scorer.getFBMsg(DScore);
						}
					console.log(FBMsg);
				}
				else{
					FBMsg = DScoreObj.errorMessage;
					DScore = "";
					console.log(DScore);
					console.log(FBMsg);

				}
				var media = {css:{color:'black'},media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> '+FBMsg+'<br>The Score is:'+DScore+'</p></div>'}};
				trial.stimuli.push(media);
				Scorer.postToServer(DScore,FBMsg,"score","feedback");
			}
		},

		// Instructions trial, the end of the task, instruction what to do next
		{
			data: {blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{// The instructions stimulus
					data : {'handle':'instStim'},
					css: {color:'black'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" for continue to next task.</p></div>'}
				}
			]
		}
	]);

	//the Scorer that computes the user feedback
	Scorer.addSettings('compute',{
		ErrorVar:'score',
		condVar:"condition",
		//condition 1
		cond1VarValues: [
			category1 + '+' + attribute1
		],
		//condition 2
		cond2VarValues: [
			category2 + '+' + attribute1
		],
		parcelVar : "parcel",
		parcelValue : ['first'],
		fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
		maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
		minRT : 400, //Below this latency
		maxRT : 1000, //above this
		errorLatency : {use:"latency", penalty:600, useForSTD:true},
		postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
		/**NEED TO ADD*/
		//Recode latencies faster than 400ms to 400, and latencies slower than 2000ms to 2000 (perhaps not supported by Ben’s computeD function; need to ask him to update the function to support that).
		//Ignore tasks with more than 40% error trials in one of the blocks Yoav: (let me know if not supported by Ben’s function because we can use an alternative rule here).

	});

	Scorer.addSettings('message',{
		MessageDef: [
			{ cut:'-0.65', message:'Your data suggest a strong implicit preference for Black People compared to White People' },
			{ cut:'-0.35', message:'Your data suggest a moderate implicit preference for Black People compared to White People.' },
			{ cut:'-0.15', message:'Your data suggest a slight implicit preference for Black People compared to White People.' },
			{ cut:'0', message:'Your data suggest little to no difference in implicit preference between Black People and White People.' },
			{ cut:'0.15', message:'Your data suggest a slight implicit preference for White People compared to Black People' },
			{ cut:'0.35', message:'Your data suggest a moderate implicit preference for White People compared to Black People' },
			{ cut:'0.65', message:'Your data suggest a strong implicit preference for White People compared to Black People' }
		]
	});


	API.play();
});