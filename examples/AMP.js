//This example creates an amp task.
require(['app/API'], function(API) {
	var category1 = 'Pleasent';
	var category2 = 'Unpleasent';
	//a Scorer for the AMP
	var AMPScorer = {
						prime1: 'White',
						prime2: 'Black',
						counter: { prime1: {category1: 0, category2: 0} , prime2: {category1: 0, category2: 0}}
					};
	//count the resposnes of the users
	function inc_prime1_category1(){
		AMPScorer.counter.prime1.category1 = AMPScorer.counter.prime1.category1+1;
		}
	function inc_prime1_category2(){
		AMPScorer.counter.prime1.category2 = AMPScorer.counter.prime1.category2+1;
		}
	function inc_prime2_category1(){
		AMPScorer.counter.prime2.category1 = AMPScorer.counter.prime2.category1+1;
		}
	function inc_prime2_category2(){
		AMPScorer.counter.prime2.category2 = AMPScorer.counter.prime2.category2+1;
		}

	//compute the AMP score, according to the logs.
	function computeAMPScore(scoreArray){
		for(var i=3; i<scoreArray.length; i++){// the first 3 is the example images, go over all the other logs.
			if(scoreArray[i].responseHandle == category1){ //pleasent response
				if(scoreArray[i].stimuli[1] == "primingImage1"){ //the image is from the first category
					inc_prime1_category1();
				}
				else{
					inc_prime2_category1(); //the image is from the second category
				}
			}
			else{// unpleasent response
				if(scoreArray[i].stimuli[1] == "primingImage1"){ //the image is from the first category
					inc_prime1_category2();
				}
				else{
					inc_prime2_category2(); //the image is from the second category
				}

			}
		}

	}
	//Set the size of the screen
	API.addSettings('canvas',{
		maxWidth: 800,
		proportions : 0.8,
		//Change the colors to allow better presentation of the colored stimuli.
		background: 'white',
		borderWidth: 4,
		canvasBackground: 'green',
		borderColor: 'black'
	});
	// from where to take the images
	API.addSettings('base_url',{
		image : '../examples/images'
	});

	API.addSettings('logger',{
		url : 'google.com',
		pulse : 20
	});

	//Define the basic trial (the prsentation of the images and words)
	API.addTrialSets({
	basicTrial: [{
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
            actions: [{type:'showStim',handle:'primingImage'},// display the first stimulus=priming image
			{type:'setInput',input:{handle:'primeOut',on:'timeout',duration:100}}] //for 100 ms
        },
		{
            propositions: [{type:'inputEquals',value:'primeOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'primingImage'}, // hide the first stimulus
				{type:'showStim',handle:'blanckScreen'}, // and show the second one=the blanck screen
				{type:'setInput',input:{handle:'blanckOut',on:'timeout',duration:100}}
				]
        },
		{
            propositions: [{type:'inputEquals',value:'blanckOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'blanckScreen'}, // hide the blanck screen
				{type:'showStim',handle:'targetStim'}, // and show the letter
				{type:'setInput',input:{handle:'targetOut',on:'timeout',duration:100}}
				]
        },
		{
            propositions: [{type:'inputEquals',value:'targetOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'targetStime'}, // hide the letter
                {type:'showStim',handle:'MaskScreen'} // and show the mask screen
				]
        },
		{//What to do upon response
		//the  proposition: dont remove the mask upon timeout, wait until reaction
			propositions: [{type:'inputEquals',value:category1}], //pleasent response
			actions: [
				{type:'setTrialAttr',setter:{score:'1'}},
				{type:'removeInput',inputHandle:[category2,category1]},//only one respnse is possible
				//The player sends the value of score to the server, when you call the 'log' action
				{type:'log'}, // here we call the log action. This is because we want to record the latency of this input (the latency of the response)
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'inputEquals',value:category2}], //unpleasent response.
			actions: [
				{type:'setTrialAttr',setter:{score:'0'}},
				{type:'removeInput',inputHandle:[category2,category1]},
				{type:'log'},
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
			actions: [{type:'endTrial'}]
		}
		]

		}]});

		API.addTrialSets({
		white:[{		//priming1
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulus', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'MaskScreen'},
			{ inherit: 'blanckScreen'}
			]
		}],
		black:[{		//priming2
			inherit:{set: 'basicTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulus', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'MaskScreen'},
			{ inherit: 'blanckScreen'}
			]
		}],
	});

	//define an example trial- should be diffrent trial because it has diffrent durations.
	API.addTrialSets({
	exampleTrial: [{
		//Layout defines what will be presented in the trial. It is like a background display.
		layout: [
			{location:{left:15,top:3},media:{word:'key: e'}, css:{color:'black','font-size':'1em'}},
			{location:{left:75,top:3},media:{word:'key: i'},  css:{color:'black','font-size':'1em'}},
			{location:{left:10,top:6},media:{word:'unpleasant'}, css:{color:'white','font-size':'2em'}},
			{location:{left:70,top:6},media:{word:'pleasant'},  css:{color:'white','font-size':'2em'}}
		],
		//Inputs for two possible responses.
		input: [
			{handle:category2,on: 'keypressed', key:'e'},
			{handle:category1,on: 'keypressed', key:'i'},
			{handle:category2,on:'leftTouch',touch:true},
			{handle:category1,on:'rightTouch',touch:true}
		],
		//Set what to do.
		interactions: [
		{
            propositions: [{type:'begin'}],
            actions: [{type:'showStim',handle:'primingImage'},// display the first stimulus
			{type:'setInput',input:{handle:'primeOut',on:'timeout',duration:125}}]  //display longer time in the example trial
        },
		{
            propositions: [{type:'inputEquals',value:'primeOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'primingImage'}, // hide the first stimulus
				{type:'showStim',handle:'blanckScreen'}, // and show the second one
				{type:'setInput',input:{handle:'blanckOut',on:'timeout',duration:125}}
				]
        },
		{
            propositions: [{type:'inputEquals',value:'blanckOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'blanckScreen'}, // hide the blanck screen
				{type:'showStim',handle:'targetStim'}, // and show the letter
				{type:'setInput',input:{handle:'targetOut',on:'timeout',duration:125}}
				]
        },
		{
            propositions: [{type:'inputEquals',value:'targetOut'}], // on time out
            actions: [
                {type:'hideStim',handle:'targetStime'}, // hide the first stimulus
                {type:'showStim',handle:'MaskScreen'} // and show the mask screen
				]
        },
		{//What to do upon correct response
		//the proposition: dont remove the word upon timeout, wait until reaction
			propositions: [{type:'inputEquals',value:category1}], //pleasent response
			actions: [
				{type:'setTrialAttr',setter:{score:'1'}},
				{type:'removeInput',inputHandle:[category2,category1]},
				{type:'log'},
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:0}}
			]
		},

		{
			propositions: [{type:'inputEquals',value:category2}], //unpleasent response.
			actions: [
				{type:'setTrialAttr',setter:{score:'0'}},
				{type:'removeInput',inputHandle:[category2,category1]},
				{type:'log'},
				{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:0}}
			]
		},
		{
			propositions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
			actions: [{type:'endTrial'}]
		}
		]

		}],
		example:[{
			inherit:{set: 'exampleTrial'},
			stimuli: [
			{ inherit: {set: 'targetStimulus', type:'exRandom'}, data : {handle:'targetStim'} },
			{ inherit: {set: 'exprimingImage', type:'exRandom'}, data : {handle:'primingImage'} },
			{ inherit: 'exMaskScreen'},
			{ inherit: 'blanckScreen'}
			]
		}],

	});
	//Define the instructions trial- will be use gor showing the instruction at the begining of each block, and the user feedback at the end.
	API.addTrialSets('inst',{
			input: [
				{handle:'space',on:'space'}, //Will handle a SPACEBAR reponse
				{handle:'space',on:'centerTouch',touch:true}
			],
			interactions: [
				{ // begin trial
					propositions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'All'}] //Show the instructions, later use to show the user feedback
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

	//Create the stimuli
	API.addStimulusSets({
	//These are diffrent types of stimuli.
	//That way we can later create a stimulus object the inherits from this set randomly.
	// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
		Default: [
			{css:{color:'white','font-size':'2em'}}
		],
	//That way we can later create a stimulus object the inherits from this set randomly.
		targetStimulus: [
			{
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'targetWords'}} //Select a word from the media, randomly
			}
			],


		//blanckScreen  stimulus (in between the trials)
		MaskScreen : [
			{
				data : {handle:'MaskScreen'},
				inherit:'Default',
				media: {image:'ampmask.jpg'}//the mask we put on the letter
			}
		],
		exMaskScreen : [// the mask with the : "Rate now"
			{
				data : {handle:'MaskScreen'},
				inherit:'Default',
				media: {image:'ampmaskr.jpg'}//the mask we put on the letter in the example trial
			}
		],
		blanckScreen : [// can be used as a fixation point by replacing the word with '+'
			{
				data : {handle:'blanckScreen'},
				css:{color:'green','font-size':'2em'},
				media: {word:' '}//the blanck screen in between
			}
		],
		//priming stimulus: the two catagories of images
		//white
		primingImage1 : [
			{
				data : {handle:'primingImage'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images1'}}
			}
			],
			//black
			primingImage2 : [
			{
				data : {handle:'primingImage'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'Images2'}}
			}
			],
			//example images
			exprimingImage : [
			{
				data : {handle:'primingImage'},
				inherit:'Default',
				media: {inherit:{type:'exRandom',set:'exImages'}}
			}
			]
	});

	//Create materials (media) for the stimulus
	//three catagories of priming images, and one cayagory of words.
	//example
	API.addMediaSets({
		exImages: [
			{image: 'ampchair.jpg'},
			{image: 'amplamp.jpg'},
			{image: 'ampumbrella.jpg'}
		]
	});
	//white
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
			{image: 'sw12.jpg'},
			{image: 'wm5.jpg'},
			{image: 'wm15.jpg'}
		]
	});
	//black
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
	//the letters
	API.addMediaSets({
		targetWords: [
			{image: 'pic1.jpg'},
			{image: 'pic2.jpg'},
			{image: 'pic3.jpg'},
			{image: 'pic4.jpg'},
			{image: 'pic5.jpg'},
			{image: 'pic6.jpg'},
			{image: 'pic7.jpg'},
			{image: 'pic8.jpg'},
			{image: 'pic9.jpg'},
			{image: 'pic10.jpg'},
			{image: 'pic11.jpg'},
			{image: 'pic12.jpg'},
			{image: 'pic13.jpg'},
			{image: 'pic14.jpg'},
			{image: 'pic15.jpg'},
			{image: 'pic16.jpg'},
			{image: 'pic17.jpg'},
			{image: 'pic18.jpg'},
			{image: 'pic19.jpg'},
			{image: 'pic20.jpg'},
			{image: 'pic21.jpg'},
			{image: 'pic22.jpg'},
			{image: 'pic23.jpg'},
			{image: 'pic24.jpg'},
			{image: 'pic25.jpg'},
			{image: 'pic26.jpg'},
			{image: 'pic27.jpg'},
			{image: 'pic28.jpg'},
			{image: 'pic29.jpg'},
			{image: 'pic30.jpg'},
			{image: 'pic31.jpg'},
			{image: 'pic32.jpg'},
			{image: 'pic33.jpg'},
			{image: 'pic34.jpg'},
			{image: 'pic35.jpg'},
			{image: 'pic36.jpg'},
			{image: 'pic37.jpg'},
			{image: 'pic38.jpg'},
			{image: 'pic39.jpg'},
			{image: 'pic40.jpg'},
			{image: 'pic41.jpg'},
			{image: 'pic42.jpg'},
			{image: 'pic43.jpg'},
			{image: 'pic44.jpg'},
			{image: 'pic45.jpg'},
			{image: 'pic46.jpg'},
			{image: 'pic47.jpg'},
			{image: 'pic48.jpg'},
			{image: 'pic49.jpg'},
			{image: 'pic50.jpg'},
			{image: 'pic51.jpg'},
			{image: 'pic52.jpg'},
			{image: 'pic53.jpg'},
			{image: 'pic54.jpg'},
			{image: 'pic55.jpg'},
			{image: 'pic56.jpg'},
			{image: 'pic57.jpg'},
			{image: 'pic58.jpg'},
			{image: 'pic59.jpg'},
			{image: 'pic60.jpg'},
			{image: 'pic61.jpg'},
			{image: 'pic62.jpg'},
			{image: 'pic63.jpg'},
			{image: 'pic64.jpg'},
			{image: 'pic65.jpg'},
			{image: 'pic66.jpg'},
			{image: 'pic67.jpg'},
			{image: 'pic68.jpg'},
			{image: 'pic69.jpg'},
			{image: 'pic70.jpg'},
			{image: 'pic71.jpg'},
			{image: 'pic72.jpg'},
			{image: 'pic73.jpg'},
			{image: 'pic74.jpg'},
			{image: 'pic75.jpg'},
			{image: 'pic76.jpg'},
			{image: 'pic77.jpg'},
			{image: 'pic78.jpg'},
			{image: 'pic79.jpg'},
			{image: 'pic80.jpg'},
			{image: 'pic81.jpg'},
			{image: 'pic82.jpg'},
			{image: 'pic83.jpg'},
			{image: 'pic84.jpg'},
			{image: 'pic85.jpg'},
			{image: 'pic86.jpg'},
			{image: 'pic87.jpg'},
			{image: 'pic88.jpg'},
			{image: 'pic89.jpg'},
			{image: 'pic90.jpg'},
			{image: 'pic91.jpg'},
			{image: 'pic92.jpg'},
			{image: 'pic93.jpg'},
			{image: 'pic94.jpg'},
			{image: 'pic95.jpg'},
			{image: 'pic96.jpg'},
			{image: 'pic97.jpg'},
			{image: 'pic98.jpg'},
			{image: 'pic99.jpg'},
			{image: 'pic100.jpg'},
			{image: 'pic101.jpg'},
			{image: 'pic102.jpg'},
			{image: 'pic103.jpg'},
			{image: 'pic104.jpg'},
			{image: 'pic105.jpg'},
			{image: 'pic106.jpg'},
			{image: 'pic107.jpg'},
			{image: 'pic108.jpg'},
			{image: 'pic109.jpg'},
			{image: 'pic110.jpg'},
			{image: 'pic111.jpg'},
			{image: 'pic112.jpg'},
			{image: 'pic113.jpg'},
			{image: 'pic114.jpg'},
			{image: 'pic115.jpg'},
			{image: 'pic116.jpg'},
			{image: 'pic117.jpg'},
			{image: 'pic118.jpg'},
			{image: 'pic119.jpg'},
			{image: 'pic120.jpg'},
			{image: 'pic121.jpg'},
			{image: 'pic122.jpg'},
			{image: 'pic123.jpg'},
			{image: 'pic124.jpg'},
			{image: 'pic125.jpg'},
			{image: 'pic126.jpg'},
			{image: 'pic127.jpg'},
			{image: 'pic128.jpg'}
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
					media:{html:'<div><p style="font-size:26px"><color="FFFAFA">Put your middle or index fingers on the <b>E</b> and <b>I</b> keys of your keyboard.<br/> Press the key <B>I</B> if the drawing is more pleasant than average.<br/> Hit the <b>E</b> key If it is more unpleasant than average. <br/><br/> The images appear and disappear quickly.<br/> Remember to ignore the first picture and evaluate only the Chinese drawing.</br></br> When you are ready to try a few practice responses,<br/> hit the <b>space bar</b>.</p></div>'}
				}]},
		{ //The presentation example trials
			mixer: 'repeat',// Repeat 3 times the trial.
			times: 3,
			data : [{inherit: 'example'}]
		},
			{ //Instructions trial
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:26px"><color="FFFAFA">See how fast it is? Dont worry if you miss some. Go with your gut feelings.<br/> Concentrate on the drawing and rate it as more "pleasant" than average with the <b>I</b> key,<br/> or more "unpleasant" than average with the <b>E</b> key.<br/><br/> Ready? Press the <b>space bar</b> to begin.<br/><br/>(round 1 of 3) </p></div>'}
				}]},
		{ //The presentation trials
			mixer: 'random',
			data : [{
				mixer: 'repeat',// Repeat 40 times the trial. (20 times each comination)
				times: 20,
				data : [
					{inherit: 'white'},
					{inherit: 'black'},
					]}]},
		{ //Instructions trial, second round
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">Continue to the second round of this task.<br/> The rules are exactly the same.<br/><br/>Concentrate on the drawing and rate it as more "pleasant" than average with the <b>I</b> key,<br/>  or more "unpleasant" than average with the <b>E</b> key.<br/><br/> Evaluate each Chinese drawing and not the image that appears before it.<br/> The images are sometimes distracting.<br/><br/>Ready? Press the <b>space bar</b> to begin.<br/><br/>(Round 2 of 3).</p></div>'}
				}
			]},
		{ //The presentation trials
			// Repeat 40 times the trial. (20 times each comination)
			mixer: 'random',
			data : [{
				mixer: 'repeat',// Repeat 40 times the trial. (20 times each comination)
				times: 20,
				data : [
					{inherit: 'white'},
					{inherit: 'black'},
				]}]},
		{ //Instructions trial, third round
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">And now to the last round of this task.<br/> The rules are exactly the same.<br/><br/>Concentrate on the drawing and rate it as more "pleasant" than average with the <b>I</b> key,<br/>  or more "unpleasant" than average with the <b>E</b> key.<br/><br/> Evaluate each Chinese drawing and not the image that appears before it.<br/> The images are sometimes distracting.<br/><br/>Ready? Press the <b>space bar</b> to begin.<br/><br/>(Round 3 of 3).</p></div>'}
				}]},
		{ //The presentation trials
			mixer: 'random',
			data : [{
				mixer: 'repeat',// Repeat 40 times the trial. (20 times each comination)
				times: 20,
				data : [
					{inherit: 'white'},
					{inherit: 'black'},
				]}]},
			// user feedback
		{
			inherit: "inst",
			stimuli: [],
			customize: function(){
				var trial = this;
				console.log('computing AMP score..');//printing to the console
				console.log(API.getLogs());//printing to the consol the log's array
				var logs = API.getLogs();//saving the logs
				computeAMPScore(logs);// computing the AMP score
				var media1 = {media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> After black men, '+AMPScorer.counter.prime2.category1+' of the responses were pleasant  and '+ AMPScorer.counter.prime2.category2+' of the responses were ‘unpleasant’<br>After white men, '+ AMPScorer.counter.prime1.category1+' of the responses were ‘pleasant’ and '+ AMPScorer.counter.prime1.category2+' of the responses were ‘unpleasant’.</p></div>'}};
				trial.stimuli.push(media1);//show the score
			}
		},
		{ //Instructions trial, the end of the task, instruction what to do next
			inherit : "inst",
			stimuli: [
				{//The instructions stimulus
					data : {'handle':'instStim'},
					media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press space for continue to next task.</p></div>'}
			}]}]);

	API.play();

});