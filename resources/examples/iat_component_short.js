// # Race IAT
// **A simple use of the IAT component**
define(['extensions/iat/PIcomponent'],function(IAT){

	// ### Properties

	/**
	 * Set Properties
	 * ************************************************************************
	 */

	IAT.setProperties({
		// Activate skip block
		DEBUG: true,
		// Set images url
		images_base_url: '../resources/examples/images/'
	});

	// ### Categories

	/**
	 * Set Categories
	 * ************************************************************************
	 */


	// Each category is set using a setCategory call.
	// The minimal use is setting the category `name`, and the `images`/`words` to display.

	// ##### Concept 1
	IAT.setCategory('concept1',{
		name: 'White people',
		media: [
			{image: 'wf2_nc.jpg'},
			{image: 'wf3_nc.jpg'},
			{image: 'wf6_nc.jpg'},
			{image: 'wm1_nc.jpg'}
		]
	});

	// ##### Concept 2
	IAT.setCategory('concept2',{
		name: 'Black People',
		media: [
			{image: 'bf14_nc.jpg'},
			{image: 'bf23_nc.jpg'},
			{image: 'bf56_nc.jpg'},
			{image: 'bm14_nc.jpg'}
		]
	});

	// ##### Attribute 1
	IAT.setCategory('attribute1',{
		name: 'Good Words',
		media: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Splendid'},
			{word: 'Love'}
		]
	});

	// ##### Attribute 2
	IAT.setCategory('attribute2',{
		name: 'Bad Words',
		media: [
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'}
		]
	});

	// activate the player
	IAT.play();
});