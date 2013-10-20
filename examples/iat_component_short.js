define(['extensions/iat/component'],function(IAT){
	/**
	 * Set Properties
	 * ************************************************************************
	 */

	IAT.setProperties({
		// activate skip block
		DEBUG: true,

		// URLS
		images_base_url: '../examples/images/'
	});

	/**
	 * Set Categories
	 * ************************************************************************
	 */

	IAT.setCategory('concept1',{
		name: 'White people',
		media: [
			{image: 'wf2_nc.jpg'},
			{image: 'wf3_nc.jpg'},
			{image: 'wf6_nc.jpg'},
			{image: 'wm1_nc.jpg'}
		]
	});

	IAT.setCategory('concept2',{
		name: 'Black People',
		media: [
			{image: 'bf14_nc.jpg'},
			{image: 'bf23_nc.jpg'},
			{image: 'bf56_nc.jpg'},
			{image: 'bm14_nc.jpg'}
		]
	});

	IAT.setCategory('attribute1',{
		name: 'Good',
		media: [
			{word: 'Paradise'},
			{word: 'Pleasure'},
			{word: 'Cheer'},
			{word: 'Wonderful'},
			{word: 'Splendid'},
			{word: 'Love'}
		]
	});

	IAT.setCategory('attribute2',{
		name: 'Bad',
		media: [
			{word: 'Bomb'},
			{word: 'Abuse'},
			{word: 'Sadness'},
			{word: 'Pain'},
			{word: 'Poison'},
			{word: 'Grief'}
		]
	});

	IAT.play();
});