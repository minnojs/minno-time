/* The script wrapper */
define(['app/API'], function(API) {

	API.addSettings('canvas',{
		textSize: 5
	});

	API.addStimulusSets('red',[
		{media:'Red', css:{color:'red'}},
		{media:'Blue', css:{color:'red'}},
		{media:'Green', css:{color:'red'}}
	]);

	API.addStimulusSets('blue',[
		{media:'Red', css:{color:'blue'}},
		{media:'Blue', css:{color:'blue'}},
		{media:'Green', css:{color:'blue'}}
	]);

	API.addStimulusSets('green',[
		{media:'Red', css:{color:'green'}},
		{media:'Blue', css:{color:'green'}},
		{media:'Green', css:{color:'green'}}
	]);

	API.addStimulusSets('error',[
		{handle:'error',media:'X', css:{fontSize:'2em',color:'#FF0000'}, location:{top:70}}
	]);

	API.addTrialSets('base',[{
		input: [
			{handle:'red',on:'keypressed',key:'1'},
			{handle:'blue',on:'keypressed',key:'2'},
			{handle:'green',on:'keypressed',key:'3'}
		],
		layout: [
			{media:'1',location:{left:2,top:2},css:{background:'red',padding:'2%',fontSize:'1.5em'}},
			{media:'2',location:{top:2},css:{background:'blue',padding:'2%',fontSize:'1.5em'}},
			{media:'3',location:{right:2,top:2},css:{background:'green',padding:'2%',fontSize:'1.5em'}}
		],
		interactions: [
			// Display the target stimulus.
			{
				conditions:[{type:'begin'}],
				actions: [{type:'showStim', handle: 'target'}]
			},
			// Correct response actions
			{
				conditions: [
					{type:'inputEqualsTrial',property:'group'}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:1}},
					{type:'log'},
					{type:'trigger', handle:'ITI'}
				]
			},
			// Incorrect response actions
			{
				conditions: [
					{type:'inputEqualsTrial',property:'group',negate:true},
					{type:'inputEquals',value:['red','blue','green']}
				],
				actions: [
					{type:'setTrialAttr', setter:{score:0}},
					{type:'log'},
					{type:'showStim', handle:'error'},
					{type:'removeInput',handle:['red','blue','green']},
					{type:'trigger', handle:'ITI', duration:500}
				]
			},
			// Inter trial interval
			{
				conditions: [{type:'inputEquals', value:'ITI'}],
				actions:[
					{type:'hideStim',handle:'All'},
					{type:'removeInput',handle:['red','blue','green']},
					{type:'trigger', handle:'end',duration:500}
				]
			},
			// End trial
			{
				conditions: [{type:'inputEquals', value:'end'}],
				actions:[
					{type:'endTrial'}
				]
			}
		]
	}]);

	API.addTrialSets('red',[{
		inherit:'base',
		data: {group:'red'},
		stimuli: [
			{inherit:{set:'red',type:'exRandom'}, handle:'target'},
			{inherit:'error'}
		]
	}]);

	API.addTrialSets('blue',[{
		inherit:'base',
		data: {group:'blue'},
		stimuli: [
			{inherit:{set:'blue',type:'exRandom'}, handle:'target'},
			{inherit:'error'}
		]
	}]);

	API.addTrialSets('green',[{
		inherit:'base',
		data: {group:'green'},
		stimuli: [
			{inherit:{set:'green',type:'exRandom'}, handle:'target'},
			{inherit:'error'}
		]
	}]);

	API.addSequence([
		{
			mixer: 'random',
			data: [
				{
					mixer: 'repeat',
					times: 20,
					data: [
						{inherit:'red'},
						{inherit:'blue'},
						{inherit:'green'}
					]
				}
			]
		}
	]);

	// #### Activate the player
	API.play();
});
/* don't forget to close the define wrapper */