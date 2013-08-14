
//This example creates a priming task.
require(['app/API'], function(API) {

//Set the size of the screen
	API.addSettings('canvas',{
		maxWidth: 800,
		proportions : 0.8,
		//Change the colors to allow better presentation of the colored stimuli.
		background: 'white',
		canvasBackground: 'green',
		borderColor: 'green'
	});
//Set url for logging
	API.addSettings('logger',{
		url : '/implicit/PiPlayer',
		pulse: 8
	});
//Set base url for images (from where to use the images for the study)
	API.addSettings('base_url', {image : "/pip/images"});
//Set what to do at the end of the task.
	API.addSettings('hooks',{
		endTask: function(){
		//There is a form in the jsp file that includes this file, and here we submit it, only to get to the next task.
		document.form1.submit_system.click();
		}
	});
	//Create the stimuli
	API.addStimulusSets({
	//These are diffrent types of stimuli.
	//That way we can later create a stimulus object the inherits from this set randomly.
	//first catagory of words
		targetStimulusA: [
			{
				data : {wordValue:'pleasant'},
				css:{color:'white','font-size':'2em'},
				media: {inherit:{type:'exRandom',set:'targetWordsA'}} //Select a word from the media, randomly
			}
			],
		//the second catagory of words
		targetStimulusB: [
			{
				data : {wordValue:'unpleasant'},
				css:{color:'white','font-size':'2em'},
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


		//blanckScreen  stimulus (in between the trials)
		blanckScreen : [
			{
				data : {handle:'blanckScreen'},
				css:{color:'green','font-size':'2em'},
				media: {word:'.'}//the dot is the same color of the screen, cant be see
			}
		],
		//priming stimulus: the five catagories of images
		primingImage1 : [
			{
				data : {handle:'primingImage'},
				css:{color:'black','font-size':'2em'},
				media: {inherit:{type:'exRandom',set:'Images1'}}
			}
			],
			primingImage2 : [
			{
				data : {handle:'primingImage'},
				css:{color:'black','font-size':'2em'},
				media: {inherit:{type:'exRandom',set:'Images2'}}
			}
			],
			primingImage3 : [
			{
				data : {handle:'primingImage'},
				css:{color:'black','font-size':'2em'},
				media: {inherit:{type:'exRandom',set:'Images3'}}
			}
			],
			primingImage4 : [
			{
				data : {handle:'primingImage'},
				css:{color:'black','font-size':'2em'},
				media: {inherit:{type:'exRandom',set:'Images4'}}
			}
			],
			primingImage5 : [
				{
				data : {handle:'primingImage'},
				css:{color:'black','font-size':'2em'},
				media: {inherit:{type:'exRandom',set:'Images5'}}
			}
		]
	});
	//Create materials (media) for the stimulus
	//Five catagories of priming images, and two cayagories of words.
	API.addMediaSets({
		Images1: [
			{image: 'd19.jpg'},
			{image: 'd19big.jpg'}
		]
	});
	API.addMediaSets({
		Images2: [
			{image: 'd210big.jpg'},
			{image: 'd210.jpg'}
		]
	});
	API.addMediaSets({
		Images3: [
			{image: 'd222.jpg'},
			{image: 'd222big.jpg'}
		]
	});
	API.addMediaSets({
		Images4: [
			{image: 'd223.jpg'},
			{image: 'd223big.jpg'}
		]
	});
	API.addMediaSets({
		Images5: [
			{image: 'd224.jpg'},
			{image: 'd224big.jpg'}
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
	//Define the basic trial (the prsentation of the images and words)
	API.addTrialSets({
	basicTrial: [{
		data : {input1:'',input2:''},
		//Layout defines what will be presented in the trial. It is like a background display.
		layout: [
			//{location:{left:15,top:3},media:{word:'key: e'}, css:{color:'black','font-size':'1em'}},
			//{location:{left:75,top:3},media:{word:'key: i'},  css:{color:'black','font-size':'1em'}},
			{location:{left:10,top:6},media:{word:'unpleasant'}, css:{color:'white','font-size':'2em'}},
			{location:{left:70,top:6},media:{word:'pleasant'},  css:{color:'white','font-size':'2em'}}
		],
		//Inputs for two possible responses.
		input: [
			//{handle:'unpleasant',on: 'keypressed', key:'e'},
			//{handle:'pleasant',on: 'keypressed', key:'i'}
			{handle:'unpleasant',on:'leftTouch'},
			{handle:'pleasant',on:'rightTouch'}
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
				{type:'setTrialAttr',setter:{input1:'pleasant',input2:'unpleasant'}},
                {type:'showStim',handle:'targetStim'} // and show the second one
				]
        },
		{
			propositions: [{type:'stimEquals',value:'wordValue'}, {type:'trialEquals',value:'input1'}],
			actions: [
				{type:'setInput',input:{handle:'correctResp', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'stimEquals',value:'wordValue'}, {type:'trialEquals',value:'input2'}],
			actions: [
				{type:'setInput',input:{handle:'correctResp', on:'timeout',duration:0}}
			]
		},
		{//What to do upon correct response
		//the first proposition: check if the word value is the same as what we defined
		//the second proposition: dont remove the word upon timeout, wait until reaction
			propositions: [{type:'inputEquals',value:'correctResp'}],
			//This proposition is true when the presented stimulus has a word value that is equal to the input's handle.
			//Make sure you understand how this works because you will probably use something like this for most of your tasks.
			actions: [
				{type:'setTrialAttr',setter:{score:'1'}},
				{type:'setTrialAttr',setter:{input1:'',input2:''}},
				//The player sends the value of score to the server, when you call the 'log' action
				{type:'log'}, //Oh, here we call the log action. This is because we want to record the latency of this input (the latency of the response)
				{type:'setInput',input:{handle:'showFix', on:'timeout',duration:0}} //End the trial immidiatlly after correct response
			]
		},
		{
			propositions: [{type:'stimEquals',value:'wordValue', negate:true}, {type:'trialEquals',value:'input1'}],
			actions: [
				{type:'setInput',input:{handle:'errorResp', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'stimEquals',value:'wordValue', negate:true}, {type:'trialEquals',value:'input2'}],
			actions: [
				{type:'setInput',input:{handle:'errorResp', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'inputEquals',value:'errorResp'}], //What to do upon incorrect response.
			actions: [
				{type:'showStim',handle:'errorFB'}, //show correct feedback
				//supose to block the option to change the answer or to answer twice
				{type:'setTrialAttr',setter:{score:'0'}},
				{type:'setTrialAttr',setter:{input1:'',input2:''}},
				{type:'log'}, //Here we call the log action. This is because we want to record the latency of this input (the latency of the response)
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
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:600}}
			]
		},
		{
			propositions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
			actions: [{type:'endTrial'}]
		}
		]

		}],
		pleasent1:[{		//pleasant+priming1
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		pleasent2:[{		//pleasant+priming2
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		pleasent3:[{		//pleasant+priming3
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage3', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		pleasent4:[{		//pleasant+priming4
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage4', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		pleasent5:[{		//pleasant+priming5
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusA', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage5', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			]
		}],
		unpleasent1:[{		//unpleasant+priming1
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasent2:[{		//unpleasant+priming2
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasent3:[{		//unpleasant+priming3
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage3', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasent4:[{		//unpleasant+priming4
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage4', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}],
		unpleasent5:[{		//unpleasant+priming5
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulusB', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage5', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'errorFB'},
			{ inherit: 'blanckScreen'}
			]
		}]
	});
	//Define the instructions trial
	API.addTrialSets('inst',{
			input: [
				{handle:'space',on:'leftTouch'}, //Will handle a SPACEBAR reponse
				{handle:'space',on:'rightTouch'}
			],
			interactions: [
				{ // begin trial
					propositions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'instStim'}] //Show the instructions
				},
				{
					propositions: [{type:'inputEquals',value:'space'}], //What to do when space is pressed
					actions: [
						{type:'hideStim',handle:'instStim'}, //Hide the instructions
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

	//Defines the sequence of trials next
	API.addSequence([
		{ //Instructions trial
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					//the instructions that will be shown on the screen
					media:{html:'<div><p style="font-size:26px"><color="FFFAFA">Put your middle or index fingers on the <b>left side</b> of the screen, and the <b>right side</b> as well. <br/> Words and photos will appear one after another. Ignore the photos and categorize the words as pleasant or unpleasant.<br/><br/>When the word belongs to the catagory "Unpleasant", touch the <b>left side</b> ; when the word belongs to the category "Pleasant", touch the <b>right side</b> .</br></br>If you make an error, an X will appear.</br>This is a timeed sorting task. <b>GO AS FAST AS YOU CAN</b> while making as few mistakes as possible.<br>This task will take about 5 minutes to complete.<br> touch the screen to begin <br><br>[Round 1 of 3]</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 60 times the trial. (6 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 6,
				data : [
					{inherit: 'pleasent1'},
					{inherit: 'pleasent2'},
					{inherit: 'pleasent3'},
					{inherit: 'pleasent4'},
					{inherit: 'pleasent5'},
					{inherit: 'unpleasent1'},
					{inherit: 'unpleasent2'},
					{inherit: 'unpleasent3'},
					{inherit: 'unpleasent4'},
					{inherit: 'unpleasent5'},
				]
				} // end wrapper
			]
		},
		{ //Instructions trial, second round
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Touch the screen to continue with the same task.<br/><br/>Please try to challenge yourself to be as fast as you can without making mistakes<br/><br/>[Round 2 of 3].</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 60 times the trial. (6 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 6,
				data : [
					{inherit: 'pleasent1'},
					{inherit: 'pleasent2'},
					{inherit: 'pleasent3'},
					{inherit: 'pleasent4'},
					{inherit: 'pleasent5'},
					{inherit: 'unpleasent1'},
					{inherit: 'unpleasent2'},
					{inherit: 'unpleasent3'},
					{inherit: 'unpleasent4'},
					{inherit: 'unpleasent5'},
				]
				} // end wrapper
			]
		},

		{ //Instructions trial, third round
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Touch the screen for the last round.<br/><br/>[Round 3 of 3].</p></div>'}
				}
			]
		},
		{ //The presentation trials
			// Repeat 60 times the trial. (6 times each comination)
			mixer: 'random',		//
			data : [{
				mixer: 'repeat',
				times: 6,
				data : [
					{inherit: 'pleasent1'},
					{inherit: 'pleasent2'},
					{inherit: 'pleasent3'},
					{inherit: 'pleasent4'},
					{inherit: 'pleasent5'},
					{inherit: 'unpleasent1'},
					{inherit: 'unpleasent2'},
					{inherit: 'unpleasent3'},
					{inherit: 'unpleasent4'},
					{inherit: 'unpleasent5'},
				]
				} // end wrapper
			]
		},
		{ //Instructions trial, the end of the task, instruction what to do next
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Touch the screen for continue to next task.</p></div>'}
				}
			]
		},
		{
			// Repeat only one time.
			mixer: 'repeat',
			times: 1
		}
	]);

	API.play();
});





