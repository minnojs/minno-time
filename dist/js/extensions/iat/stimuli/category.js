define(['../data/categories'], function(categories){

	return function Category(categoryName, side, marginTop){
		var category = categories[categoryName]
			, margin = category.margin || 0;
		if (!category){
			throw new Error(categoryName + ' is not a category name (or has not been loaded yet)');
		}

		var media = category.title || category.name // the category media is preferably the title else the name.
			, stimulus = {media : media, css: category.titleCss || {fontSize:'1.3em', color:'black'}, height: category.height || 5};

		switch (side) {
			case 'left' :
				stimulus.location = {left: 2 + margin, top: marginTop};
				break;
			case 'right' :
				stimulus.location = {right: 2 + margin, top: marginTop};
				break;
			case 'center' :
				stimulus.location = {top: marginTop};
				break;
			default:
				throw new Error('Unknow side in category');
		}

		return stimulus;
	};

});