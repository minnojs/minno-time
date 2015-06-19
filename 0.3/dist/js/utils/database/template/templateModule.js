define(function(require){
	var angular = require('angular');

	var module = angular.module('template', []);

	module.filter('template', require('./templateFilter'));
	module.service('templateObj', require('./templateObjProvider'));
	module.constant('templateDefaultContext',{});

	return module;
});