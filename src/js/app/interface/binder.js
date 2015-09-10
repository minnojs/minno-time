define(function(require){
	var $ = require('jquery')
		, click = require('./bindings/click')
		, mouseEvents = require('./bindings/mouseEvents')
		, keypressed = require('./bindings/keypressed')
		, keyup = require('./bindings/keyup')
		, timeout = require('./bindings/timeout');

 	/*
	 * this function decorates a listener object with on and off functions
	 * it takes listener (the object) and the binding definitions as parameters
	 *
	 * the function returns true in case the decoration was successfull and false in case it was not.
	 */
	return function(listener,definitions){
		var on = definitions.on; // what type of binding is this?

		// if the on and off function are set explicitly, set them in;
		if (typeof on === 'function') {
			listener.on = definitions.on;
			listener.off = definitions.off;
			if (typeof listener.off !== 'function') {
				throw new Error("Interface off is not a function for " + definitions.handle);
			}
			return true;
		}

		switch (on){
			/*
			 * the archtipical events
			 */
			case 'keypressed'	:
				keypressed(listener, definitions);
				break;

			case 'keyup'		:
				keyup(listener, definitions);
				break;

			case 'click'		:
				click(listener,definitions);
				break;

			case 'mouseup'	:
				mouseEvents('mouseup', listener,definitions);
				break;

			case 'mousedown'	:
				mouseEvents('mousedown', listener,definitions);
				break;

			case 'mouseenter'	:
				mouseEvents('mouseenter', listener,definitions);
				break;

			case 'mouseleave'	:
				mouseEvents('mouseleave', listener,definitions);
				break;

			case 'timeout'		:
				timeout(listener,definitions);
				break;

			/*
			 * Shortcuts
			 */

			case 'enter'	:
				keypressed(listener, $.extend({key:13},definitions));
				break;

			case 'space'	:
				keypressed(listener, $.extend({key:32},definitions));
				break;

			case 'esc'	:
				keypressed(listener, $.extend({key:27},definitions));
				break;

			case 'leftTouch'	:
				definitions.element = $('<div>')
					.css({
						position: 'absolute',
						left: 0,
						width: '30%',
						height: '100%',
						background: '#00FF00',
						opacity: 0.3
					});

				click(listener,definitions);
				break;

			case 'rightTouch'	:
				definitions.element = $('<div>')
					.css({
						position: 'absolute',
						right: 0,
						width: '30%',
						height: '100%',
						background: '#00FF00',
						opacity: 0.3
					});

				click(listener,definitions);
				break;

			case 'topTouch'	:
				definitions.element = $('<div>')
					.css({
						position: 'absolute',
						top: 0,
						width: '100%',
						height: '30%',
						background: '#00FF00',
						opacity: 0.3
					});

				click(listener,definitions);
				break;

			case 'bottomTouch'	:
				definitions.element = $('<div>')
					.css({
						position: 'absolute',
						bottom: 0,
						width: '100%',
						height: '30%',
						background: '#00FF00',
						opacity: 0.3
					});

				click(listener,definitions);
				break;

			default:
				throw new Error('You have an input element without a recognized "on" property: ' + on);

		}
		return true;
	};
});