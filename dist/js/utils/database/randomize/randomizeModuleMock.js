/**
 * A mock for all randomization functions
 * just load it after loading anything that requires randomiation.
 * in order to change setting inject 'randomizeSettings' and change the random and length properties
 */
define(function(require){
	var angular = require('angular');
	var _ = require('underscore');

	var module = angular.module('randomizeMock', []);

	// define settings and reset defaults
	var settings = {};
	module.constant('randomizeSettings', settings);
	module.config(function(randomizeSettings){
		randomizeSettings.random = 0.5;
		randomizeSettings.length = 3;
	});

	/**
	 * Just plain random
	 */
	module.value('randomizeRandom', function(){
		return settings.random;
	});

	/**
	 * Just lodash shuffle...
	 */
	module.value('randomizeShuffle', function(arr){
		return _(arr).reverse().value();
	});

	/*
	 * a function that returns a random integer between 0 and length
	 * @param length: the upper boundary to the randomization.
	 */
	module.value('randomizeInt', function randomInt(){
		return settings.length;
	});

	/**
	 * a function that returns a random array of integers between 0 and length
	 * @param length: the upper boundary to the randomization.
	 */
	module.value('randomizeRange', function randomArr(length){
		return _(_.range(length)).reverse().value();

	});
});