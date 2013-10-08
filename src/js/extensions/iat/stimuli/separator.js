define(['../properties'], function(properties){
	// return new separator stimulus
	return function Separator(side, marginTop){
		var data = properties.separator;
		var stimulus = {media : data.media, css: data.css || {}};

		switch (side) {
			case 'left' :
				stimulus.location = {left: 2, top: marginTop};
				break;
			case 'right' :
				stimulus.location = {right: 2, top: marginTop};
				break;
			case 'center' :
				stimulus.location = {top: marginTop};
				break;
		}

		return stimulus;
	};

});