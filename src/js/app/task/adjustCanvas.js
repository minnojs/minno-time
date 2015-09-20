/*
 * adjust canvas according to window size and settings
 * this module is built to be part of the main view
 * @TODO: this is a whole mess.
 * 	* pass element explicitly
 * 	* this probably isn't the correct way to pass containerView
 * 	* I'd like to separate resize enough so that we can throttle/debounce it.
 *
 */
define(function(require){

	var $ = require('jquery')
		, _ = require('underscore');

	// the function to be used by the main view
	function adjustCanvas(options){
		var containerView = this;
		var settings = containerView.canvasSettings;
		var init = _.get(options,'init', false);
		// @TODO: this is a terrible mix. we should find a way to separate the
		var self = this;


		// calculate proportions (as height/width)
		var proportions;
		if (settings.proportions) {
			if (_.isPlainObject(settings.proportions)) {

				if (!_.isNumber(settings.proportions.height) || !_.isNumber(settings.proportions.width)){
					throw new Error('The canvas proportions object`s height and a width properties must be numeric');
				}
				proportions = settings.proportions.height/settings.proportions.width; // if proportions are an object they should include width and height
			} else {
				proportions = settings.proportions || 0.8; // by default proportions are 0.8
			}
		}

		// we put this in a time out because of a latency of orientation change on android devices
		setTimeout(resize,init ? 0 : 500); // end timeout

		function resize(){
			var height, width;
			var $canvas = self.$el;

			// static canvas size
			if (settings.width){
				// if this is not init, we've already set screen size, so don't mess around
				if (!init){
					return true;
				}

				width = settings.width;
				height = width*proportions;

			}
			// dynamic canvas size
			else {

				// get current screen size
				var screenSize = {
					width: $(window).innerWidth(),
					height: $(window).innerHeight()
				};

				var maxHeight = screenSize.height;
				var maxWidth = Math.min(settings.maxWidth, screenSize.width, $canvas.parent().innerWidth());

				// calculate the correct size for this screen size
				if (maxHeight > proportions * maxWidth) {
					height = maxWidth*proportions;
					width = maxWidth;
				} else {
					height = maxHeight;
					width = maxHeight/proportions;
				}
			}

			// remove border width and top margin from calculated width (can't depend on cool box styles yet...)
			// we compute only margin-top because of a difference calculating margins between chrome + IE and firefox + mobile
			height -= parseInt($canvas.css('border-top-width'),10) + parseInt($canvas.css('border-bottom-width'),10) + parseInt($canvas.css('margin-top'),10);
			width -= parseInt($canvas.css('border-left-width'),10) + parseInt($canvas.css('border-right-width'),10);

			// reset canvas size
			$canvas.width(width);
			$canvas.height(height);
			$canvas.css('font-size',height*(settings.textSize || 3)/100);

			// refresh all stimuli (we don't want to do this before we have trials)
			// @Todo should probably be broadcast somehow... let the stimuli deal with this directly
			containerView.trigger('adjustCanvas');

			// scroll to top of window (hides some of the mess on the top of mobile devices)
			window.scrollTo(0, 1);
		}
	}

	return adjustCanvas;
});