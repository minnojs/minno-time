// You can find the images used for this task [here](https://github.com/minnojs/minno-time/tree/gh-pages/images).
//
// ** This example is intended for educational purposes only. If you want to actually use this type of task, please see the [extensions page](https://app-prod-03.implicit.harvard.edu/implicit/common/all/js/pip/piscripts/ydocs/dist/index.html). **
define(['pipAPI','pipScorer'], function(APIConstructor,Scorer) {

	var API = new APIConstructor();
	var scorer = new Scorer();
	var attribute1 = 'Good Words';
	var attribute2 = 'Bad Words';
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
		image : '/minno-time/images'
	});


	API.addSettings('logger',{
        pulse: 20,
        url : '/implicit/PiPlayerApplet',

        // use default logger (as copied from documents.txt but replace the regular latency with the computed latency)
        logger: function(trialData, inputData, actionData, logStack){

			var stimList = this._stimulus_collection.get_stimlist();
			var mediaList = this._stimulus_collection.get_medialist();

			var myLatency = inputData.latency;
			if (trialData.begin > 0) {
				myLatency = inputData.latency - trialData.begin;
			}

			return {
				log_serial : logStack.length,
				trial_id: this._id,
				name: this.name(),
				responseHandle: inputData.handle,
				latency: myLatency, // computed latency
				absoluteLatency : inputData.latency, // original latency
				stimuli: stimList,
				media: mediaList,
				data: trialData
			};
        }

    });

	//the scorer that computes the user feedback
	scorer.addSettings('compute',{
		ErrorVar:'score',
		condVar:"condition",
		cond1VarValues: [category1 + '+' + attribute1,category2 + '+' + attribute2], //condition 1
		cond2VarValues: [category1 + '+' + attribute2,category2 + '+' + attribute1], //condition 2
		parcelVar : "parcel",
		parcelValue : ["research"],
		fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
		maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
		minRT : 150, //Below this latency
		maxRT : 5000, //above this
		errorLatency : {use:"false", penalty:600, useForSTD:true}//ignore error respones
	});

	scorer.addSettings('message',{
		MessageDef: [
			{ cut:'-0.3', message:'Your data suggest an automatic preference for black people over white people.' },//D < -0.3
			{ cut:'0.3', message:'Your data suggest no or slight difference in your preference between white people and black people.' },// -0.3 <= D <= 0.3
			{ cut:'5', message:'Your data suggest an automatic preference for white people over black people.' }// D > 0.3 (and D<=5)
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
			{handle:'topLeft',on:'keypressed',key:'w'},
			{handle:'topRight',on:'keypressed',key:'o'},
			{handle:'bottomLeft',on:'keypressed',key:'c'},
			{handle:'bottomRight',on:'keypressed',key:'m'}
		],
		// display fixed layout
			layout:[
				{location:{left:15,top:3},media:{word:'key: w'}, css:{color:'black','font-size':'1em'}},
				{location:{left:10,top:7},media:{word:attribute2}, css:{color:'white','font-size':'2em'}}, //bad words + white people
				{location:{left:10,top:13},media:{word:category2}, css:{color:'#00FF00','font-size':'2em'}},
				{location:{right:15,top:3},media:{word:'key: o'}, css:{color:'black','font-size':'1em'}},
				{location:{right:10,top:7},media:{word:attribute1}, css:{color:'white','font-size':'2em'}}, // good words + white people
				{location:{right:10,top:13},media:{word:category2}, css:{color:'#00FF00','font-size':'2em'}},
				{location:{left:15,bottom:3},media:{word:'key: c'}, css:{color:'black','font-size':'1em'}},
				{location:{left:10,bottom:13},media:{word:attribute2}, css:{color:'white','font-size':'2em'}}, // bad words + black people
				{location:{left:10,bottom:7},media:{word:category1}, css:{color:'#00FF00','font-size':'2em'}},
				{location:{right:15,bottom:3},media:{word:'key: m'}, css:{color:'black','font-size':'1em'}},
				{location:{right:10,bottom:13},media:{word:attribute1}, css:{color:'white','font-size':'2em'}}, // good words + black people
				{location:{right:10,bottom:7},media:{word:category1}, css:{color:'#00FF00','font-size':'2em'}}
			],


		// user interactions
		interactions: [
			// begin trial : display stimulus imidiately
			{
				conditions: [{type:'begin'}],
				actions: [{type:'showStim',handle:'wordStim'},
							{type:'showStim',handle:'imageStim'}]

			},
			// error
			{
				conditions: [
					{type:'inputEqualsStim',property:'side',negate:true},						// check if the input handle is unequal to the "side" property of stimulus.data
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
				conditions: [{type:'inputEqualsStim',property:'side'}],								// check if the input handle is equal to the "side" property of stimulus.data
				actions: [
					{type:'removeInput',handle:['bottomLeft','bottomRight', 'topLeft','topRight']},
					{type:'hideStim', handle: 'All'},											// hide everything
					{type:'log'},																// log this trial
					{type:'setInput',input:{handle:'end', on:'timeout',duration:250}}			// trigger the "end action after ITI"
				]
			},

			// end after ITI
			{
				conditions: [{type:'inputEquals',value:'end'}],
				actions: [
					{type:'endTrial'}
				]
			},

			// skip block
			{
				conditions: [{type:'inputEquals',value:'enter'}],
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
				{location:{left:15,top:3},media:{word:'key: w'}, css:{color:'black','font-size':'1em'}},
				{location:{left:10,top:7},media:{word:attribute2}, css:{color:'white','font-size':'2em'}}, //bad words + white people
				{location:{left:10,top:13},media:{word:category2}, css:{color:'#00FF00','font-size':'2em'}},
				{location:{right:15,top:3},media:{word:'key: o'}, css:{color:'black','font-size':'1em'}},
				{location:{right:10,top:7},media:{word:attribute1}, css:{color:'white','font-size':'2em'}}, // good words + white people
				{location:{right:10,top:13},media:{word:category2}, css:{color:'#00FF00','font-size':'2em'}},
				{location:{left:15,bottom:3},media:{word:'key: c'}, css:{color:'black','font-size':'1em'}},
				{location:{left:10,bottom:13},media:{word:attribute2}, css:{color:'white','font-size':'2em'}}, // bad words + black people
				{location:{left:10,bottom:7},media:{word:category1}, css:{color:'#00FF00','font-size':'2em'}},
				{location:{right:15,bottom:3},media:{word:'key: m'}, css:{color:'black','font-size':'1em'}},
				{location:{right:10,bottom:13},media:{word:attribute1}, css:{color:'white','font-size':'2em'}}, // good words + black people
				{location:{right:10,bottom:7},media:{word:category1}, css:{color:'#00FF00','font-size':'2em'}}
			],

			interactions: [
				// display instructions
				{
					conditions: [{type:'begin'}],
					actions: [
						{type:'showStim',handle:'All'}
					]
				},

				// end trial
				{
					conditions: [{type:'inputEquals',value:'space'}],
					actions: [{type:'endTrial'}]
				},

				// skip block
				{
					conditions: [{type:'inputEquals',value:'enter'}],
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
	goodBlack:[{
			data: {condition: category1 + '+' + attribute1,parcel:'research'},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_right'}},
				{inherit:{type:'exRandom',set:'attribute1_bottom'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],
	badBlack:[{
			data: {condition: category1 + '+' + attribute2,parcel:'research'},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'category1_left'}},
				{inherit:{type:'exRandom',set:'attribute2_bottom'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],
	goodWhite:[{
			data: {condition: category2 + '+' + attribute1,parcel:'research'},
			inherit: 'Default',													// inherit the default trial
			stimuli: [
				{inherit:{type:'exRandom',set:'category2_right'}},
				{inherit:{type:'exRandom',set:'attribute1_top'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		}],
	badWhite:[{
			data: {condition: category2 + '+' + attribute2,parcel:'research'},
			inherit: 'Default',													// inherit the default trial
			stimuli: [
				{inherit:{type:'exRandom',set:'category2_left'}},
				{inherit:{type:'exRandom',set:'attribute2_top'}},
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
			{css:{color:'white','font-size':'2em', lineHeight:1.2}}
		],
		Instructions: [
			{css:{'font-size':'1.3em',color:'black', lineHeight:1.2}}
		],
		// The trial stimuli
		category1_right : [
			{data:{side:'bottomRight', handle:'imageStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}}
		],
		attribute1_bottom : [
			{data:{side:'bottomRight', handle:'wordStim', alias:attribute1}, location: {top: 30}, css:{color:'white','font-size':'2em'},  media: {inherit:{type:'exRandom',set:'attribute1'}}}
		],
		category1_left: [
			{data:{side:'bottomLeft', handle:'imageStim', alias:category1}, inherit:'Default',  media: {inherit:{type:'exRandom',set:'category1'}}}
		],
		attribute2_bottom: [
			{data:{side:'bottomLeft', handle:'wordStim', alias:attribute2}, location: {top: 30}, css:{color:'white','font-size':'2em'}, media: {inherit:{type:'exRandom',set:'attribute2'}}}
		],
		category2_right: [
			{data:{side:'topRight', handle:'imageStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		attribute1_top : [
			{data:{side:'topRight', handle:'wordStim', alias:attribute1}, location: {top: 30}, css:{color:'white','font-size':'2em'},  media: {inherit:{type:'exRandom',set:'attribute1'}}}
		],
		category2_left : [
			{data:{side:'topLeft', handle:'imageStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
		],
		attribute2_top : [
			{data:{side:'topLeft', handle:'wordStim', alias:attribute2}, location: {top: 30}, css:{color:'white','font-size':'2em'},  media: {inherit:{type:'exRandom',set:'attribute2'}}}
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
			{word: 'Pleasure'}
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
		]
	});

	/*
	 *	Create the Task sequence
	 */
	API.addSequence([
		{
			data: {block:1,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{html:'<div><p style="font-size:24px"><color="FFFAFA">Put your left pinky and index finger on the <b>W</b> and <b>C</b> keys respectively. Put your right pinky and index finger on the <b>O</b> and <b>M</b> keys respectively. Four pairs of categories appear in the corners of the screen. Pairs of items will appear in the middle of the screen. Sort each pair of items to the corner in which their two categories appear. If you make an error, an <font color="#FF0000"><b>X</b></font> will appear until you hit the correct key.</p><br/><p align="center">Press the <b>space bar</b> to begin. </br> (block 1 out of 4)</p></div>'}
					}]
		},
		{ //The presentation trials
			// Repeat 40 times the trial. (10 times each combination)
			mixer: 'random',		//
			data : [
				{
					mixer: 'repeat',
					times: 10,
					data : [
						{inherit: 'goodWhite',data:{block:1}},
						{inherit: 'goodBlack',data:{block:1}},
						{inherit: 'badWhite',data:{block:1}},
						{inherit: 'badBlack',data:{block:1}}
					]
				} // end wrapper
			]
		},
		{
			data: {block:2,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{html:'<div><p style="font-size:24px"><color="FFFAFA">When you are ready, press the <b>space bar</b> to continue the task </br> (block 2 out of 4)</p></div>'}
					}]
		},
		{ //The presentation trials
			// Repeat 40 times the trial. (10 times each combination)
			mixer: 'random',		//
			data : [
				{
					mixer: 'repeat',
					times: 10,
					data : [
						{inherit: 'goodWhite',data:{block:2}},
						{inherit: 'goodBlack',data:{block:2}},
						{inherit: 'badWhite',data:{block:2}},
						{inherit: 'badBlack',data:{block:2}}
					]
				} // end wrapper
			]
		},

		{
			data: {block:3,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{html:'<div><p style="font-size:24px"><color="FFFAFA">When you are ready, press the <b>space bar</b> to continue the task </br> (block 3 out of 4)</p></div>'}
					}]
		},
		{ //The presentation trials
			// Repeat 40 times the trial. (10 times each combination)
			mixer: 'random',		//
			data : [
				{
					mixer: 'repeat',
					times: 10,
					data : [
						{inherit: 'goodWhite',data:{block:3}},
						{inherit: 'goodBlack',data:{block:3}},
						{inherit: 'badWhite',data:{block:3}},
						{inherit: 'badBlack',data:{block:3}}
					]
				} // end wrapper
			]
		},
		{
			data: {block:4,blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{html:'<div><p style="font-size:24px"><color="FFFAFA">Press the <b>space bar</b> for the final round. </br> (block 4 out of 4)</p></div>'}
					}]
		},
		{ //The presentation trials
			// Repeat 40 times the trial. (10 times each combination)
			mixer: 'random',		//
			data : [
				{
					mixer: 'repeat',
					times: 10,
					data : [
						{inherit: 'goodWhite',data:{block:4}},
						{inherit: 'goodBlack',data:{block:4}},
						{inherit: 'badWhite',data:{block:4}},
						{inherit: 'badBlack',data:{block:4}}
					]
				} // end wrapper
			]
		},
		// user feedback- here we will use the computeD function.
		{
			data: {blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [],
			customize: function(){
				/* global console */
				var trial = this;
				console.log('calling scorer');
				var DScoreObj = scorer.computeD();
				var DScore = DScoreObj.DScore;//compute the Dscore
				var FBMsg = DScoreObj.FBMsg;
				console.log('DScore='+DScore+ " FBMsg="+FBMsg);
				var media = {media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> '+FBMsg+'<br>The Score is:'+DScore+'</p></div>'}};
				trial.stimuli.push(media);//show the user feedback
				scorer.dynamicPost({
					score: DScoreObj.DScore,
					feedback: DScoreObj.FBMsg
				});

			}
		},
		{
			data: {blockStart:true},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
			stimuli: [{
				inherit:'Instructions',
				media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" for continue to next task.</p></div>'}
					}]
		}
	]);

	return API.script;
});
