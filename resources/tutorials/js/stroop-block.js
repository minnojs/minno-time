/* The script wrapper */
define(['app/API'], function(API) {

	API.addSettings('canvas',{
		textSize: 5
	});

	API.addStimulusSets('congruent',[
		{media:'Red', css:{color:'#FF0000'}},
		{media:'Pink', css:{color:'#FFC0CB'}},
		{media:'Orange', css:{color:'#FFA500'}},
		{media:'Yellow', css:{color:'#FFFF00'}},
		{media:'Purple', css:{color:'#800080'}},
		{media:'Green', css:{color:'#008000'}},
		{media:'Blue', css:{color:'#0000FF'}},
		{media:'Brown', css:{color:'#8B4513'}},
		{media:'White', css:{color:'#FFFFFF'}},
		{media:'Grey', css:{color:'#A9A9A9'}}
	]);

	API.addStimulusSets('incongruent',[
		{media:'Red', css:{color:'#008000'}}, // Green
		{media:'Pink', css:{color:'#0000FF'}}, // Blue
		{media:'Orange', css:{color:'#8B4513'}},  // Brown
		{media:'Yellow', css:{color:'#FFFFFF'}}, // White
		{media:'Purple', css:{color:'#A9A9A9'}}, // Grey
		{media:'Green', css:{color:'#FF0000'}}, // Red
		{media:'Blue', css:{color:'#FFC0CB'}}, // Pink
		{media:'Brown', css:{color:'#FFA500'}}, // Orange
		{media:'White', css:{color:'#FFFF00'}}, // Yellow
		{media:'Grey', css:{color:'#800080'}} // Purple
	]);

	API.addTrialSets('base',[{
		input: [
			{handle:'congruent',on:'keypressed',key:'e'},
			{handle:'incongruent',on:'keypressed',key:'i'}
		],
		layout: [
			{media:{word:'Congruent'}, location:{left:1,top:0.5},css:{color:'white',fontSize:'1.5em'}},
			{media:{word:'Incongruent'}, location:{right:1,top:0.5},css:{color:'white',fontSize:'1.5em'}}
		],
		interactions: [
			// Display the target stimulus.
			{
				propositions:[{type:'begin'}],
				actions: [{type:'showStim', handle: 'target'}]
			},
			// Correct response actions
			{
				propositions: [
					{type:'trialEquals',value:'group'}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:1}},
					{type:'log'},
					{type:'endTrial'}
				]
			},
			// Incorrect response actions
			{
				propositions: [
					{type:'trialEquals',value:'group',negate:true},
					{type:'inputEquals',value:['congruent','incongruent']}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:0}},
					{type:'log'},
					{type:'endTrial'}
				]
			}
		]
	}]);

	API.addTrialSets('congruent',[{
		inherit:'base',
		data: {group:'congruent'},
		stimuli: [
			{inherit:{type:'exRandom', set:'congruent'}, handle:'target'}
		]
	}]);

	API.addTrialSets('incongruent',[{
		inherit:'base',
		data: {group:'incongruent'},
		stimuli: [
			{inherit:{type:'exRandom', set:'incongruent'}, handle:'target'}
		]
	}]);

	API.addSequence([
		// random mixer
		{
			mixer: 'random',
			data: [
				// repeat mixer
				{
					mixer: 'repeat',
					times: 20,
					data: [
						{inherit:'congruent'},
						{inherit:'incongruent'}
					]
				}
			]
		}
	]);

	// #### Activate the player
	API.play();
});
/* don't forget to close the define wrapper */