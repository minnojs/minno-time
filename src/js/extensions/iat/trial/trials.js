/*
 * Returns a trial sets object
 */
define(['../data/categories','./default', './instructions','./IATlayout'],function(categories,defaultTrial,instructions,layout){
	return function trials(){

		var trialSets = {}
			, attribute1 = categories.attribute1.name
			, attribute2 = categories.attribute2.name
			, concept1 = categories.concept1.name
			, concept2 = categories.concept2.name;

		trialSets.Default = [defaultTrial()];
		trialSets.instructions = instructions();

		trialSets.IAT = [
			// block1
			{
				data: {part:1, condition: concept1 + ',' + concept2},
				layout: layout(1),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}
				]
			},

			// block2
			{
				data: {part:2, condition: attribute1 + ',' + attribute2},
				layout: layout(2),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'attribute1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			// block3
			{
				data: {part:3, row:1, condition: attribute1 + '/' + concept1 + ',' + attribute2 + '/' + concept2, parcel:'first'},
				layout: layout(3),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			{
				data: {part:3, row:2, condition: attribute1 + '/' + concept1 + ',' + attribute2 + '/' + concept2, parcel:'first'},
				layout: layout(3),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'attribute1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			// block4 (same as 3)
			{
				data: {part:4, row:1, condition: attribute1 + '/' + concept1 + ',' + attribute2 + '/' + concept2, parcel:'second'},
				layout: layout(4),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			{
				data: {part:4, row:2, condition: attribute1 + '/' + concept1 + ',' + attribute2 + '/' + concept2, parcel:'second'},
				layout: layout(4),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'attribute1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			// block5
			{
				data: {part:5, condition: concept2 + ',' + concept1},
				layout: layout(5),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_right'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}
				]
			},

			// block6
			{
				data: {part:6, row:1, condition: attribute1 + '/' + concept2 + ',' + attribute2 + '/' + concept1, parcel:'first'},
				layout: layout(6),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_right'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			{
				data: {part:6, row:2, condition: attribute1 + '/' + concept2 + ',' + attribute2 + '/' + concept1,parcel:'first'},
				layout: layout(6),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'attribute1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			// block7  (same as 6)
			{
				data: {part:7, row:1, condition: attribute1 + '/' + concept2 + ',' + attribute2 + '/' + concept1, parcel:'second'},
				layout: layout(7),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_right'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			},

			{
				data: {part:7, row:2, condition: attribute1 + '/' + concept2 + ',' + attribute2 + '/' + concept1,parcel:'second'},
				layout: layout(7),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'attribute1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}

				]
			}
		];

		return trialSets;
	};

});