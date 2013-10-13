define(['underscore','../properties','../categories','./IATlayout'],function(_,properties,categories,layout){
	// the generic instruction trial
	function genericConstructor(){
		var generic = {
			data: {block:'generic'},
			// create user interface (just click to move on...)
			input: [
				{handle:'space',on:'space'},
				{handle:'enter',on:'enter'}
			],

			interactions: [
				// display instructions
				{
					propositions: [{type:'begin'}],
					actions: [
						{type:'showStim',handle:'All'}
					]
				},

				// end after ITI
				{
					propositions: [{type:'inputEquals',value:'space'}],
					actions: [
						{type:'hideStim',handle:'All'},
						{type:'setInput',input:{handle:'endTrial', on:'timeout', duration: properties.post_instruction_interval || 0}}
					]
				},

				{
					propositions: [{type:'inputEquals',value:'endTrial'}],
					actions: [
						{type:'endTrial'}
					]
				},

				// skip block
				{
					propositions: [{type:'inputEquals',value:'enter'}],
					actions: [
						{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
						{type:'endTrial'}
					]
				}
			]
		};

		// if touch is active add the touch input
		if (!properties.notouch){
			generic.input.push({handle:'space',on:'bottomTouch',touch:true});
		}

		return generic;
	}


/*
	var last = {
		data: {block:'last'},
		inherit: {set:'instructions', type:'byData', data: {block:'generic'}},
		stimuli: [{
			inherit:'instructions',
			media: {template:'last.jst'}
		}]
	};
*/

	// this array will hold any user defined settings
	var settingsArr = [];

	// build insructions array
	function buildInstructions(){

		var generic = genericConstructor()
			, instructionsArr = [generic]
			, trial
			, stimulus
			, settings;

		for (var i = 1; i <= 7; i++){
			settings = settingsArr[i] || {};
			// default trial
			trial = {
				data: {block:i},
				layout: layout(i),
				inherit: {set:'instructions', type:'byData', data: {block:'generic'}}
			};

			// default stimulus
			stimulus = {
				inherit:'instructions',
				media: {template:'inst' + i + '.jst'}
			};

			// update trial/stimulus with user settings
			settings.media && (stimulus.media = settings.media);
			settings.css && (stimulus.css = settings.css);
			settings.extend && (_.extend(trial,settings.extend));

			trial.stimuli = [stimulus];

			// push trial into the instructions array
			instructionsArr.push(trial);
		}

		// add the category types into the generic instructions data
		_.each(categories,function(category, categoryType){
			generic.data[categoryType] = category.name;
		});

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