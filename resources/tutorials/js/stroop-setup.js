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

	API.addSequence([
		{
			layout: [
				{
					media:'Congruent',
					location:{left:1,top:1},
					css:{color:'white',fontSize:'1.5em'}
				},
				{
					media:'Incongruent',
					location:{right:1,top:1},
					css:{color:'white',fontSize:'1.5em'}
				},
				{inherit:'congruent'}
			],
			input: [
				{handle:'congruent',on:'keypressed',key:'e'},
				{handle:'incongruent',on:'keypressed',key:'i'}
			],
			interactions: []
		}
	]);

	// #### Activate the player
	API.play();
});
/* don't forget to close the define wrapper */