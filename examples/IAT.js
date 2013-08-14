require(['app/API'], function(API) {	//haven't touched this

	API.addSettings('canvas',{ 			//haven't touched this
		maxWidth: 800,
		proportions : 0.8,
		background: 'white', 
		canvasBackground: 'white', 
		borderColor: 'black'
	});

	API.addSettings('logger',{  //haven't touched this
		url : '/implicit/PiPlayer',
		pulse: 8
	});

	API.addSettings('base_url', {image : "/pip/images"}); 	//changed to my folder

	API.addSettings('hooks',{ 				//haven't touched this
		endTask: function(){
		document.form1.submit_system.click();
		}
	});

	API.addStimulusSets({	
		trialStim: [		
			{					//the general attribute  stimulus. here we can define the characteristics of both attribute stimuli.
				handle: 'targetStim',
				data : {'stimType':'attribute'}, 		
				css:{color:'green','font-size':'2em'},
				location: {top:50},
			},
			{					//the general concept stimulus. here we can define the characteristics of both concept stimuli.
				handle: 'targetStim',
				data : {'stimType':'concept'},
				css:{color:'blue','font-size':'2em'},
				location: {top:50},				
			}
		],		
		attribute1: [		//attribute #1 stimuli
			{		
				inherit: {set: 'trialStim', type: 'byHandle', data: {stimType:'attribute'}},		
				data: {'group':'attr1', 'side':'left'},
				media: {inherit:{type:'exRandom',set:'attr1Bank'}} 	//takes the media from the attributes bank
			}
		],
		attribute2: [		//attribute #2 stimuli
			{		
				inherit: {set: 'trialStim', type: 'byHandle', data: {stimType:'attribute'}},		
				data: {'group':'attr2', 'side':'right'},
				media: {inherit:{type:'exRandom',set:'attr2Bank'}} 	//takes the media from the attributes bank
			}
		],
		concept1Left: [		//concept #1 stimuli when they should be sorted to the left
			{
				inherit: {set: 'trialStim', type: 'byHandle', data: {stimType:'concept'}},		
				data: {'group':'con1', 'side':'left'},
				media: {inherit:{type:'exRandom',set:'con1Bank'}} 	//takes the media from the concepts bank
			}
		],
		concept1Right: [		//concept #1 stimuli when they should be sorted to the right
			{	
				inherit: {set: 'trialStim', type: 'byHandle', data: {stimType:'concept'}},		
				data: {'group':'con1', 'side':'right'},
				media: {inherit:{type:'exRandom',set:'con1Bank'}} 	//takes the media from the concepts bank
			}
		],
		concept2Left: [	//concept #2 stimuli when they should be sorted to the left
			{		
				inherit: {set: 'trialStim', type: 'byHandle', data: {stimType:'concept'}},		
				data: {'group':'con2', 'side':'left'},
				media: {inherit:{type:'exRandom',set:'con2Bank'}} 	//takes the media from the concepts bank
			}
		],
		concept2Right: [	//concept #2 stimuli when they should be sorted to the right
			{		
				inherit: {set: 'trialStim', type: 'byHandle', data: {stimType:'concept'}},		
				data: {'group':'con2', 'side':'right'},
				media: {inherit:{type:'exRandom',set:'con2Bank'}} 	//takes the media from the concepts bank
			}
		],
		
		errorFB : [ 			//Error feedback stimulus
			{
				data : {handle:'errorFB'},
				size: {height:15,width:15},
				location: {top:80},
				media: {image:'cross.png'}
			}
		],
		correctFB : [			//Correct feedback stimulus
			{
				data : {handle:'correctFB'},
				size: {height:15,width:15},
				location: {top:80},
				media: {image:'check.png'}
			}
		]
	});


API.addMediaSets({
/*-->*/	attr1Bank: [ 		//here we add attribute 1 stimulus
			{word: 'Splendid'},
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Love'}
		],
/*-->*/	attr2Bank: [ 		//here we add attribute 2 stimulus
			{word: 'Bomb'} ,
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'}
		],
/*-->*/	con1Bank: [			//here we add concept 1 stimulus
			{image:'wf2_nc.jpg'},
			{image:'wf3_nc.jpg'},
			{image:'wf6_nc.jpg'},
			{image:'wm1_nc.jpg'},
			{image:'wm4_nc.jpg'},
			{image:'wm6_nc.jpg'}
		],
/*-->*/	con2Bank: [			//here we add concept 2 stimulus
			{image:'bf14_nc.jpg'},
			{image:'bf23_nc.jpg'},
			{image:'bf56_nc.jpg'},
			{image:'bm14_nc.jpg'},
			{image:'bm23_nc.jpg'},
			{image:'bm56_nc.jpg'}
		],
//---> here we add the words that will appear in the corners during the blocks		
		attr1Heading: [	
			{word: 'pleasant'}
		],
		attr2Heading: [	
			{word: 'unpleasant'}
		],
		con1Heading: [	
			{word: 'white'}
		],
		con2Heading: [	
			{word: 'black'}
		]
	});

	API.addTrialSets({
		basicTrial: [{			//Defines the basic IAT trial
			input: [
				{handle:'right',on: 'keypressed', key:'i'}, 
				{handle:'left',on: 'keypressed', key:'e'} 
			],
			interactions: [
				{ 
					propositions: [{type:'begin'}],						//shows the stimulus
					actions: [{type:'showStim',handle:'targetStim'}]
				},
				{
					propositions: [{type:'stimEquals',value:'side'}], 	//if stimulus is an attribute and response is correct
					actions: [
						{type:'hideStim',handle:'errorFB'}, 	//***might cause trouble
						{type:'showStim',handle:'correctFB'},
						{type:'removeInput',inputHandle:'right'},
						{type:'removeInput',inputHandle:'left'},
						{type:'log'},
						{type:'hideStim',handle:'targetStim'}, 
						{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:250}} //End the trial in 250ms
					]
				},
				{
					propositions: [{type:'stimEquals',value:'side', negate:true}], //if response is incorrect
					actions: [						
						{type:'showStim',handle:'errorFB'}
					]
				},
				{
					propositions: [{type:'inputEquals',value:'endTrial'}],
					actions: [
						{type:'hideStim',handle:'correctFB'},
						{type:'hideStim',handle:'targetStim'},											
						{type:'endTrial'}
					]
				}			
			]
		}],
		
		fourCategories1:[{		//a trial with four categories with concept #1 on the left
			inherit:{set: 'basicTrial'},
			layout: [
				{location:{left:10,top:5},media: {inherit:{set:'attr1Heading'}}, css:{color:'red','font-size':'2em'}},
				{location:{left:70,top:5},media: {inherit:{set:'attr2Heading'}},  css:{color:'red','font-size':'2em'}},
				{location:{left:10,top:15},media: {inherit:{set:'con1Heading'}}, css:{color:'blue','font-size':'2em'}},
				{location:{left:70,top:15},media: {inherit:{set:'con2Heading'}},  css:{color:'blue','font-size':'2em'}}			
			]
		}],
		fourCategories2:[{		//a trial with four categories with concept #2 on the left
			inherit:{set: 'basicTrial'},
			layout: [
				{location:{left:10,top:5},media: {inherit:{set:'attr1Heading'}}, css:{color:'red','font-size':'2em'}},
				{location:{left:70,top:5},media: {inherit:{set:'attr2Heading'}},  css:{color:'red','font-size':'2em'}},
				{location:{left:10,top:15},media: {inherit:{set:'con1Heading'}}, css:{color:'blue','font-size':'2em'}},
				{location:{left:70,top:15},media: {inherit:{set:'con2Heading'}},  css:{color:'blue','font-size':'2em'}}			
			]
		}],
		conceptTrial1:[{		//a two concepts trial with concept #1 on the left
			inherit:{set: 'basicTrial'},
			layout: [
				{location:{left:10,top:15},media: {inherit:{set:'con1Heading'}}, css:{color:'blue','font-size':'2em'}},
				{location:{left:70,top:15},media: {inherit:{set:'con2Heading'}},  css:{color:'blue','font-size':'2em'}}			
			]
		}],
		conceptTrial2:[{		//a two concepts trial with concept #2 on the left
			inherit:{set: 'basicTrial'},
			layout: [
				{location:{left:10,top:15},media: {inherit:{set:'con2Heading'}}, css:{color:'blue','font-size':'2em'}},
				{location:{left:70,top:15},media: {inherit:{set:'con1Heading'}},  css:{color:'blue','font-size':'2em'}}			
			]
		}],
		attributeTrial:[{		//a two attributes trial with attribute #1 on the left
			inherit:{set: 'basicTrial'},
			layout: [
				{location:{left:10,top:5},media: {inherit:{set:'attr1Heading'}}, css:{color:'red','font-size':'2em'}},
				{location:{left:70,top:5},media: {inherit:{set:'attr2Heading'}},  css:{color:'red','font-size':'2em'}}	
			]
		}]
	});

	API.addSequence([	
		{	//third or sixth block
			mixer: 'random',		// 
			data : [{				//repeats the trials below 5 times each, and randomizes their order
				mixer: 'repeat',	//
				times: 3,			//
				data: [
					{		//a trial with concept #1 stimulus
						inherit: 'fourCategories1',
						stimuli: [{inherit: 'concept1Left'}, {inherit: 'correctFB'}, {inherit: 'errorFB'}]
					},
					{		//a trial with concept #2 stimulus
						inherit: 'fourCategories1',
						stimuli: [{inherit: 'concept2Right'}, {inherit: 'correctFB'}, {inherit: 'errorFB'}]
					},
					{		//a trial with attribute #1 stimulus
						inherit: 'fourCategories1',
						stimuli: [{inherit: 'attribute1'}, {inherit: 'correctFB'}, {inherit: 'errorFB'}]
					},
					{		//a trial with attribute #2 stimulus
						inherit: 'fourCategories1',
						stimuli: [{inherit: 'attribute2'}, {inherit: 'correctFB'}, {inherit: 'errorFB'}]
					}
				]
			}] 
		}
		
	]);
	
	API.play();
});