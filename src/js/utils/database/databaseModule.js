define(function(require){

	var angular = require('angular');

	var module = angular.module('database',[
			require('./mixer/mixerModule').name,
			require('./template/templateModule').name,
			require('utils/console/consoleModule').name
		])
		.service('Collection', require('./collection/collectionProvider'))
		.service('DatabaseRandomizer', require('./randomizer/randomizerProvider'))
		.service('databaseQuery', require('./queryProvider'))
		.service('databaseInflate', require('./inflateProvider'))
		.service('DatabaseStore', require('./store/storeProvider'))
		.service('Database', require('./databaseProvider'))
		//.value('Database', require('./main')) // tests the use of the non angular variation
		.service('databaseSequence', require('./databaseSequenceProvider'));

	return module;
});