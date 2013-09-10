require(['app/API','../../examples/dscore/Scorer'], function(API,Scorer) {

	var attribute1 = 'Pleasant';
	var attribute2 = 'Unpleasant';
	var category1 = 'Black People';
	var category2 = 'White People';

	API.addSettings('canvas',{
		maxWidth: 1000,
		proportions : 0.8,
		//Change the colors to allow better presentation of the colored stimuli.
		background: 'white',
		canvasBackground: 'green',
		borderWidth: 5,
		borderColor: 'black'
	});

	API.addSettings('base_url',{
		image : '../examples/images',
		template : '../../examples/BIAT'
	});


	API.addSettings('logger',{
		url : '/implicit/PiPlayerApplet'
	});

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
		parcelValue : ["research","test"],
		fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
		maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
		minRT : 400, //Below this latency
		maxRT : 10000, //above this
		errorLatency : {use:"false", penalty:600, useForSTD:true},//ignore error respones
		postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
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

	/**
	 * Create default Trial
	 * note that this function takes a single object
	 */
	API.addTrialSets('Default',{
		// by default each trial is correct, this is modified in case of an error
		data: {score:0},

		// set the interface for trials
		input: [
			{handle:'enter',on:'enter'},
			{handle:'out',on:'keypressed',key:'e'},
			{handle:'in',on:'keypressed',key:'i'},
			{handle:'out',on:'leftTouch',touch:true},
			{handle:'in',on:'rightTouch',touch:true}
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
					{type:'inputEquals',value:'error_end', negate:true},						// make sure this isn't an error end interaction
					{type:'inputEquals',value:'end', negate:true}								// make sure this isn't an end interaction
				],
				actions: [
					{type:'showStim',handle:'error'},											// show error stimulus
					{type:'setTrialAttr', setter:{score:1}}										// set the score to 1
				]
			},

			// correct
			{
				propositions: [{type:'stimEquals',value:'side'}],								// check if the input handle is equal to the "side" attribute of stimulus.data
				actions: [
					{type:'removeInput',handle:['in','out']},
					{type:'hideStim', handle: 'All'},											// hide everything
					{type:'log'},																// log this trial
					{type:'setInput',input:{handle:'end', on:'timeout',duration:250}}			// trigger the "end action after ITI"
				]
			},

			// end after ITI
			{
				propositions: [{type:'inputEquals',value:'end'}],
				actions: [
					{type:'endTrial'}
				]
			},

			// skip block
			{
				propositions: [{type:'inputEquals',value:'enter'}],
				actions: [
					{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
					{type:'endTrial'}
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
			data: {block: 'generic'},
			// create user interface (just click to move on...)
			input: [
				{handle:'space',on:'space'},
				{handle:'enter',on:'enter'},
				{handle:'space',on:'bottomTouch',touch:true}
			],

			// display fixed layout
			layout:[
				{location:{left:15,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
				{location:{right:15,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}}
			],

			interactions: [
				// display instructions
				{
					propositions: [{type:'begin'}],
					actions: [
						{type:'showStim',handle:'All'}
					]
				},

				// end trial
				{
					propositions: [{type:'inputEquals',value:'space'}],
					actions: [{type:'endTrial'}]
				},

				// skip block
				{
					propositions: [{type:'inputEquals',value:'enter'}],
					actions: [
						{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
						{type:'endTrial'}
					]
				}
			]
		}
	]);

	/**
	 * Create specific trials for each block
	 */
	API.addTrialSets({
	pleasentBlack:[{
			data: {condition: category1 + '+' + attribute1,parcel:'research'},
			layout: [
				{location:{left:15,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
				{location:{right:15,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}},
				{location:{top:6},media:{word:category1}, css:{color:'black','font-size':'2em'}},
				{location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
				{location:{top:22},media:{word:'Pleasant'}, css:{color:'black','font-size':'2em'}}
		],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_attribute1'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],
	pleasentBlackPractice:[{
			data: {condition: category1 + '+' + attribute1,parcel:'test'},
				layout: [
				{location:{left:15,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
				{location:{right:15,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}},
				{location:{top:6},media:{word:category1}, css:{color:'black','font-size':'2em'}},
				{location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
				{location:{top:22},media:{word:'Pleasant'}, css:{color:'black','font-size':'2em'}}
		],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'practice_category1'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],

	pleasentWhite:[{
			data: {condition: category2 + '+' + attribute1,parcel:'research'},
				layout: [
				{location:{left:15,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
				{location:{right:15,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}},
				{location:{top:6},media:{word:category2}, css:{color:'black','font-size':'2em'}},
				{location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
				{location:{top:22},media:{word:'Pleasant'}, css:{color:'black','font-size':'2em'}}
		],

			inherit: 'Default',													// inherit the default trial
			stimuli: [
				{inherit:{type:'exRandom',set:'category2_attribute1'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],
	pleasentWhitePractice:[{
			data: {condition: category2 + '+' + attribute1,parcel:'test'},
				layout: [
				{location:{left:15,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
				{location:{right:15,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}},
				{location:{top:6},media:{word:category2}, css:{color:'black','font-size':'2em'}},
				{location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
				{location:{top:22},media:{word:'Pleasant'}, css:{color:'black','font-size':'2em'}}
		],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'practice_category2'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],
	practiceBlock:[{
			data: {condition: 'example',parcel:'test'},
				layout: [
				{location:{left:15,top:3},media:{word:'out: e'}, css:{color:'black','font-size':'1em'}},
				{location:{right:15,top:3},media:{word:'in: i'}, css:{color:'black','font-size':'1em'}},
				{location:{top:6},media:{word:'Birds'}, css:{color:'black','font-size':'2em'}},
				{location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
				{location:{top:22},media:{word:'Pleasant'}, css:{color:'black','font-size':'2em'}}
		],
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'example'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}]
	});

	/*
	 *	Stimulus Sets
	 *
	 */
	API.addStimulusSets({
		// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
		Default: [
			{css:{color:'white','font-size':'2em'}}
		],
		Instructions: [
			{css:{'font-size':'1.3em',color:'black', lineHeight:1.2}}
		],
		// The trial stimuli
		category1_attribute1 : [
			{data:{side:'in', handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'out', handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'in', handle:'myStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'out', handle:'myStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		category2_attribute1 : [
			{data:{side:'in', handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'out', handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'out', handle:'myStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'in', handle:'myStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		//for the first block (Mammals/ Birds)
		example: [
			{data:{side:'in', handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
			{data:{side:'out', handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
			{data:{side:'in', handle:'myStim', alias:'Birds'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'birds'}}},
			{data:{side:'out', handle:'myStim', alias:'Mammals'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'mammals'}}}
		],
		//for the 4 first trial in each block- the first 4 is only the images
		practice_category1: [
			{data:{side:'in', handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'out', handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		practice_category2: [
			{data:{side:'out', handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}},
			{data:{side:'in', handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],

		// this stimulus used for giving feedback, in this case only the error notification
		feedback : [
			{handle:'error', location: {top: 80}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true}
		]
	});
	API.addMediaSets({
		attribute1 : [// Pleasant
			{word: 'Nice'},
			{word: 'Heaven'},
			{word: 'Happy'},
			{word: 'Pleasaure'}
		],
		attribute2: [ //Unpleasant
			{word: 'Nasty'},
			{word: 'Hell'},
			{word: 'Horrible'},
			{word: 'Rotten'}
		],
		category1: [ // Black people
			{image: 'bf14_nc.jpg'},
			{image: 'bf23_nc.jpg'},
			{image: 'bf56_nc.jpg'},
			{image: 'bm14_nc.jpg'}
		],
		category2: [ //White people
			{image: 'wf2_nc.jpg'},
			{image: 'wf3_nc.jpg'},
			{image: 'wf6_nc.jpg'},
			{image: 'wm1_nc.jpg'}
		],
		birds: [//birds
			{image: 'ctsduck.jpg'},
			{image: 'ctsparrot.jpg'},
			{image: 'ctsrobin.jpg'},
			{image: 'ctssparrow.jpg'}
		],
		mammals: [//mamals
			{image: 'ctsbison.jpg'},
			{image: 'ctsgiraffe.jpg'},
			{image: 'ctshippo.jpg'},
			{image: 'ctsrhino.jpg'}
		]
	});

	/*
	 *	Create the Task sequence
	 */
	API.addSequence([
		{
			data: {block:0,blockStart:true},			// we set the data with the category names so the template can display them
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{template:'inst1.jst'}
			}]
		},
		{ //The presentation trials
			// Repeat 16 times the trial. (practice Block)
					mixer: 'repeat',
					times: 16,
					data : [
						{inherit: 'practiceBlock',data:{block:0}}
					]
		},
		{
		mixer: 'random',		//blocks 1+2
		data : [
				{
					mixer: 'repeat',
					times: 1,// one time each block
					data : [
					{
						mixer: 'wrapper',//wrapp togerher the instructions, practice trials and the other 16 trials
						data: [
						{   //the instructions
							data: {block:1+2,blockStart:true},	//can't tell wich one will be first
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst2.jst'}
							}]
						},
						{ //The 4 practice trials
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentBlackPractice',data:{block:1+2}}]
						}, // end wrapper
						{
							mixer: 'repeat',// Repeat 16 times the trial.
							times: 16,
							data : [
								{inherit: 'pleasentBlack',data:{block:1+2}}]
						} // end wrapper
					]},
			{
			mixer: 'wrapper',
				data: [{
						data: {block:1+2,blockStart:true},
						inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
						stimuli: [{
						inherit:'Instructions',
						media:{template:'inst3.jst'}}]
						},
						{ //The presentation trials
						mixer: 'repeat',
						times: 4,
						data : [
							{inherit: 'pleasentWhitePractice',data:{block:1+2}}]
						}, // end wrapper
						{ //The presentation trials
						mixer: 'repeat',
						times: 16,
						data : [
							{inherit: 'pleasentWhite',data:{block:1+2}}]
						} // end wrapper
					]}
				]}
			]},
		//blocks 3+4
		{
		mixer: 'random',
		data : [
				{
				mixer: 'repeat',
				times: 1,// 1 time each block
				data : [
				{
					mixer: 'wrapper',
					data: [
						{
							data: {block:3+4,blockStart:true},			// we set the data with the category names so the template can display them
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst2.jst'}
							}]
						},
						{ //The presentation trials
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentBlackPractice',data:{block:3+4}}]
						}, // end wrapper
						{ //The presentation trials
							mixer: 'repeat',
							times: 16,
							data : [
								{inherit: 'pleasentBlack',data:{block:3+4}}]
						} // end wrapper
					]},
				{
					mixer: 'wrapper',
					data: [
							{
							data: {block:3+4,blockStart:true},			// we set the data with the category names so the template can display them
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst3.jst'}
								}]
							},
							//The presentation trials
							{
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentWhitePractice',data:{block:3+4}}]
							}, // end wrapper
							{ //The presentation trials
							mixer: 'repeat',
							times: 16,
							data : [
								{inherit: 'pleasentWhite',data:{block:3+4}}]
							} // end wrapper
						]}
					]}
				]},
		//blocks 5+6
		{
		mixer: 'random',
		data : [
				{
				mixer: 'repeat',
				times: 1,// 1 time each block
				data : [
				{
					mixer: 'wrapper',
					data: [
						{
							data: {block:5+6,blockStart:true},			// we set the data with the category names so the template can display them
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst2.jst'}
							}]
						},
						{ //The presentation trials
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentBlackPractice',data:{block:5+6}}]
						}, // end wrapper
						{ //The presentation trials
							mixer: 'repeat',
							times: 16,
							data : [
								{inherit: 'pleasentBlack',data:{block:5+6}}]
						} // end wrapper
					]},
				{
					mixer: 'wrapper',
					data: [
							{
							data: {block:5+6,blockStart:true},			// we set the data with the category names so the template can display them
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst3.jst'}
								}]
							},
							{ //The presentation trials
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentWhitePractice',data:{block:5+6}}]
							}, // end wrapper
							{ //The presentation trials
							mixer: 'repeat',
							times: 16,
							data : [
								{inherit: 'pleasentWhite',data:{block:5+6}}]
							} // end wrapper
						]}
					]}
				]},
					//blocks 7+8
		{
		mixer: 'random',
		data : [
				{
				mixer: 'repeat',
				times: 1,// 1 time each block
				data : [
				{
					mixer: 'wrapper',
					data: [
						{
							data: {block:7+8,blockStart:true},			// we set the data with the category names so the template can display them
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst2.jst'}
							}]
						},
						{ //The presentation trials
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentBlackPractice',data:{block:7+8}}]
						}, // end wrapper
						{ //The presentation trials
							mixer: 'repeat',
							times: 16,
							data : [
								{inherit: 'pleasentBlack',data:{block:7+8}}]
						} // end wrapper
					]},
				{
					mixer: 'wrapper',
					data: [
							{
							data: {block:7+8,blockStart:true},			// we set the data with the category names so the template can display them
							inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
							stimuli: [{
							inherit:'Instructions',
							media:{template:'inst3.jst'}
								}]
							},
							{ //The presentation trials
							mixer: 'repeat',
							times: 4,
							data : [
								{inherit: 'pleasentWhitePractice',data:{block:7+8}}]
							}, // end wrapper
							{ //The presentation trials
							mixer: 'repeat',
							times: 16,
							data : [
								{inherit: 'pleasentWhite',data:{block:7+8}}]
							} // end wrapper
						]}
					]}
				]},


		// user feedback- here we will use the computeD function.
		{
			data: {blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [],
			customize: function(){
				var trial = this;
				console.log('calling Scorer');
				var DScore = Scorer.computeD();
				var FBMsg = Scorer.getFBMsg(DScore);
				console.log(FBMsg);
				console.log(DScore);
				var media = {css:{color:'black'},media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> '+FBMsg+'<br>The Score is:'+DScore+'</p></div>'}};
				trial.stimuli.push(media);
				Scorer.postToServer(DScore,FBMsg);
			}
		},

		{ //Instructions trial, the end of the task, instruction what to do next
			data: {blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					css: {color:'black'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" for continue to next task.</p></div>'}
				}
			]
		}
	]);

	API.play();
});