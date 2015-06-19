define(function(require){
	var _ = require('underscore');

	var mixerSequence = require('./mixer/main');
	var templateObj = require('./template/main');

	var collection = require('./collection/collectionProvider')();

	var DatabaseRandomizer = require('./randomizer/randomizerProvider')(
		randomInt,// randomize int
		randomArr,// randomize range
		collection
	);

	var databaseQuery = require('./queryProvider')(
		collection,
		piConsole
	);

	var databaseInflate = require('./inflateProvider')(
		databaseQuery,
		{global:window.piGlobal}, // rootscope
		piConsole
	);

	var DatabaseStore = require('./store/storeProvider')(
		collection
	);

	var databaseSequence = require('./databaseSequenceProvider')(
		mixerSequence
	);


	var Database = require('./databaseProvider')(
		DatabaseStore,
		DatabaseRandomizer,
		databaseInflate,
		templateObj,
		databaseSequence
	);

	return Database;

	function randomArr(length){
		return _.shuffle(_.range(length));
	}

	function randomInt(length){
		return Math.floor(Math.random()*length);
	}

	function piConsole(){
		return console;
	}
});