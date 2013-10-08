/*
 *	returns the layout array for the fitting block of the IAT
 */
define(['./layout'],function(layout){

	var layoutArr = {
		1: {left:['concept1'],right:['concept2']},
		2: {left:['attribute1'],right:['attribute2']},
		3: {left:['attribute1','concept1'],right:['attribute2','concept2']},
		4: {left:['attribute1','concept1'],right:['attribute2','concept2']},
		5: {left:['concept2'],right:['concept1']},
		6: {left:['attribute1','concept2'],right:['attribute2','concept1']},
		7: {left:['attribute1','concept2'],right:['attribute2','concept1']}
	};

	return function(block){
		return layout(layoutArr[block]);
	};
});