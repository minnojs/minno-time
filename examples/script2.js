require(['app/API'], function(API) {	
	var category1_a = 'Bad Words';
	var category1_b = 'Good Words';
	var category2_a = 'White People';
	var category2_b = 'Black People';


	API.addSettings('canvas',{
		maxWidth: 800,
		proportions : 0.8		
	});

	API.addSettings('logger',{
		url : 'google.com',
		pulse: 8
	});

	API.addSettings('metaData',{
		session_id: 8546653,
		task_id: 313,
		task_alias: 'tomcat'			
	});
	
	API.addSettings('base_url',{
		image:"images/",
		template:"templates",		
	});

	API.addTrialSets('Default',{
		data: {score:1},					
		input: [			
			{handle:'left',on:'keypressed',key:'e'}, 
			{handle:'right',on:'keypressed',key:'i'}, 					
			{handle:'left',on:'leftTouch',touch:true}, 
			{handle:'right',on:'rightTouch',touch:true}					
		],
		layout: [						
			{location:{left:0,top:0},media:{template:'left.html'}},
			{location:{left:'auto',right:0,top:0},media:{template:'right.html'}}
		],					
		interactions: [
			{ // begin trial
				propositions: [{type:'begin'}],
				actions: [
					{type:'showStim',handle:'myStim'}
				]
			},
			{ // error
				propositions: [
					{type:'stimEquals',value:'side',negate:true},
					{type:'inputEquals',value:'error_end', negate:true}
				],
				actions: [
					{type:'showStim',handle:'error'},
					{type:'setInput',input:{handle:'error_end', on:'timeout',duration:300}},
					{type:'setTrialAttr', setter:{score:0}}
					
				]
			},
			{
				propositions: [{type:'inputEquals',value:'error_end'}],
				actions: [{type:'hideStim', handle: 'error'}]
			},
			{
				propositions: [{type:'stimEquals',value:'side'}],
				actions: [
					{type:'log'},
					{type:'endTrial'}
				]
			}																		
		] 
	});

	API.addTrialSets("introduction", [
		{
			data: {block: 'generic'},
			input: [			
				{handle:'space',on:'space'},
				{handle:'space',on:'centerTouch',touch:true}
			],
			layout:[
				{location:{left:0,top:0},media:{template:'left.html'}},
				{location:{left:'auto',right:0,top:0},media:{template:'right.html'}}			
			],
			interactions: [
				{ // begin trial
					propositions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'All'}]
				},
				{
					propositions: [{type:'inputEquals',value:'space'}],
					actions: [{type:'endTrial'}]
				}
																						
			]					 									
		},
		{
			data: {block:1, left1 : category1_a, right1:category1_b},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{
					media:{html:'<div><p><color="#FFFFFF">Hit "E" when the item belongs to a category in the left.<br>Hit "I" when the item belongs to a category in the right.<br><br>If you make an error, an <font color="#FF0000"><b>X</b></font> will appear - fix the error by hitting the other key.<br><br>Put your left index finger on "E", and your right index finger on "I".<br><br></font></p><p align="CENTER">Press the <b>space bar</b> to begin.</p></div>'}					
				}
			]
		},
		{
			data: {block:2, left1:category2_a, right1:category2_b},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>See above, the categories have changed.</b><br><br><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 2 of 7]</p></font></div>'}}
			]
		},
		{
			data: {block:3, left1:category1_a, right1:category1_b, left2:category2_a, right2:category2_b},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>See above, the four categories you saw separately now appear together.</b> Remember, each item belongs to only one group. Use the <b>E</b> and <b>I</b> keys to categorize items into the four groups <b>left</b> and <b>right</b>.</p><br /><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 3 of 7]</p></font></div>'}}
			]
		},
		{
			data: {block:4, left1:category1_a, right1:category1_b, left2:category2_a, right2:category2_b},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>Please sort the same four categories again.</b> Remember to go as fast as you can while making as few mistakes as possible.</p><br /><p>Use the <b>E</b> and <b>I</b> keys to categorize items into the four groups <b>left</b> and <b>right</b>.</p><br /><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 4 of 7]</p></font></div>'}}
			]
		},
		{
			data: {block:5, left1:category2_a, right1:category2_b},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>Notice above, there are only two categories and they have switched positions.</b> The concept that was previously on the left is now on the right, and the concept that was on the right is now on the left. Practice this new configuration.</p><br /><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 5 of 7]</p></font></div>'}}
			]
		},
		{
			data: {block:6, left1:category1_a, right1:category1_b, left2:category2_b, right2:category2_a},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font><p><b>See above, the four categories now appear together in a new configuration.</b> Remember, each item belongs to only one group.</p><br/><p align="center">Press the <b>space bar</b> to begin.</p><font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 6 of 7]</font></p></font></div>'}}
			]
		},
		{
			data: {block:7, left1:category1_a, right1:category1_b, left2:category2_b, right2:category2_a},
			inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
			stimuli: [
				{media:{html:'<div><font ><p><b>Please sort the same four categories again.</b><br><br/><p align="center">Press the <b>space bar</b> to begin.</p></font><br/><p align="center"><font face="Arial" color="#FFFFFF">[round 7 of 7]</font></p></font></div>'}}
			]
		}
		
		
	]);

	API.addTrialSets("IAT", [								
		// block1
		{
			data: {block:1, left1 : category1_a, right1:category1_b},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_1_a_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
			
		},
		
		// block2
		{
			data: {block:2, left1:category2_a, right1:category2_b},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_2_a_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
			
		},

		// block3
		{
			data: {block:3, row:1, left1:category1_a, right1:category1_b, left2:category2_a, right2:category2_b},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_2_a_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]					
		},

		{
			data: {block:3, row:2, left1:category1_a, right1:category1_b, left2:category2_a, right2:category2_b},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_1_a_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]					
		},
		// block5
		{
			data: {block:5, left1:category2_a, right1:category2_b},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_2_a_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
			
		},

		// block6
		{					
			data: {block:6, row:1, left1:category1_a, right1:category1_b, left2:category2_b, right2:category2_a},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_2_a_right'}},
				{inherit:{type:'random',set:'feedback'}}
			]					
		},

		{
			data: {block:6, row:2, left1:category1_a, right1:category1_b, left2:category2_b, right2:category2_a},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'cat_1_a_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]					
		}
	]);

	API.addStimulusSets({
		Default: [
			{css:{color:'blue','font-size':'2em'}}
		],
		cat_1_a_left : [
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat1_b'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat1_a'}}}
		],
		cat_1_a_right : [
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat1_b'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat1_a'}}}				
		],
		cat_2_a_left: [
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat2_a'}}},
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat2_b'}}}				
		],			
		cat_2_a_right : [
			{data:{side:'right', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat2_a'}}},
			{data:{side:'left', handle:'myStim'}, inherit:'Default', media: {inherit:{type:'exRandom',set:'cat2_b'}}}				
		],
		feedback : [
			{handle:'error', location: {top: 80}, css:{color:'red','font-size':'2em'}, media: {word:'X'}, nolog:true}			
		]			
	});

	API.addMediaSets({
		cat1_b: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Splendid'},
			{word: 'Love'}
		],
		cat1_a : [				
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'},
		],
		cat2_b: [
			{image: 'epbm1.jpg'},
			{image: 'epbm2.jpg'},
			{image: 'epbm3.jpg'},
			{image: 'epbf1.jpg'},
			{image: 'epbf2.jpg'},
			{image: 'epbf3.jpg'},
		],
		cat2_a: [
			{image: 'epwm1.jpg'},
			{image: 'epwm2.jpg'},
			{image: 'epwm3.jpg'},
			{image: 'epwf1.jpg'},
			{image: 'epwf2.jpg'},
			{image: 'epwf3.jpg'},
		]									
	});

	// block 1
	API.addSequence([	
		// block 2
		{inherit: {set:'introduction', type:'byData', data: {block:2}}},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:2}, set:'IAT'}}
			]
		},

		{inherit: {set:'introduction', type:'byData', data: {block:1}}},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:1}, set:'IAT'}}
			]
		}
	]);

	// the rest of the blocks
	API.addSequence([				
		
		// block 3
		{inherit: {set:'introduction', type:'byData', data: {block:3}}},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:3,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:3,row:2}, set:'IAT'}}
			]
		},
		
		// block 4
		{inherit: {set:'introduction', type:'byData', data: {block:4}}},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:3,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:3,row:2}, set:'IAT'}}
			]
		},
		
		// block 5
		{inherit: {set:'introduction', type:'byData', data: {block:5}}},
		{
			mixer : 'repeat',
			times : 40,
			data : [
				{inherit : {type:'byData', data:{block:5}, set:'IAT'}}
			]
		},
		
		// block 6
		{inherit: {set:'introduction', type:'byData', data: {block:6}}},
		{
			mixer: 'repeat',
			times: 10,
			data: [
				{inherit : {type:'byData', data:{block:6,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:6,row:2}, set:'IAT'}}
			]
		},
		
		// block 7
		{inherit: {set:'introduction', type:'byData', data: {block:7}}},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:6,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:6,row:2}, set:'IAT'}}
			]
		}
							
	])
	
	API.play();
});