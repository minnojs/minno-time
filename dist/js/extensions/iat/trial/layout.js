define(['underscore', '../data/properties','../stimuli/separator','../stimuli/category'],function(_, properties, Separator, Category){

	/*
	 * Takes a map of the form {left: ['concept1'], right: ['concept2']}
	 * Returns a layout array for a trial (with real stimuli, not inheritance)
	 */
	var layout = function layout(map){
		var layoutArr = [];

		// for each side
		_.each(map, function(type,side){
			var marginTop = 2; // this is the margin from the top

			_.each(type, function(category, index){
				var separator, categoryStim;

				// if we need a separator push separator
				if (index > 0 && _.isObject(properties.separator)){
					separator = new Separator(side,marginTop);
					layoutArr.push(separator);
					marginTop += properties.separator.height || 4;
				}

				// push category
				categoryStim = new Category(category, side, marginTop);
				layoutArr.push(categoryStim);
				marginTop += categoryStim.height;
			});

		});

		return layoutArr;
	};

	return layout;

});