/*
 * adjust canvas according to window size and settings
 * this module is built to be part of the main view
 */
define(['jquery','app/task/settings','app/trial/current_trial'],function($, settingsGetter, trial){

	// the function to be used by the main view
	function adjust_canvas(init){
		var self = this;
		// get canvas settings
		var settings = settingsGetter('canvas') || {};

		// calculate proportions (as height/width)
		var proportions;
		if (settings.proportions) {
			if ($.isPlainObject(settings.proportions)) {
				if (typeof settings.proportions.height !== 'number' || typeof settings.proportions.width !== 'number'){
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

			// static canvas size
			if (settings.width){
				// if this is not init, we've already set screen size, so don't mess around
				if (!init){
					return true;
				}

				width = settings.width;
				height = width*proportions;

			} else { // dynamic canvas size
				// get current screen size
				var screenSize = {
					width: $(window).innerWidth(),
					height: $(window).innerHeight()
				};

				var maxHeight = screenSize.height;
				var maxWidth = Math.min(settings.maxWidth, screenSize.width);

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
			height -= parseInt(self.$el.css('border-top-width'),10) + parseInt(self.$el.css('border-bottom-width'),10) + parseInt(self.$el.css('margin-top'),10);
			width -= parseInt(self.$el.css('border-left-width'),10) + parseInt(self.$el.css('border-right-width'),10);

			// reset canvas size
			self.$el.width(width);
			self.$el.height(height);
			self.$el.css('font-size',height*(settings.textSize || 3)/100);

			// refresh all stimuli (we don't want to do this before we have trials)
			if (trial()) {
				trial()._layout_collection.refresh();
				trial()._stimulus_collection.refresh();
			}

			// scroll to top of window (hides some of the mess on the top of mobile devices)
			window.scrollTo(0, 1);
		}
	}

	return adjust_canvas;
});