define(['app/API'], function(APIconstructor) {

	var API = new APIconstructor('stroop');


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

	API.addSequence([
		{
			layout: [
				{media:'1',location:{left:2,top:2},css:{background:'red',padding:'2%',fontSize:'1.5em'}},
				{media:'2',location:{top:2},css:{background:'blue',padding:'2%',fontSize:'1.5em'}},
				{media:'3',location:{right:2,top:2},css:{background:'green',padding:'2%',fontSize:'1.5em'}}
			],
			input: [
				{handle:'red',on:'keypressed',key:'1'},
				{handle:'blue',on:'keypressed',key:'2'},
				{handle:'green',on:'keypressed',key:'3'}
			],
			stimuli:[
				{inherit:'red', handle:'target'}
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
						{type:'inputEquals',value:'red'}
					],
					actions: [
						{type:'setTrialAttr', setter:{score:1}},
						{type:'log'},
						{type:'endTrial'}
					]
				},
				// Incorrect response actions
				{
					conditions: [
						{type:'inputEquals',value:'red', negate:true},
						{type:'inputEquals', value: ['red','blue','green']}
					],
					actions: [
						{type:'setTrialAttr', setter:{score:0}},
						{type:'log'},
						{type:'endTrial'}
					]
				}
			]
		}
	]);

	// #### Activate the player
	return API.script;
});
/* don't forget to close the define wrapper */