define(['../data/properties'], function(properties){
	// return new separator stimulus
	return function Separator(side, marginTop){
		var data = properties.separator
			, stimulus = {media : data.media, css: data.css || {color:'black'}}
			, margin = data.margin || 0;

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
		}

		return stimulus;
	};

});