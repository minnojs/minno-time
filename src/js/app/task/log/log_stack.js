/*
 * Holds the logged rows in serial order
 */
define(function(require){
	var global = require('app/global');

	return function(){
		return global().current.logs;
	};
});