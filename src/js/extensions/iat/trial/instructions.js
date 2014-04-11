define(['underscore','../data/properties','../data/categories','./IATlayout'],function(_,properties,categories,layout){
	// the generic instruction trial
	function genericConstructor(){
		var generic = {
			data: {block:'generic'},
			// create user interface (just click to move on...)
			input: [
				{handle:'space',on:'space'}
			],

			interactions: [
				// display instructions
				{
					conditions: [{type:'begin'}],
					actions: [
						{type:'showStim',handle:'All'}
					]
				},

				// end after ITI
				{
					conditions: [{type:'inputEquals',value:'space'}],
					actions: [
						{type:'hideStim',handle:'All'},
						{type:'setInput',input:{handle:'endTrial', on:'timeout', duration: properties.post_instructions_interval || 0}}
					]
				},

				{
					conditions: [{type:'inputEquals',value:'endTrial'}],
					actions: [
						{type:'endTrial'}
					]
				},

				// skip block
				// activate skipping:
				{
					conditions: [{type:'inputEquals',value:'skip1'}],
					actions: [
						{type:'setInput',input:{handle:'skip2',on:'enter'}}
					]
				},
				// skip:
				{
					conditions: [{type:'inputEquals',value:'skip2'}],
					actions: [
						{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
						{type:'endTrial'}
					]
				}
			]
		};

		if (properties.DEBUG){
			generic.input.push({handle:'skip1',on:'keypressed', key: 27});
		}

		// if touch is active add the touch input
		if (!properties.notouch){
			generic.input.push({handle:'space',on:'bottomTouch',touch:true});
		}

		return generic;
	}



	var last =  {
		data: {block:'last'},
		// create user interface (just click to move on...)
		input: [
			{handle:'space',on:'space'}
		],

		interactions: [
			// display instructions
			{
				conditions: [{type:'begin'}],
				actions: [
					{type:'showStim',handle:'All'}
				]
			},

			// end
			{
				conditions: [{type:'inputEquals',value:'space'}],
				actions: [{type:'endTrial'}]
			}
		],
		stimuli: []
	};

	// this array will hold any user defined settings
	var settingsArr = [];

	// build insructions array
	function buildInstructions(){

		var generic = genericConstructor()
			, instructionsArr = [generic]
			, trial
			, stimulus
			, settings
			// The layout should depend on part and not on block.
			, customize = function(){
				this.layout = layout(this.data.part);
			};


		for (var i = 1; i <= 7; i++){
			settings = settingsArr[i] || {};
			// default trial
			trial = {
				data: {block:i},
				//layout: layout(i),
				inherit: {set:'instructions', type:'byData', data: {block:'generic'}},
				customize: customize
			};

			// default stimulus
			stimulus = {
				inherit:'instructions',
				media: {template:'inst' + i + '.jst'}
			};

			// update trial/stimulus with user settings
			settings.media && (stimulus.media = settings.media);
			settings.template && (stimulus.media = {inlineTemplate: settings.template});
			settings.css && (stimulus.css = settings.css);
			settings.extend && (_.extend(trial,settings.extend));

			trial.stimuli = [stimulus];

			// push trial into the instructions array
			instructionsArr.push(trial);
		}

		// add the category types into the generic instructions data
		_.each(categories,function(category, categoryType){
			// set category names
			generic.data[categoryType] = category.name;
			// set category colors (mainly for the simple_layout)
			generic.data[categoryType + 'Color'] = category.titleColor;
		});

		last.stimuli.push({
			inherit:'instructions',
			media: properties.endMedia || {html:'<div><p style="font-size:1.4em"><color="#FFFAFA">You have completed this task<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" in order to continue.</p></div>'}
		});

		instructionsArr.push(last);


		return instructionsArr;
	} // end build instructions

	// this function returns the instructions array if it has no arguments
	// if it has arguments, it updates the instructions array
	return function instructions(block,settings){
		// if there are no arguments return the instructions array
		if (!arguments.length) {
			return buildInstructions();
		} else { // if there are arguments we need to save the settings
			settingsArr[block] = settings;
		}
	};

});