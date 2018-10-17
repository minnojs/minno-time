// # Inheritance
// In this tutorial we will learn how to create sets of Trials/Stimuli/Media and use them for randomization.

// Sets are essentialy lists of objects that allow us to select objects out of them.
// The typical set definition looks something like this:

//		API.addMediaSet('setName',[
//			media1,
//			media2
//		]);

// Using objects from a set is simple. all you have to do is add the `inherit` property to the inheriting object.
// There are two syntax types for inheriting.
// The simplified version randomly inherits a media object form the set 'mediaSet':

//		media: {inherit: 'mediaSet'}

// The full syntax allows you to pick the inheritance type:

//		media: {
//			inherit: {
//				set: 'mediaSet',
//				type: 'exRandom'
//			}
//		}



define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();



	// #### media sets
	// We define a set of media objects and call it *good*.
	API.addMediaSets('good', [
		{word: 'Paradise'},
		{word: 'Pleasure'},
		{word: 'Cheer'},
		{word: 'Wonderful'},
		{word: 'Splendid'},
		{word: 'Love'}
	]);

	// We define a set of media objects and call it *bad*.
	API.addMediaSets('bad', [
		{word: 'Bomb'},
		{word: 'Abuse'},
		{word: 'Sadness'},
		{word: 'Pain'},
		{word: 'Poison'},
		{word: 'Grief'}
	]);

	// #### Stimulus sets
	// We define two types of stimuli: bad media on the left, good media on the right.
	// This way, we use inheritance to style each media set in a uniform way.
	API.addStimulusSets("Default", [
		// randomly inherit a media object from the 'bad' media set
		{
			data: {type:'bad'},
			location: {left:30},
			media: {inherit:'bad'}
		},
		// randomly inherit a media object from the 'good' media set
		{
			data: {type:'good'},
			location: {right:30},
			media: {inherit:'good'}
		}
	]);

	// #### Trial sets
	// We define only one trial, this is inherantly gives us a shortcut to this trial, and will eventuall allow us to use it as a prototype. </br>
	// This trial simply displays a random stimulus.
	API.addTrialSets("Default", [
		{
			input: [{handle: 'end', on:'space'}],
			layout: [{inherit:'Default'}],
			interactions: [
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		}
	]);


	// #### sequence
	API.addSequence([
		// ##### Simple inheritance
		// We can simply inherit the Default trial and have it display random stimuli.
		{inherit:'Default'},
		{inherit:'Default'},
		{inherit:'Default'},

		// ##### Exclusive Randomization
		// `exRandom`: pick a random object with exclusion.
		// Repeated calls to `exRandom` will not return the same object until all objects in the set have been used. </br>
		// Specificaly this Trial presents a random 'bad' media object (note that in this case we inherit a media object, not a stimulus).
		{
			input: [{handle: 'end', on:'space'}],
			layout: [
				/* begin stimulus */
				{
					/* begin media */
					media: {
						inherit:{
							set:'bad',
							type:'exRandom'
						}
					}
					/* end media */
				}
				/* end stimulus */
			],
			interactions: [
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### Inherit by Data
		// `byData` checks if the inherit objtects' `data` property is a subset of the elements' `data` property and if it is it picks the element.
		// (this means that if all properties of `data` equal to the properties of the same name in `element.data` it is a fit). </br>

		// Specificaly, this trial picks the stimulus that has `data:{type:'good'}` (note that in this case we inherit a whole stimulus object).
		{
			input: [{handle: 'end', on:'space'}],
			layout: [
				/* begin stimulus */
				{
					inherit:{
						set:'Default',
						type:'byData',
						data: {type:'good'}
					}
				}
				/* end stimulus */
			],
			interactions: [
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### Prototyping
		// One of the greatest powers of inheritance is prototyping; using a the inheritance as a template for more advanced elements.
		// When an element (the child) has an inherit property, then the child is used to extend the inherited element (the parent).
		// What this means is that inherited properties are overwritten by explicit properties. Let's see how this works.
		{
			// Inherit the 'Default' trial.
			inherit: 'Default',
			// The layout property gets overridden
			layout: [{media:{word:'One Child'}}]
		},
		{
			// Inherit the 'Default' trial.
			inherit: 'Default',
			// The layout property gets overriden in a different way.
			layout: [{media:{word:'A differen child'}}]
		}
	]);

	return API.script;
});