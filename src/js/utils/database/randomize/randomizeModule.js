/**
 * An assortment of useful randomization functions.
 * Good so we can easily mock them...
 */
define(function(require){
	var angular = require('angular');
	var _ = require('underscore');
	var module = angular.module('randomize', []);

	/**
	 * Just plain random
	 */

	module.value('randomizeRandom', Math.random);

	/**
	 * Just lodash shuffle...
	 */
	module.value('randomizeShuffle', _.shuffle);

	/*
	 * a function that returns a random integer between 0 and length
	 * @param length: the upper boundary to the randomization.
	 */
	module.value('randomizeInt', function randomInt(length){
		return Math.floor(Math.random()*length);
	});

	/**
	 * a function that returns a random array of integers between 0 and length
	 * @param length: the upper boundary to the randomization.
	 */
	module.value('randomizeRange', function randomArr(length){
		return _.shuffle(_.range(length));
	});

	return module;
});