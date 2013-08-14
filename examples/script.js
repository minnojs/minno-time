  /*
  In this example, like before - the task shows a stimulus (the word XYZ) on the left, center or right side of the screen,  
  and participants indicate the location in their response.
  But, we add a few more features:
  1. Show an error or correct feedback. 
  2. Use trials with different colors, and alternate from one color to the next, sequentially.
  3. Add requests to log (record) some of the events in this task, to send to the server. 
  4. Add two pages of introduction and instructions at the beginning of the task
  5. Add a ---THE END--- trial at the end of the sequence.
 */

 require(['app/API'], function(API) {	


	API.addSettings('canvas',{
		maxWidth: 800,
		proportions : 0.8
	});
	
	API.addSettings('redirect', '//www.google.com');
	
	API.addSettings('canvas',{
		url : 'google.com'
	});
	
	API.addSettings('hooks',{
		endTask : function(){
			
		}
	});
	

	API.addTrialSets('myTrial', [
		{					
			layout: [ /*What the user will see [not including the target stimulus]. These are three stimuli. Each has location, a few style features, and media which is the stimulus material*/
				/*STEP 2 addition: here we set the color use RGB in hexadecimal. See http://www.w3schools.com/cssref/css_colors.asp to learn more*/
				{location:{left:1,top:1}, css:{color:'#99FFFF','font-size':'2em'}, media:{word:'Left'}},
				{location:{top:1}, css:{color:'#99FFFF','font-size':'2em'}, media:{word:'Center'}},
				{location:{left:'auto',right:1,top:1}, css:{color:'#99FFFF','font-size':'2em'}, media:{word:'Right'}}
			],
			input: [ /*Defines the user input events*/			
				{handle:'left',on:'keypressed',key:'1'}, 
				{handle:'center',on:'keypressed',key:'2'}, 					
				{handle:'right',on:'keypressed',key:'3'},
			],
			interactions: [ /*Defines what to do on events*/			
				{
					propositions: [{type:'begin'}], /*What to do when the trial starts*/
					actions: [{type:'showStim',handle:'targetStim'}] /*Show the target stimuls. The trials that will inherit IATDefault will set the stimuli-set that has the handle targetStim*/
				},
				{
					propositions: [{type:'stimEquals',value:'side'}], /*What to do when the input equals the attribute 'side' of the current stimulus (i.e., on correct response)*/
					actions: [{type:'hideStim', handle: 'targetStim'}, /*Hide the target stimulus*/
							{type:'showStim', handle: 'correctFBStim'}, /*STEP 2 addition: Show the correct feedback stimulus*/
							  {type:'setInput', input:{handle:'nextTrial', on:'timeout',duration:500}}, /*Wait 300ms and then move to the next trial*/

							  /*NOTE: the recording does not have to be only one row per trial. 
							  We instruct the player to record as one of the actions. 
							  In this task, we will record error and correct responses. 
							  The logger will automatically log the trial name, 
							  the latency of the response (from the beginning of the trial), 
							  all the stimuli in this trial, 
							  and also a few fields that might exist in the data field of this trial: block and score. 
							  Therefore, we will now set the score 1, meaning error*/
							  {type:'setTrialAttr', setter:{myAttr:'score',myOtherAttr:'1'}},
							  {type:'log'} /*The log action request to record the present state of the trial.*/ 
							  ]
				},
				{/*STEP 2 addition: show error feedback*/
					/*Notice the negate attribute: it means that this would happen whenever the response does not equal the "side" attribute of the present stimulus*/
					propositions: [{type:'stimEquals',value:'side', negate:'true'}], /*What to do when the input does NOT equals the attribute 'side' of the current stimulus (i.e., on error response)*/
					actions: [{type:'hideStim', handle: 'targetStim'},
							{type:'showStim', handle: 'errorFBStim'}, /*Step 2 addition: Show the error feedback stimulus*/
							  {type:'setInput', input:{handle:'nextTrial', on:'timeout',duration:500}}, /*Wait 300ms and then move to the next trial*/
							  {type:'setTrialAttr', setter:{myAttr:'score',myOtherAttr:'0'}}, /*The score is saved as error.*/
							  {type:'log'} /*We want to record everytime there is an error response*/
							  ]
				},
				{/*STEP 2 addition: hide all possible stimuli and wait a few ms before the next trial*/
					propositions: [{type:'inputEquals',value:'nextTrial'}], /*What to do when the input equals 'nextTrial'*/
					actions: [{type:'hideStim', handle: 'targetStim'}, 
							{type:'hideStim', handle: 'errorFBStim'}, 
							{type:'hideStim', handle: 'correctFBStim'}, 
							  {type:'setInput', input:{handle:'endTrial', on:'timeout',duration:800}} /*Wait 800ms and then move to the next trial*/
							  ]
				},																		
				{
					propositions: [{type:'inputEquals',value:'endTrial'}], /*What to do when the input equals 'endTrial'*/
					actions: [{type:'endTrial'}] /*End the trial*/
				}																		
			]
			/*STEP 2 CHANGE: we do not have any stimuli in this trial object. 
			It means that we will need to inherit this trial object and add stimuli*/
		}
	]);

	API.addTrialSets('myTrialGreen', [
		{					
			inherit: 'myTrial', 
			stimuli: [ 
				{inherit:{type:'random',set:'myStimuliGreen'}}, /*STEP 2 addition: Will choose randomly a stimulus from the stimuli set named myStimuliGreen (defined below)*/
				/*STEP 2 addition: add two more stimuli types for the feedback. 
				Each of these sets have only one stimulus but we inherit it because we are going to use it in the next two trial objects as well 
				so it is better to define the actual stimulus in one place and inherit every time we need it. */
				{inherit:{type:'random',set:'correctFB'}}, 
				{inherit:{type:'random',set:'errorFB'}}
			]
		}
	]);

	API.addTrialSets('myTrialBlue', [
		{					
			inherit: 'myTrial', 
			stimuli : [ 
				{inherit:{type:'random',set:'myStimuliBlue'}}, /*Will choose randomly a stimulus from the stimuli set named myStimuliBlue*/
				{inherit:{type:'random',set:'correctFB'}}, 
				{inherit:{type:'random',set:'errorFB'}}
			]
		}
	]);

	API.addTrialSets('myTrialPink', [
		{					
			inherit: 'myTrial', 
			stimuli : [ 
				{inherit:{type:'random',set:'myStimuliPink'}}, /*Will choose randomly a stimulus from the stimuli set named myStimuliPink*/
				{inherit:{type:'random',set:'correctFB'}}, 
				{inherit:{type:'random',set:'errorFB'}}
			]
		}
	]);

	API.addTrialSets('instructions', [  
		{ /*This trial does not have stimuli. Each instructions trial will inherit this trial and add the instructions stimulus*/
			input: [			
				{handle:'endTrial',on:'keypressed',key:32}, /*32 is the ASCII code for SPACE-BAR. See here: http://www.asciitable.com/*/
			],
			interactions: [
				{
					propositions: [{type:'begin'}], 
					actions: [{type:'showStim',handle:'instructions'}] 
				},
				{
					propositions: [{type:'inputEquals',value:'endTrial'}], /*What to do when the input equals 'endTrial'*/
					actions: [{type:'endTrial'}] /*End the trial*/
				}
			]					 									
		}
	]);
			
	API.addTrialSets('instructions1', [
		{ /*This trial does not have stimuli. Each instructions trial will inherit this trial and add the instructions stimulus*/
			inherit : "instructions", 
			stimuli : [ 
				{
					data:{side:'left', handle:'instructions'}, 
					/*We use an html element for the instructions here, instead of word as we did until now*/
					media: {html:"<p style='font-size:20px; color:white; text-align:left;'><b>The task is about to begin.</b></br>Put the fingers of your left hand on the keys: 1, 2, and 3.</br>When you see XYZ on the left, press 1. When you see XYZ at the center, press 2. When you see XYZ on the right, press 3.</br>Make sure to respond as quickly as you can.<br/>Press space for the next instructions page</p>"}
				}, 
			]
		}
	]);
	
	API.addTrialSets('instructions2', [  
		{ /*This trial does not have stimuli. Each instructions trial will inherit this trial and add the instructions stimulus*/
			inherit : "instructions", 
			stimuli : [ 
				{
					data:{side:'left', handle:'instructions'}, 
					/*We use an html element for the instructions here, instead of word as we did until now*/
					media: {html:"<p style='font-size:20px; color:white; text-align:left;'>Are you ready for the task to finally begin?<br/>Press space for the first trial</p>"}
				}, 
			]
		}
	]);

	API.addTrialSets('theend', [
		{					
			inherit : "instructions", 
			stimuli : [ 
				{
					data:{side:'left', handle:'instructions'}, 
					css:{color:'#FFFFFF','font-size':'4em'}, 
					media: {word:'---THE END---'}
				}, 
			]
		}
	]);
	
	API.addStimulusSets({
		/*The stimulusSets define sets of stimuli that select stimuli from mediaSets (see later), and also define their data (mainly side and handle). 
		The "side" data attribute is used to determine whether the response is correct or incorrect (that's the stimEquals proposition). 
		The "handle" data attribute is used to define that this is the target-stimulus, to be used in the trial (see the stimuli elements of the blockTrials elements)*/
		myStimuliGreen : [
			{data:{side:'left', handle:'targetStim'}, location:{left:3}, css:{color:'#00FF00','font-size':'4em'}, media: {word:'XYZ'}},
			{data:{side:'center', handle:'targetStim'}, css:{color:'#00FF00','font-size':'4em'}, media: {word:'XYZ'}},
			{data:{side:'right', handle:'targetStim'}, location:{left:'auto', right:3}, css:{color:'#00FF00','font-size':'4em'}, media: {word:'XYZ'}}
		],
		myStimuliBlue : [
			{data:{side:'left', handle:'targetStim'}, location:{left:3}, css:{color:'#6666FF','font-size':'4em'}, media: {word:'XYZ'}},
			{data:{side:'center', handle:'targetStim'}, css:{color:'#6666FF','font-size':'4em'}, media: {word:'XYZ'}},
			{data:{side:'right', handle:'targetStim'}, location:{left:'auto', right:3}, css:{color:'#6666FF','font-size':'4em'}, media: {word:'XYZ'}}
		],
		myStimuliPink : [
			{data:{side:'left', handle:'targetStim'}, location:{left:3}, css:{color:'#FFCCFF','font-size':'4em'}, media: {word:'XYZ'}},
			{data:{side:'center', handle:'targetStim'}, css:{color:'#FFCCFF','font-size':'4em'}, media: {word:'XYZ'}},
			{data:{side:'right', handle:'targetStim'}, location:{left:'auto', right:3}, css:{color:'#FFCCFF','font-size':'4em'}, media: {word:'XYZ'}}
		],
		correctFB : [
				{data:{handle:'correctFBStim'}, location: {top:75}, css:{color:'#66FF00','font-size':'4em'}, media: {word:'CORRECT'}}
		],
		errorFB : [
				{data:{handle:'errorFBStim'},  location: {top:75}, css:{color:'#FF0000','font-size':'4em'}, media: {word:'WRONG'}}
		]
	});

	API.addSequence([
			/*start with two pages of instructions*/
			{inherit: 'instructions1'}, 
			{inherit: 'instructions2'}, 
			/*STEP 2 ADDITION: repeat triplets of the three possible trials*/		
			{
				mixer: 'repeat', /*repeat 10 times whatever is in the data array*/
				times: 1,
				data: [
					{
						mixer: 'random', /*show in a radom order the trials in the data array*/
						data: [
							{inherit: 'myTrialGreen'}, 
							{inherit: 'myTrialBlue'},
							{inherit: 'myTrialPink'}
						]
					}
				]
			},
			/*end with a THE END message*/
			{inherit: 'theend'}
	]);

	API.play();
});
