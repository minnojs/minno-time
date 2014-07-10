define(['underscore', '../data/properties','../data/categories'],function(_, properties, categories){

	/*
	 * Takes a map of the form {left: ['concept1'], right: ['concept2']}
	 * Returns a layout array for a trial (with real stimuli, not inheritance)
	 * This function realises the simpleLayout layout which essentialy uses a
	 */
	var simpleLayout = function layout(map){
		var layoutArr = [];

		// for each side
		_.each(map, function(type,side){
			var categoryStim = {media:{template:'layout.jst'}, data:{separatorColor:properties.separatorColor, separatorSize: properties.separatorSize}}
				, data = categoryStim.data;

			switch (side){
				case 'left' : categoryStim.location = {left: 2, top:2}; break;
				case 'right' : categoryStim.location = {right: 2, top:2}; break;
				default:
					throw new Error('Unknow side');
			}

			// for each category
			_.each(type, function(category){
				// there can be only one attribute/concept in each side, so we can drop the numbers...
				var prefix = category.replace(/[0-9]/g, '');
				var categoryObj = categories[category];
				var name = _.isObject(categoryObj.title) ? categoryObj.title.word : categoryObj.title;
				if (!name){
					throw new Error ('We are missing a title for ' + type + '. are you using an advanced media type by any chance?');
				}
				data[prefix] = name;
				categoryObj.titleColor && (data[prefix + 'Color'] = categoryObj.titleColor);
				categoryObj.titleSize && (data[prefix + 'Size'] = categoryObj.titleSize);
			});

			// push category
			layoutArr.push(categoryStim);
		});

		return layoutArr;
	};

	return simpleLayout;
});