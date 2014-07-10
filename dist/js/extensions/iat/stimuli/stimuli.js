define(['underscore','../data/properties','../data/categories'],function(_,properties,categories){

	return function stimuli(){
		var stimSets = {}
			, defaultStim
			, defaultFBstim;

		// Build default stimulus
		// ***************************************************************
		defaultStim = properties.defaultStimulus;
		defaultStim.css = _.defaults(defaultStim.css || {}, {
			font: properties.font,
			fontSize: properties.fontSize,
			color: properties.fontColor
		});

		stimSets.Default = [defaultStim];
		stimSets.instructions = [properties.instructionsStimulus];

		// Trial stimuli
		// ***************************************************************

		// create stimuli for each of the categories
		stimSets['attribute1'] = [_.extend(categories.attribute1.stimulus || {}, {inherit:'Default', css:categories.attribute1.css || defaultStim.css})];
		stimSets['attribute2'] = [_.extend(categories.attribute2.stimulus || {}, {inherit:'Default', css:categories.attribute2.css || defaultStim.css})];
		stimSets['concept1'] = [_.extend(categories.concept1.stimulus || {}, {inherit:'Default', css:categories.concept1.css || defaultStim.css})];
		stimSets['concept2'] = [_.extend(categories.concept2.stimulus || {}, {inherit:'Default', css:categories.concept2.css || defaultStim.css})];

		// add the trial stimuli 5 time so that the randomization has meaning
		// iterations are supposed to expand the current set
		_.extend(stimSets, {attribute1_left:[], attribute1_right:[], concept1_left:[], concept1_right:[]});
		for (var i = 0; i <5; i++) {
			stimSets['attribute1_left'] = stimSets['attribute1_left'].concat([
					{data:{side:'left', handle:'target', alias:categories.attribute1.name}, inherit:'attribute1', media: {inherit:{type:'exRandom',set:'attribute1'}}},
					{data:{side:'right', handle:'target', alias:categories.attribute2.name}, inherit:'attribute2', media: {inherit:{type:'exRandom',set:'attribute2'}}}
			]);
			stimSets['attribute1_right'] = stimSets['attribute1_right'].concat([
					{data:{side:'left', handle:'target', alias:categories.attribute2.name}, inherit:'attribute2', media: {inherit:{type:'exRandom',set:'attribute2'}}},
					{data:{side:'right', handle:'target', alias:categories.attribute1.name}, inherit:'attribute1', media: {inherit:{type:'exRandom',set:'attribute1'}}}
			]);
			stimSets['concept1_left'] = stimSets['concept1_left'].concat([
					{data:{side:'left', handle:'target', alias:categories.concept1.name}, inherit:'concept1', media: {inherit:{type:'exRandom',set:'concept1'}}},
					{data:{side:'right', handle:'target', alias:categories.concept2.name}, inherit:'concept2', media: {inherit:{type:'exRandom',set:'concept2'}}}
			]);
			stimSets['concept1_right'] = stimSets['concept1_right'].concat([
					{data:{side:'left', handle:'target', alias:categories.concept2.name}, inherit:'concept2', media: {inherit:{type:'exRandom',set:'concept2'}}},
					{data:{side:'right', handle:'target', alias:categories.concept1.name}, inherit:'concept1', media: {inherit:{type:'exRandom',set:'concept1'}}}
			]);
		}

		// Build feedback stimuli
		// ***************************************************************
		// default feedback stimuli
		defaultFBstim = {
			correct: {handle:'correct_feedback', location: {top: 80}, css:{color:'green','font-size':'4em'}, media: {word:'OK'}, nolog:true},
			error: {handle:'error_feedback', location: {top: 80}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true},
			timeout: {handle:'timeout_feedback', location: {top: 80}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true}
		};

		// get data from properties and create relevant stimuli
		stimSets['feedback'] = [];
		_.each(['correct','error','timeout'],function(type){
			var stimulus =  defaultFBstim[type];

			// extend the default stimulus with any stimulus data from the properties object
			if (properties[type + '_feedback'].css){
				stimulus.css = properties[type + '_feedback'].css;
			}

			// if we have media object, use it instead of the default
			if (properties[type + '_feedback'].media){
				stimulus.media = properties[type + '_feedback'].media;
			}

			stimSets['feedback'].push(stimulus);
		});

		return stimSets;
	};
});