define(['../data/properties'],function(properties){

	var input_decorator = function input_decorator(trial){
		var input = trial.input;
		var interactions = trial.interactions;

		// skip trial input
		// ***********************************************************************************
		if (properties.DEBUG){
			input.push({handle:'skip1',on:'keypressed', key:27});
		}

		// left input
		// ***********************************************************************************
		switch (typeof properties.left) {
			case 'undefined' :
				input.push({handle:'left',on:'keypressed',key:'e'});
				break;
			case 'string':
				/* falls through */
			case 'number':
				input.push({handle:'left',on:'keypressed',key:properties.left});
				break;
			default:
				properties.left.handle = 'left'; // make sure handle for object is correct
				input.push(properties.left);
				break;
		}

		// right input
		// ***********************************************************************************
		switch (typeof properties.right) {
			case 'undefined' :
				input.push({handle:'right',on:'keypressed',key:'i'});
				break;
			case 'string':
				/* falls through */
			case 'number':
				input.push({handle:'right',on:'keypressed',key:properties.right});
				break;
			default:
				properties.right.handle = 'right'; // make sure handle for object is correct
				input.push(properties.right);
				break;
		}

		// if touch is active
		// ***********************************************************************************
		if (!properties.notouch){
			// leftTouch
			switch (typeof properties.leftTouch) {
				case 'undefined' :
					input.push({handle:'left',on:'leftTouch',touch:true});
					break;
				default:
					input.push({
						handle:'left',
						on:'click',
						element:properties.leftTouch,
						touch:true
					});
					break;
			}

			// rightTouch
			switch (typeof properties.rightTouch) {
				case 'undefined' :
					input.push({handle:'right',on:'rightTouch',touch:true});
					break;
				default:
					input.push({
						handle:'right',
						on:'click',
						element:properties.rightTouch,
						touch:true
					});
					break;
			}
		}

		// Timout
		// ***********************************************************************************
		if (properties.timeout){

			input.push({
				handle:'timeout',
				on:'timeout',
				duration:properties.timeout
			});

			interactions.push({
				conditions: [
					{type:'inputEquals',value:'timeout'}
				],
				actions:[
					{type:'removeInput',handle:['left','right']},
					{type:'setTrialAttr', setter:{score:9}},
					{type:'log'},
					{type:'trigger',handle:'timeout_feedback'}
				]
			});
		}

		return trial;
	};

	return input_decorator;
});