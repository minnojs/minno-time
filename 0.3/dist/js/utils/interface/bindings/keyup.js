define(function(require){
	var $ = require('jquery');

	/*
	 * key up listener
	 * reqires definitions.key
	 *
	 * key can be either charCode or string.
	 * or an array of charCode/strings.
	 */

	// creates an object that is capable of activating a keypressed event and removing it
	var Keyup = function(definitions){
		// make sure key is array
		var key = $.isArray(definitions.key) ? definitions.key : [definitions.key];
		var eventName = "keyup.interface." + definitions.handle;

		// accept both keyCode and the key itself
		var target = $.map(key,function(value){
			return typeof value == "string" ? value.toUpperCase().charCodeAt(0) : value;
		});

		// attach listener
		this.on = function(callback){
			$(document).on(eventName,function(e){
				if ($.inArray(e.which,target) !== -1) {
					callback(e,'keyup');
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
		$.extend(listener,new Keyup(definitions));
	};

});