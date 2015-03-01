/*
 * detects touch devices
 */

define(function(){
	return !!('ontouchstart' in window) ? true : false;
});
