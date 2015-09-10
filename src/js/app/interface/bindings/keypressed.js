define(function(require){
	var $ = require('jquery');

	/*
	 * key pressed listener
	 * reqires key
	 *
	 * key can be either charCode or string.
	 * or an array of charCode/strings.
	 */

	// we monitor all key up events so that we trigger only once per key down
	var keyDownArr = [];
	$(document).on("keyup.keypressed",function(e){
		keyDownArr[e.which] = false; // unset flag to prevent multi pressing of a key
	});

	// creates an object that is capable of activating a keypressed event and removing it
	var Keypressed = function(definitions){
		// make sure key is array
		var key = $.isArray(definitions.key) ? definitions.key : [definitions.key];
		var eventName = "keydown.interface." + definitions.handle;

		// accept both keyCode and the key itself
		var target = $.map(key,function(value){
			return typeof value == "string" ? value.toUpperCase().charCodeAt(0) : value;
		});

		// attach listener
		this.on = function(callback){
			$(document).on(eventName,function(e){
				if (!keyDownArr[e.which] && $.inArray(e.which,target) != -1) {
					keyDownArr[e.which] = true; // set flag to prevent multi pressing of a key
					callback(e,'keydown');
				}
			});
		};

		// remove listener
		this.off = function(){
			$(document).off(eventName);
		};

	};

	return function(listener,definitions){
		// decorate listener with new keypressed
		$.extend(listener,new Keypressed(definitions));
	};

});