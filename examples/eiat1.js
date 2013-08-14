require(['app/API'], function(API) {

	var attribute1 = 'Bad Words';
	var attribute2 = 'Good Words';
	var category1 = 'White People';
	var category2 = 'Black People';

	API.addSettings('canvas',{
		maxWidth: 800,
		proportions : 0.8
	});

	API.addSettings('logger',{
		url : 'google.com',
		pulse : 20
	});

	/**
	 * Create default Trial
	 * note that this function takes a single object
	 */
	API.addTrialSets('Default',{
		// by default each trial is correct, this is modified in case of an error
		data: {score:1},

		// set the interface for trials
		input: [
			{handle:'left',on:'keypressed',key:'e'},
			{handle:'right',on:'keypressed',key:'i'},
			{handle:'left',on:'leftTouch',touch:true},
			{handle:'right',on:'rightTouch',touch:true}
		],

		// constant elements in the display, in this case: the user instructions: left / right
		layout: [
			{location:{left:0,top:0},media:{template:'templates/left.html'}},
			{location:{left:'auto',right:0,top:0},media:{template:'templates/right.html'}}
		],

		// user interactions
		interactions: [
			// begin trial : display stimulus imidiately
			{
				propositions: [{type:'begin'}],
				actions: [{type:'showStim',handle:'myStim'}]
			},

			// error
			{
				propositions: [
					{type:'stimEquals',value:'side',negate:true},								// check if the input handle is unequal to the "side" attribute of stimulus.data
					{type:'inputEquals',value:'error_end', negate:true}							// make sure this isn't an error end interaction
				],
				actions: [
					{type:'showStim',handle:'error'},											// show error stimulus
					{type:'setInput',input:{handle:'error_end', on:'timeout',duration:300}},	// hide error stimulus after 300ms
					{type:'setTrialAttr', setter:{score:0}}										// set the score to 0
				]
			},

			// hide error stimulus
			{
				propositions: [{type:'inputEquals',value:'error_end'}],							// check if the input handle is "error_end"
				actions: [{type:'hideStim', handle: 'error'}]									// hide error stim
			},

			// correct
			{
				propositions: [{type:'stimEquals',value:'side'}],								// check if the input handle is equal to the "side" attribute of stimulus.data
				actions: [
					{type:'hideStim', handle: 'error'},											// hide error stim if it is displayed
					{type:'log'},																// log this trial
					{type:'endTrial'}															// move on to the next trial
				]
			}
		]
	});

	/**
	 * Create default Introduction trials
	 * note that this function takes an array of objects
	 */
	API.addTrialSets("introduction", [
		// generic introduction trial, to be inherited by all other inroduction trials
		{
			// set block as generic so we can inherit it later
			data: {block: 'generic'},

			// create user interface (just click to move on...)
			input: [
				{handle:'space',on:'space'},
				{handle:'space',on:'centerTouch',touch:true}
			],

			// display fixed layout
			// @TODO: do we even need this here??
			layout:[
				{location:{left:0,top:0},media:{html:'left'}},
				{location:{left:'auto',right:0,top:0},media:{html:'right'}}
			],

			interactions: [
				// display instructions
				{
					propositions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'All'}]
				},

				// end trial
				{
					propositions: [{type:'inputEquals',value:'space'}],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// block 1 instructions
		{
			data: {block:1, left1 : attribute1, right1:attribute2},						// we set the data with the category names so the template can display them
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [
				{
					media:{html:'<div><p><color="#FFFFFF">Hit "E" when the item belongs to a category in the left.<br>Hit "I" when the item belongs to a category in the right.<br><br>If you make an error, an <font color="#FF0000"><b>X</b></font> will appear - fix the error by hitting the other key.<br><br>Put your left index finger on "E", and your right index finger on "I".<br><br></font></p><p align="CENTER">Press the <b>space bar</b> to begin.</p></div>'}
				}
			]
		},

		// block 2 instructions
		{
			data: {block:2, left1:category1, right1:category2},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>See above, the categories have changed.</b><br><br><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 2 of 7]</p></font></div>'}}
			]
		},

		// block 3 instructions
		{
			data: {block:3, left1:attribute1, right1:attribute2, left2:category1, right2:category2},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>See above, the four categories you saw separately now appear together.</b> Remember, each item belongs to only one group. Use the <b>E</b> and <b>I</b> keys to categorize items into the four groups <b>left</b> and <b>right</b>.</p><br /><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 3 of 7]</p></font></div>'}}
			]
		},

		// block 4 instructions
		{
			data: {block:4, left1:attribute1, right1:attribute2, left2:category1, right2:category2},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>Please sort the same four categories again.</b> Remember to go as fast as you can while making as few mistakes as possible.</p><br /><p>Use the <b>E</b> and <b>I</b> keys to categorize items into the four groups <b>left</b> and <b>right</b>.</p><br /><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 4 of 7]</p></font></div>'}}
			]
		},

		// block 5 instructions
		{
			data: {block:5, left1:category1, right1:category2},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>Notice above, there are only two categories and they have switched positions.</b> The concept that was previously on the left is now on the right, and the concept that was on the right is now on the left. Practice this new configuration.</p><br /><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 5 of 7]</p></font></div>'}}
			]
		},

		// block 6 instructions
		{
			data: {block:6, left1:attribute1, right1:attribute2, left2:category2, right2:category1},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>See above, the four categories now appear together in a new configuration.</b> Remember, each item belongs to only one group.</p><br/><p align="center">Press the <b>space bar</b> to begin.</p><font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 6 of 7]</font></p></font></div>'}}
			]
		},

		// block 7 instructions
		{
			data: {block:7, left1:attribute1, right1:attribute2, left2:category2, right2:category1},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font ><p><b>Please sort the same four categories again.</b><br><br/><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 7 of 7]</font></p></font></div>'}}
			]
		}
	]);

	/**
	 * Create specific trials for each block
	 */
	API.addTrialSets("IAT", [

		// block1
		{
			data: {block:1, left1 : attribute1, right1:attribute2},
			inherit: 'Default',													// inherit the default trial
			stimuli: [
				{inherit:{type:'exRandom',set:'attribute1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		// block2
		{
			data: {block:2, left1:category1, right1:category2},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		// block3
		{
			data: {block:3, row:1, left1:attribute1, right1:attribute2, left2:category1, right2:category2},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		{
			data: {block:3, row:2, left1:attribute1, right1:attribute2, left2:category1, right2:category2},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'attribute1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		// block5
		{
			data: {block:5, left1:category1, right1:category2},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		// block6
		{
			data: {block:6, row:1, left1:attribute1, right1:attribute2, left2:category2, right2:category1},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_right'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

		{
			data: {block:6, row:2, left1:attribute1, right1:attribute2, left2:category2, right2:category1},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'attribute1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}
	]);

	/*
	 *	Stimulus Sets
	 *
	 */
	API.addStimulusSets({
		// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
		Default: [
			{css:{color:'blue','font-size':'2em'}}
		],

		// The trial stimuli
		// Each stimulus set holds the left and right stimuli for a specific page settings (is the first attribute/category in the left or right?)
		// Notably the attribute/category sets repeat themselves 5 times each, this is so that when calling them they will be balanced accross each ten trials
		attribute1_left : [
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}}
		],
		attribute1_right : [
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}}
		],
		category1_left: [
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		category1_right : [
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}}
		],

		// this stimulus used for giving feedback, in this case only the error notification
		feedback : [
			{handle:'error', location: {top: 80}, css:{color:'red','font-size':'2em'}, media: {word:'X'}}
		]
	});

	API.addMediaSets({
		attribute1: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Splendid'},
			{word: 'Love'}
		],
		attribute2 : [
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'}
		],
		category1: [
			{image: '/pip/images/epbm1.jpg'},
			{image: '/pip/images/epbm2.jpg'},
			{image: '/pip/images/epbm3.jpg'},
			{image: '/pip/images/epbf1.jpg'},
			{image: '/pip/images/epbf2.jpg'},
			{image: '/pip/images/epbf3.jpg'}
		],
		category2: [
			{image: '/pip/images/epwm1.jpg'},
			{image: '/pip/images/epwm2.jpg'},
			{image: '/pip/images/epwm3.jpg'},
			{image: '/pip/images/epwf1.jpg'},
			{image: '/pip/images/epwf2.jpg'},
			{image: '/pip/images/epwf3.jpg'}
		]
	});

	/*
	 *	Create the Task sequence
	 */
	API.addSequence([
		// block 1
		{inherit: {set:'introduction', type:'byData', data: {block:1}}},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:1}, set:'IAT'}}
			]
		},
/*
		// block 2
		{inherit: {set:'introduction', type:'byData', data: {block:2}}},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:2}, set:'IAT'}}
			]
		},

		// block 3
		{inherit: {set:'introduction', type:'byData', data: {block:3}}},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:3,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:3,row:2}, set:'IAT'}}
			]
		},

		// block 4
		{inherit: {set:'introduction', type:'byData', data: {block:4}}},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:3,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:3,row:2}, set:'IAT'}}
			]
		},

		// block 5
		{inherit: {set:'introduction', type:'byData', data: {block:5}}},
		{
			mixer : 'repeat',
			times : 40,
			data : [
				{inherit : {type:'byData', data:{block:5}, set:'IAT'}}
			]
		},

		// block 6
		{inherit: {set:'introduction', type:'byData', data: {block:6}}},
		{
			mixer: 'repeat',
			times: 10,
			data: [
				{inherit : {type:'byData', data:{block:6,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:6,row:2}, set:'IAT'}}
			]
		},

		// block 7
		{inherit: {set:'introduction', type:'byData', data: {block:7}}},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:6,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:6,row:2}, set:'IAT'}}
			]
		},
*/
		// user feedback
		{
			data: {block:999},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [],
			customize: function(){
				var trial = this;
				console.log(API.getLogs());
				var media = {media:{html:'<div>Here comes the user feedback!!</div>'}};
				trial.stimuli.push(media);
			}
		}

	]);

	API.play();
});