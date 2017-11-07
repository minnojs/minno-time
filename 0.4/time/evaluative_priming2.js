// You can find the images used for this task [here](https://github.com/minnojs/minno-time/tree/gh-pages/images).
//
// ** This example is intended for educational purposes only. If you want to actually use this type of task, please see the [extensions page](https://app-prod-03.implicit.harvard.edu/implicit/common/all/js/pip/piscripts/ydocs/dist/index.html). **
define(['pipAPI','pipScorer'], function(APIConstructor,Scorer) {

	var API = new APIConstructor();
	var scorer = new Scorer();
	var category1 = 'Pleasant';
	var category2 = 'Unpleasant';

	//Set the size of the screen
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
		url : '/implicit/PiPlayerApplet',
		pulse : 20,

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
	//the scorer that compute the user feedback
	scorer.addSettings('compute',{
		ErrorVar:'score',
		condVar:"condition",
		parcelVar : "parcel",
		fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
		maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
		minRT : 150, //Below this latency
		maxRT : 5000, //above this
		errorLatency : {use:"false", penalty:600, useForSTD:true}//ignore error respones
	});

	//Define the basic trial (the prsentation of the images and words)
	API.addTrialSets({
	basicTrial: [{
		data : {error:0},// by default each trial is crrect, this is modified in case of an error
		//Layout defines what will be presented in the trial. It is like a background display.
		layout: [
			{location:{left:15,top:3},media:{word:'key: e'}, css:{color:'black','font-size':'1em'}},
			{location:{right:15,top:3},media:{word:'key: i'},  css:{color:'black','font-size':'1em'}},
			{location:{left:10,top:6},media:{word:category2}, css:{color:'white','font-size':'2em'}},
			{location:{right:10,top:6},media:{word:category1},  css:{color:'white','font-size':'2em'}}
		],
		input: [
			{handle:'enter',on:'enter'} //'enter' to skip the current block
		],
		//Set what to do.
		interactions: [
		{
			conditions: [{type:'begin'}],
			actions: [
				{type:'showStim',handle:'primingImage'},// display the first stimulus
				{type:'setInput',input:{handle:'primeOut',on:'timeout',duration:300}}
			]
		},
		// show target stim
		{
			conditions: [{type:'inputEquals',value:'primeOut'}], // on time out
			actions: [
				{type:'hideStim',handle:'primingImage'}, // hide the first stimulus
				{type:'showStim',handle:'targetStim'}, // and show the second one
				//Set the possible key inputs.
				{type:'setInput',input:{handle:category2,on: 'keypressed', key:'e'}},
				{type:'setInput',input:{handle:category1,on: 'keypressed', key:'i'}},
				{type:'setInput',input:{handle:category2,on:'leftTouch',touch:true}},
				{type:'setInput',input:{handle:category1,on:'rightTouch',touch:true}},
				{type:'setInput',input:{handle:'targetOut',on:'timeout',duration:1500}}
			]
		},
		// on time out
		{
			conditions: [{type:'inputEquals',value:'targetOut'}],
			actions: [
				{type:'removeInput',handle	:[category2,category1]},//only one respnse is possible
				{type:'hideStim',handle:'targetStim'}, // hide the stimulus
				{type:'showStim',handle:'warning'}, // and show the warning
				{type:'setInput',input:{handle:'showFix', on:'timeout',duration:250}} //End the trial in 250ms (show the warning until then)
			]
		},
		// there are 2 possible responses: "pleasant" and "unpleasant", here we handle these responses when the user answers
		// matches the word value (correct response)
		{
			conditions: [{type:'inputEqualsStim',property:'wordCategory'}],
			actions: [
				{type:'log'}, // here we call the log action. This is because we want to record the latency of this input (the latency of the response)
				{type:'removeInput',handle	:[category2,category1,'targetOut']}, //only one response is possible
				{type:'trigger', handle:'showFix'}//End the trial immidiatlly after correct response
			]
		},
				// there are 2 possible responses: "pleasant" and "unpleasant", here we handle with these responses when the user answer
				// doesn't match the word value (incorrect response)
				//this conditions are true only after incorrect response
				// handle incorrect response.
				//this conditions are true only after incorrect response
		{
			conditions: [
				{type:'inputEqualsStim',property:'wordCategory', negate:true},
				{type:'inputEquals',value: [category1, category2]}
			], // This is a category action - as opposed to some timeout.
			actions: [
				{type:'setTrialAttr', setter:{score:1}},
				{type:'log'}, // here we call the log action. This is because we want to record the latency of this input (the latency of the response)
				{type:'showStim',handle:'errorFB'}, //show error feedback
				{type:'removeInput',handle:[category2,category1,'targetOut']},// block the option to change the answer or to answer twice
				{type:'setInput',input:{handle:'showFix', on:'timeout',duration:250}} //End the trial in 250ms (show the x until then)
			]
		},
		{
			conditions: [{type:'inputEquals',value:'showFix'}], //What to do when endTrial is called.
			actions: [
				{type:'hideStim',handle:'All'},
				{type:'showStim',handle:'blankScreen'}, //show blankScreen
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:{min:300, max: 900}}} // randomly pick from within a range
			]
		},
		// skip block -> if you press 'enter' you will skip the current block.
		{
			conditions: [{type:'inputEquals',value:'enter'}],
			actions: [
				{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
				{type:'endTrial'}
				]
		},
		{
			conditions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
			actions: [{type:'endTrial'}]
		}
			] // end interactions
		}] // end basic trial
	}); // end trialsets

	API.addTrialSets({
		pleasantOldWhite:[{		//pleasant+white old people (condition 1)
			data: {parcel:'second', condition: "Old white People / Pleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
				{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
				{ inherit: {set: 'primingImage3', type:'exRandom'}, data : {handle:'primingImage'} },
				{ inherit: 'errorFB'},
				{ inherit: 'warning'},
				{ inherit: 'blanckScreen'}
			]
		}],
		pleasantOldBlack:[{		//pleasant+black old people (condition 2)
			data: {parcel:'first',condition: "Old black People / Pleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
				{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
				{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
				{ inherit: 'errorFB'},
				{ inherit: 'warning'},
				{ inherit: 'blanckScreen'}
			]
		}],
		pleasantYoungWhite:[{		//pleasant+white young people (condition 3)
			data: {parcel:'fourth',condition: "Young white People / Pleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
				{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
				{ inherit: {set: 'primingImage4', type:'exRandom'}, data : {handle:'primingImage'} },
				{ inherit: 'errorFB'},
				{ inherit: 'warning'},
				{ inherit: 'blanckScreen'}
			]
		}],
		pleasantYoungBlack:[{		//pleasant+black young people (condition 4)
			data: {parcel:'third',condition: "Young black People / Pleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
				{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
				{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
				{ inherit: 'errorFB'},
				{ inherit: 'warning'},
				{ inherit: 'blanckScreen'}
			]
		}],


		unpleasantOldWhite:[{		//unpleasant+white old people (condition 1)
			data: {parcel:'second',condition: "Old white People / Unpleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage3', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'warning'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasantOldBlack:[{		//unpleasant+ black old people (condition 2)
			data: {parcel:'first',condition: "Old black People / Unpleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'warning'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasantYoungWhite:[{		//unpleasant+white young people (condition 3)
			data: {parcel:'fourth',condition: "Young white People / Unpleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage4', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'warning'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasantYoungBlack:[{		//unpleasant+ black young people (condition 4)
			data: {parcel:'third',condition: "Young black People / Unpleasant"},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'warning'},
			{ inherit: 'blanckScreen'}
			]
		}]
	});

//Create the stimuli
	API.addStimulusSets({

	// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
		Default: [
			{css:{color:'white','font-size':'2em'}}
		],

	//first catagory of words
		targetStimulusA: [
			{
				data : {wordCategory:category1, alias:category1},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'targetWordsA'}} //Select a word from the media, randomly
			}
			],
		//the second catagory of words
		targetStimulusB: [
			{
				data : {wordCategory:category2, alias:category2},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'targetWordsB'}}
			}

		],
		//Error feedback stimulus
		errorFB : [
			{
				data : {handle:'errorFB'},
				size: {height:15,width:15},
				location: {top:70},
				media: {image:'cross.png'} //An image.
			}
		],


		//blanckScreen  stimulus (in between the trials) can be used as a fixation point
		blanckScreen : [
			{
				data : {handle:'blanckScreen'},
				css:{color:'green','font-size':'2em'},
				media: {word:' '}//can be replace with '+'
			}
		],
		//warning "Response Faster!"
		warning : [
			{
				data : {handle:'warning'},
				css:{color:'red','font-size':'3em'},
				media: {word:'Response Faster!'}
			}
		],
		//priming stimulus: the 4 catagories of images
			primingImage1 : [
			{

				data : {handle:'primingImage',alias:'oldBlack'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images1'}}
			}
			],
			primingImage2 : [
			{
				data : {handle:'primingImage',alias:'youngBlack'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images2'}}
			}
			],
			primingImage3 : [
			{

				data : {handle:'primingImage',alias:'oldWhite'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images3'}}
			}
			],
			primingImage4 : [
			{

				data : {handle:'primingImage',alias:'youngWhite'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images4'}}
			}
			]

	});
	//Create materials (media) for the stimulus
	//four categories of images, and two categories of words.
	API.addMediaSets({
		Images1: [
			{image: 'ybblackold1.jpg'},
			{image: 'ybblackold2.jpg'},
			{image: 'ybblackold3.jpg'},
			{image: 'ybblackold4.jpg'},
			{image: 'ybblackold5.jpg'},
			{image: 'ybblackold6.jpg'},
			{image: 'ybblackold7.jpg'},
			{image: 'ybblackold8.jpg'},
			{image: 'ybblackold9.jpg'},
			{image: 'ybblackold10.jpg'},
			{image: 'ybblackold11.jpg'},
			{image: 'ybblackold12.jpg'}
		]
	});
	API.addMediaSets({
		Images2: [
			{image: 'ybblackyng1.jpg'},
			{image: 'ybblackyng2.jpg'},
			{image: 'ybblackyng3.jpg'},
			{image: 'ybblackyng4.jpg'},
			{image: 'ybblackyng5.jpg'},
			{image: 'ybblackyng6.jpg'},
			{image: 'ybblackyng7.jpg'},
			{image: 'ybblackyng8.jpg'},
			{image: 'ybblackyng9.jpg'},
			{image: 'ybblackyng10.jpg'},
			{image: 'ybblackyng11.jpg'},
			{image: 'ybblackyng12.jpg'}
		]
	});
	API.addMediaSets({
		Images3: [
			{image: 'ybwhiteold1.jpg'},
			{image: 'ybwhiteold2.jpg'},
			{image: 'ybwhiteold3.jpg'},
			{image: 'ybwhiteold4.jpg'},
			{image: 'ybwhiteold5.jpg'},
			{image: 'ybwhiteold6.jpg'},
			{image: 'ybwhiteold7.jpg'},
			{image: 'ybwhiteold8.jpg'},
			{image: 'ybwhiteold9.jpg'},
			{image: 'ybwhiteold10.jpg'},
			{image: 'ybwhiteold11.jpg'},
			{image: 'ybwhiteold12.jpg'}
		]
	});
	API.addMediaSets({
		Images4: [
			{image: 'ybwhiteyng1.jpg'},
			{image: 'ybwhiteyng2.jpg'},
			{image: 'ybwhiteyng3.jpg'},
			{image: 'ybwhiteyng4.jpg'},
			{image: 'ybwhiteyng5.jpg'},
			{image: 'ybwhiteyng6.jpg'},
			{image: 'ybwhiteyng7.jpg'},
			{image: 'ybwhiteyng8.jpg'},
			{image: 'ybwhiteyng9.jpg'},
			{image: 'ybwhiteyng10.jpg'},
			{image: 'ybwhiteyng11.jpg'},
			{image: 'ybwhiteyng12.jpg'}
		]
	});
	API.addMediaSets({
		targetWordsA: [
			{word: ' Nice'},
			{word: 'Friendly'},
			{word: 'Considerate'},
			{word: 'Gentle'},
			{word: 'Gracious'},
			{word: 'Sympathetic'},
			{word: 'Generous'},
			{word: 'Warm'},
			{word: 'Kind'},
			{word: 'Cheerful'},
			{word: 'Beautiful'},
			{word: 'Attractive'},
			{word: 'Likeable'},
			{word: 'Wonderful'}
		]
	});

	API.addMediaSets({
		targetWordsB: [
			{word: 'Nasty'},
			{word: 'Ugly'},
			{word: 'Stupid'},
			{word: 'Evil'},
			{word: 'Dirty'},
			{word: 'Awful'},
			{word: 'Offensive'},
			{word: 'Dirty'},
			{word: 'Annoying'},
			{word: 'Vicious'},
			{word: 'Rude'},
			{word: 'Irritating'},
			{word: 'Disgusting'},
			{word: 'Cruel'}
		]
	});
	//Define the instructions trial
	API.addTrialSets('inst',{
			input: [
				{handle:'space',on:'space'}, //Will handle a SPACEBAR reponse
				{handle: 'enter', on:'enter'},
				{handle:'space',on:'centerTouch',touch:true}//support touch
			],
			interactions: [
				{ // begin trial
					conditions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'All'}] //Show the instructions
				},
				{
					conditions: [{type:'inputEquals',value:'space'}], //What to do when space is pressed
					actions: [
						{type:'hideStim',handle:'All'}, //Hide the instructions
						{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:500}} //In 500ms: end the trial. In the mean time, we get a blank screen.
					]
				},
					// skip block -> if you press 'enter' you will skip the current block.
				{
					conditions: [{type:'inputEquals',value:'enter'}],
					actions: [
						{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
						{type:'endTrial'}
					]
				},
				{
					conditions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
					actions: [
						{type:'endTrial'} //End the trial
					]
				}
			]
	});

	//Defines the sequence of trials next
	API.addSequence([
		{ //Instructions trial
			data: {blockStart:true},
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					//the instructions that will be shown on the screen
					media:{html:'<div><p style="font-size:24px"><color="FFFAFA">Put your middle or index fingers on the <b>E</b> key of the keyboard, and the <b>I</b> key as well. <br/> Words and photos will appear one after another. Ignore the photos and categorize the words as pleasant or unpleasant.<br/><br/>When the word belongs to the catagory "Unpleasant", press the <b>E</b> key. ; when the word belongs to the category "Pleasant", press the <b>I</b> key.</br></br>If you make an error, an X will appear.</br>This is a timed sorting task. <b>GO AS FAST AS YOU CAN</b> while making as few mistakes as possible.<br>This task will take about 5 minutes to complete.<br> press on "space" to begin <br><br>[Round 1 of 3]</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 64 times the trial. (8 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 8,
				data : [
					{inherit: 'pleasantOldWhite',data:{block:0}},
					{inherit: 'pleasantYoungWhite',data:{block:0}},
					{inherit: 'pleasantOldBlack',data:{block:0}},
					{inherit: 'pleasantYoungBlack',data:{block:0}},
					{inherit: 'unpleasantOldWhite',data:{block:0}},
					{inherit: 'unpleasantYoungWhite',data:{block:0}},
					{inherit: 'unpleasantOldBlack',data:{block:0}},
					{inherit: 'unpleasantYoungBlack',data:{block:0}}
				]
				} // end wrapper
			]
		},
		{ //Instructions trial, second round
			data: {blockStart:true},
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Press "space" to continue with the same task.<br/><br/>Please try to challenge yourself to be as fast as you can without making mistakes<br/><br/>[Round 2 of 3].</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 64 times the trial. (8 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 8,
				data : [
						{inherit: 'pleasantOldWhite',data:{block:1}},
					{inherit: 'pleasantYoungWhite',data:{block:1}},
					{inherit: 'pleasantOldBlack',data:{block:1}},
					{inherit: 'pleasantYoungBlack',data:{block:1}},
					{inherit: 'unpleasantOldWhite',data:{block:1}},
					{inherit: 'unpleasantYoungWhite',data:{block:1}},
					{inherit: 'unpleasantOldBlack',data:{block:1}},
					{inherit: 'unpleasantYoungBlack',data:{block:1}}
				]
				} // end wrapper
			]
		},

		{ //Instructions trial, third round
			data: {blockStart:true},
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Press "space" for the last round.<br/><br/>[Round 3 of 3].</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 64 times the trial. (8 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 8,
				data : [
					{inherit: 'pleasantOldWhite',data:{block:2}},
					{inherit: 'pleasantYoungWhite',data:{block:2}},
					{inherit: 'pleasantOldBlack',data:{block:2}},
					{inherit: 'pleasantYoungBlack',data:{block:2}},
					{inherit: 'unpleasantOldWhite',data:{block:2}},
					{inherit: 'unpleasantYoungWhite',data:{block:2}},
					{inherit: 'unpleasantOldBlack',data:{block:2}},
					{inherit: 'unpleasantYoungBlack',data:{block:2}}
				]
				} // end wrapper
			]
		},
		// user feedback- here we will use the computeD function.
		{
			data: {blockStart:true},
			inherit: "inst",
			stimuli: [],
			customize: function(){
				var trial = this;
				var DScoreObj;

				//////first call to score//////
				scorer.addSettings('compute',{
					parcelValue : ['first'],
					cond1VarValues: ["Old black People / Unpleasant"], //condition 1
					cond2VarValues: ["Old black People / Pleasant"] //condition 2
				});
				scorer.addSettings('message',{
					MessageDef: [
						{ cut:'-0.2', message:'Your data suggest an Automatic negative attitude toward old black people' },//D < -0.2
						{ cut:'0.2', message:'Your data suggest Neutral automatic attitude toward old black people' },// -0.2 <= D <= 0.2
						{ cut:'5', message:'Your data suggest an Automatic positive attitude toward old black people' }// D > 0.2 (and D<=2)
					]
				});

				DScoreObj = scorer.computeD();
				var media1 = DScoreObj.FBMsg + ' The Score is: ' + DScoreObj.DScore;
				scorer.dynamicPost({
					score1: DScoreObj.DScore,
					feedback1: DScoreObj.FBMsg
				});


				//////second call to score//////
				scorer.addSettings('compute',{
					parcelValue : ['second'],
					cond1VarValues: ["Old white People / Unpleasant"], //condition 1
					cond2VarValues: ["Old white People / Pleasant"] //condition 2
				});
				scorer.addSettings('message',{
					MessageDef: [
						{ cut:'-0.2', message:'Your data suggest an Automatic negative attitude toward old white people' },//D < -0.2
						{ cut:'0.2', message:'Your data suggest Neutral automatic attitude toward old white people' },// -0.2 <= D <= 0.2
						{ cut:'5', message:'Your data suggest an Automatic positive attitude toward old white people' }// D > 0.2 (and D<=2)
					]
				});

				DScoreObj = scorer.computeD();
				var media2 = DScoreObj.FBMsg+' The Score is: '+DScoreObj.DScore;
				scorer.dynamicPost({
					score1: DScoreObj.DScore,
					feedback1: DScoreObj.FBMsg
				});

				//////third call to score//////
				scorer.addSettings('compute',{
					parcelValue : ['third'],
					cond1VarValues: ["Young black People / Unpleasant"], //condition 1
					cond2VarValues: ["Young black People / Pleasant"] //condition 2

				});
				scorer.addSettings('message',{
					MessageDef: [
						{ cut:'-0.2', message:'Your data suggest an Automatic negative attitude young black people' },//D < -0.2
						{ cut:'0.2', message:'Your data suggest Neutral automatic attitude toward young black people' },// -0.2 <= D <= 0.2
						{ cut:'5', message:'Your data suggest an Automatic positive attitude toward young black people' }// D > 0.2 (and D<=2)
					]
				});

				DScoreObj = scorer.computeD();
				var media3 = DScoreObj.FBMsg+' The Score is: '+DScoreObj.DScore;
				scorer.dynamicPost({
					score1: DScoreObj.DScore,
					feedback1: DScoreObj.FBMsg
				});

				//////fourth call to score//////
				scorer.addSettings('compute',{
					parcelValue : ['fourth'],
					cond1VarValues: ["Young white People / Unpleasant"], //condition 1
					cond2VarValues: ["Young white People / Pleasant"] //condition 2

				});
				scorer.addSettings('message',{
					MessageDef: [
						{ cut:'-0.2', message:'Your data suggest an Automatic negative attitude young white people' },//D < -0.2
						{ cut:'0.2', message:'Your data suggest Neutral automatic attitude toward young white people' },// -0.2 <= D <= 0.2
						{ cut:'5', message:'Your data suggest an Automatic positive attitude toward young white people' }// D > 0.2 (and D<=2)
					]
				});

				DScoreObj = scorer.computeD();
				var media4 = DScoreObj.FBMsg+' The Score is: '+DScoreObj.DScore;
				scorer.dynamicPost({
					score1: DScoreObj.DScore,
					feedback1: DScoreObj.FBMsg
				});

				var media = {css:{color:'black'},media:{html:'<h1><div><p style="font-size:24px"><color="#FFFAFA"> '+media1+ '<br/>'+media2+ '<br/>'+media3+ '<br/>'+media4+'</p></div>'}};
				trial.stimuli.push(media);
			}
		},
		{ //Instructions trial, the end of the task, instruction what to do next
			data: {blockStart:true},
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" for continue to next task.</p></div>'}
				}
			]
		}
	]);

	return API.script;
});
