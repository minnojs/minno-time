/*
 * Returns a trial sets object
 */
define(['../categories','./default', './instructions','./IATlayout'],function(categories,Default,instructions,layout){

	return function trials(){

		var trialSets = {}
			, attribute1 = categories.attribute1.name
			, attribute2 = categories.attribute1.name
			, concept1 = categories.concept1.name
			, concept2 = categories.concept2.name;

		trialSets.Default = [Default];
		trialSets.instructions = instructions();

		trialSets.IAT = [
			// block1
			{
				data: {block:1, condition: concept1 + '/' + concept2},
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
				data: {block:2, condition: attribute1 + '/' + attribute2},
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
				data: {block:3, row:1, condition: attribute1 + ',' + concept1 + '/' + attribute2 + ',' + concept2, parcel:'first'},
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
				data: {block:3, row:2, condition: attribute1 + ',' + concept1 + '/' + attribute2 + ',' + concept2, parcel:'first'},
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
				data: {block:4, row:1, condition: attribute1 + ',' + concept1 + '/' + attribute2 + ',' + concept2, parcel:'first'},
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
				data: {block:4, row:2, condition: attribute1 + ',' + concept1 + '/' + attribute2 + ',' + concept2, parcel:'first'},
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
				data: {block:5, condition: concept1 + '/' + concept2},
				layout: layout(5),
				inherit: 'Default',
				stimuli: [
					{inherit:{type:'exRandom',set:'concept1_left'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}},
					{inherit:{type:'exRandom',set:'feedback'}}
				]
			},

			// block6
			{
				data: {block:6, row:1, condition: attribute1 + ',' + concept2 + '/' + attribute2 + ',' + concept1, parcel:'first'},
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
				data: {block:6, row:2, condition: attribute1 + ',' + concept2 + '/' + attribute2 + ',' + concept1,parcel:'first'},
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
				data: {block:7, row:1, condition: attribute1 + ',' + concept2 + '/' + attribute2 + ',' + concept1, parcel:'first'},
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
				data: {block:7, row:2, condition: attribute1 + ',' + concept2 + '/' + attribute2 + ',' + concept1,parcel:'first'},
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