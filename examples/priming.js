require(['app/API','../../examples/dscore/Scorer'], function(API,Scorer) {
	var category1 = 'Pleasent';
	var category2 = 'Unpleasent';

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
	//the source of the images
	API.addSettings('base_url',{
		image : '../examples/images'
	});

	API.addSettings('logger',{
		url : 'google.com',
		pulse : 20
	});
	//the Scorer that compute the user feedback
	Scorer.addSettings('compute',{
		condVar:"trialCategories",
		cond1VarValues: ["Black People/Bad Words","White People/Good Words"], //condition 1
		cond2VarValues: ["Black People/Good Words","White People/Bad Words"], //condition 2
		parcelVar : "parcel",
		parcelValue : ["research"],
		fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
		maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
		minRT : 150, //Below this latency
		maxRT : 5000, //above this
		errorLatency : {use:"false", penalty:600, useForSTD:true}//ignore error respones

	});

	Scorer.addSettings('message',{
		MessageDef: [
			{ cut:'-0.3', message:'Your data suggest an automatic preference for black people over white people.' },//D < -0.3
			{ cut:'0.3', message:'Your data suggest no or slight difference in your preference between white people and black people.' },// -0.3 <= D <= 0.3
			{ cut:'5', message:'Your data suggest an automatic preference for white people over black people.' }// D > 0.3 (and D<=5)
		]

	});

	//Define the basic trial (the prsentation of the images and words)
	API.addTrialSets({
	basicTrial: [{
		data : {error:0},// by default each trial is crrect, this is modified in case of an error
		//Layout defines what will be presented in the trial. It is like a background display.
		layout: [
			{location:{left:15,top:3},media:{word:'key: e'}, css:{color:'black','font-size':'1em'}},
			{location:{left:75,top:3},media:{word:'key: i'},  css:{color:'black','font-size':'1em'}},
			{location:{left:10,top:6},media:{word:category2}, css:{color:'white','font-size':'2em'}},
			{location:{left:70,top:6},media:{word:category1},  css:{color:'white','font-size':'2em'}}
		],
		//Inputs for two possible responses.
		input: [
			{handle:category2,on: 'keypressed', key:'e'},
			{handle:category1,on: 'keypressed', key:'i'},
			{handle:category2,on:'leftTouch',touch:true},//support touch as well
			{handle:category1,on:'rightTouch',touch:true}
		],
		//Set what to do.
		interactions: [
		 {
            propositions: [{type:'begin'}],
            actions: [{type:'showStim',handle:'primingImage'},// display the first stimulus
			{type:'setInput',input:{handle:'primeOut',on:'timeout',duration:300}}]
        },
		{
            propositions: [{type:'inputEquals',value:'primeOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'primingImage'}, // hide the first stimulus
                {type:'showStim',handle:'targetStim'} // and show the second one
				]
        },
		//there are 2 possible responses: "pleasent" and "unpleasent", here we handle with these responses when the user answer
       //mathces the word value (correct response)
		{
			propositions: [{type:'stimEquals',value:'wordValue'}, {type:'inputEquals',value:category1}],
			actions: [
				{type:'setInput',input:{handle:'correctResp', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'stimEquals',value:'wordValue'}, {type:'inputEquals',value:category2}],
			actions: [
				{type:'setInput',input:{handle:'correctResp', on:'timeout',duration:0}}
			]
		},

		{//What to do upon correct response
			//This proposition is true when the presented stimulus has a word value that is equal to the input's handle.
			propositions: [{type:'inputEquals',value:'correctResp'}],
			actions: [
				{type:'removeInput',inputHandle:[category2,category1]},//only one respnse is possible
				//The player sends the value of score to the server, when you call the 'log' action
				{type:'log'}, // here we call the log action. This is because we want to record the latency of this input (the latency of the response)
				{type:'setInput',input:{handle:'showFix', on:'timeout',duration:0}} //End the trial immidiatlly after correct response
			]
		},
		//there are 2 possible responses: "pleasent" and "unpleasent", here we handle with these responses when the user answer
       //dosen't mathc the word value (incorrect response)
		{
			propositions: [{type:'stimEquals',value:'wordValue', negate:true}, {type:'inputEquals',value:category1}],
			actions: [
				{type:'setInput',input:{handle:'errorResp', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'stimEquals',value:'wordValue', negate:true}, {type:'inputEquals',value:category2}],
			actions: [
				{type:'setInput',input:{handle:'errorResp', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'inputEquals',value:'errorResp'}], //What to do upon incorrect response.
			actions: [
				{type:'showStim',handle:'errorFB'}, //show correct feedback
				{type:'setTrialAttr', setter:{error:1}},
				{type:'removeInput',inputHandle:[category2,category1]},// block the option to change the answer or to answer twice
				{type:'setInput',input:{handle:'showFix', on:'timeout',duration:250}} //End the trial in 250ms (show the x until then)
			]
		},
		{
			propositions: [{type:'inputEquals',value:'showFix'}], //What to do when endTrial is called.
			actions: [
				{type:'setTrialAttr',setter:{state:'after'}},
				{type:'hideStim',handle:'targetStim'}, //show blanckScreen
				{type:'hideStim',handle:'errorFB'}, //show blanckScreen
				{type:'showStim',handle:'blanckScreen'}, //show blanckScreen
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:600}}//should be a random number in the interval: [300,900]
			]
		},
		{
			propositions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
			actions: [{type:'endTrial'}]
		}
		]

		}]});

		API.addTrialSets({
	pleasentWhite:[{		//pleasant+white people (condition 1)
			data: {parcel:'research',trialCategories:["Black People/Bad Words","White People/Good Words"]},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		pleasentBlack:[{		//pleasant+black people (condition 2)
			data: {parcel:'research',trialCategories:["Black People/Good Words","White People/Bad Words"]},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],

		unpleasentWhite:[{		//unpleasant+white people (condition 2)
			data: {parcel:'research',trialCategories:["Black People/Good Words","White People/Bad Words"]},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasentBlack:[{		//unpleasant+ black people (condition 1)
			data: {parcel:'research',trialCategories:["Black People/Bad Words","White People/Good Words"]},
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}]
	});

//Create the stimuli
	API.addStimulusSets({
	//These are diffrent types of stimuli.
	//That way we can later create a stimulus object the inherits from this set randomly.

	// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
		Default: [
			{css:{color:'white','font-size':'2em'}}
		],
		targetStimulusA: [	//first catagory of words
			{
				data : {wordValue:category1},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'targetWordsA'}} //Select a word from the media, randomly
			}
			],

		targetStimulusB: [	//the second catagory of words
			{
				data : {wordValue:category2},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'targetWordsB'}}
			}
		],
		errorFB : [//Error feedback stimulus
			{
				data : {handle:'errorFB'},
				size: {height:15,width:15},
				location: {top:70},
				media: {image:'cross.png'} //An image.
			}
		],
		blanckScreen : [//blanckScreen  stimulus (in between the trials) can be used as a fixation point
			{
				data : {handle:'blanckScreen'},
				media: {word:' '}//can be replace with '+'
			}
		],
		//priming stimulus: the catagories of images
		primingImage1 : [
			{

				data : {handle:'primingImage'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images1'}}
			}
			],
			primingImage2 : [
			{
				data : {handle:'primingImage'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images2'}}
			}
			]
	});
	//Create materials (media) for the stimulus
	//Twp categories of images, and two categories of words.
	API.addMediaSets({
		Images1: [
			{image: 'sw01.jpg'},
			{image: 'sw02.jpg'},
			{image: 'sw03.jpg'},
			{image: 'sw04.jpg'},
			{image: 'sw05.jpg'},
			{image: 'sw06.jpg'},
			{image: 'sw07.jpg'},
			{image: 'sw08.jpg'},
			{image: 'sw09.jpg'},
			{image: 'sw10.jpg'},
			{image: 'sw11.jpg'},
			{image: 'sw12.jpg'}
		]
	});
	API.addMediaSets({
		Images2: [
			{image: 'sb01.jpg'},
			{image: 'sb02.jpg'},
			{image: 'sb03.jpg'},
			{image: 'sb04.jpg'},
			{image: 'sb05.jpg'},
			{image: 'sb06.jpg'},
			{image: 'sb07.jpg'},
			{image: 'sb08.jpg'},
			{image: 'sb09.jpg'},
			{image: 'sb10.jpg'},
			{image: 'sb11.jpg'},
			{image: 'sb12.jpg'}
		]
	});
	API.addMediaSets({
		targetWordsA: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Friend'},
			{word: 'Splendid'},
			{word: 'Love'},
			{word: 'Glee'},
			{word: 'Smile'},
			{word: 'Enjoy'},
			{word: 'Delight'},
			{word: 'Beautiful'},
			{word: 'Attractive'},
			{word: 'Likeable'},
			{word: 'Wonderful'}
		]
	});
	API.addMediaSets({
		targetWordsB: [
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'},
			{word: 'Ugly'},
			{word: 'Dirty'},
			{word: 'Stink'},
			{word: 'Noxious'},
			{word: 'Humiliate'},
			{word: 'Annoying'},
			{word: 'Disgusting'},
			{word: 'Offensive'}
		]
	});
	//Define the instructions trial
	API.addTrialSets('inst',{
			input: [
				{handle:'space',on:'space'}, //Will handle a SPACEBAR reponse
				{handle:'space',on:'centerTouch',touch:true}
			],
			interactions: [
				{ // begin trial
					propositions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'All'}] //Show the instructions
				},
				{
					propositions: [{type:'inputEquals',value:'space'}], //What to do when space is pressed
					actions: [
						{type:'hideStim',handle:'All'}, //Hide the instructions
						{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:500}} //In 500ms: end the trial. In the mean time, we get a blank screen.
					]
				},
				{
					propositions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
					actions: [
						{type:'endTrial'} //End the trial
					]
				}
			]
	});

	//Defines the sequence of trials
	API.addSequence([
		{ //Instructions trial
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					//the instructions that will be shown on the screen
					media:{html:'<div><p style="font-size:24px"><color="FFFAFA">Put your middle or index fingers on the <b>E</b> key of the keyboard, and the <b>I</b> key as well. <br/> Words and photos will appear one after another. Ignore the photos and categorize the words as pleasant or unpleasant.<br/><br/>When the word belongs to the catagory "Unpleasant", press the <b>E</b> key. <br/> when the word belongs to the category "Pleasant", press the <b>I</b> key.</br></br>If you make an error, an X will appear.</br>This is a timed sorting task. <b>GO AS FAST AS YOU CAN</b> while making as few mistakes as possible.<br>This task will take about 5 minutes to complete.<br> press on "space" to begin <br><br>[Round 1 of 3]</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 60 times the trial. (15 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 15,
				data : [
					{inherit: 'pleasentWhite'},
					{inherit: 'pleasentBlack'},
					{inherit: 'unpleasentWhite'},
					{inherit: 'unpleasentBlack'},
				]
				} // end wrapper
			]
		},
		{ //Instructions trial, second round
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Press "space" to continue with the same task.<br/><br/>Please try to challenge yourself to be as fast as you can without making mistakes<br/><br/>[Round 2 of 3].</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 60 times the trial. (15 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 15,
				data : [
				{inherit: 'pleasentWhite'},
					{inherit: 'pleasentBlack'},
					{inherit: 'unpleasentWhite'},
					{inherit: 'unpleasentBlack'},
				]
				} // end wrapper
			]
		},

		{ //Instructions trial, third round
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Press "space" for the last round.<br/><br/>[Round 3 of 3].</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 60 times the trial. (15 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 15,
				data : [
				    {inherit: 'pleasentWhite'},
					{inherit: 'pleasentBlack'},
					{inherit: 'unpleasentWhite'},
					{inherit: 'unpleasentBlack'},
				]
				} // end wrapper
			]
		},
		// user feedback- here we will use the computeD function.
		{
			inherit: "inst",
			stimuli: [],
			customize: function(){
				var trial = this;
				console.log('calling Scorer');
				var DScore = Scorer.computeD();
				var FBMsg = Scorer.getFBMsg(DScore);
				console.log(FBMsg);
				console.log(DScore);
				var media = {media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> '+FBMsg+'<br>The Score is:'+DScore+'</p></div>'}};
				trial.stimuli.push(media);

			}

		},

		{ //Instructions trial, the end of the task, instruction what to do next
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" for continue to next task.</p></div>'}
				}
			]
		}
	]);
});
