define(['underscore','extensions/dscore/Scorer','./properties','./categories'],function(_,scorer,properties,categories){

	return function(){
		// get category names
		var attribute1 = categories.attribute1.name
			, attribute2 = categories.attribute2.name
			, concept1 = categories.concept1.name
			, concept2 = categories.concept2.name;

		// scorer defaults
		var computeDefaults = {
			ErrorVar:'score',
			condVar:"condition",
			//condition 1
			cond1VarValues: [
				attribute1 + '/' + concept1 + ',' + attribute2 + '/' + concept2
			],
			//condition 2
			cond2VarValues: [
				attribute1 + '/' + concept2 + ',' + attribute2 + '/' + concept1
			],
			parcelVar : "parcel",
			parcelValue : ['first','second'],
			fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
			maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
			minRT : 400, //Below this latency
			maxRT : 10000, //above this
			errorLatency : {use:"latency", penalty:600, useForSTD:true},//ignore error respones
			postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
		};
		// default messages
		var messageDefaults = [
			{ cut:'-0.65', message:'Your data suggest a strong implicit preference for ' + concept2 + ' compared to ' + concept1 },
			{ cut:'-0.35', message:'Your data suggest a moderate implicit preference for ' + concept2 + ' compared to ' + concept1 },
			{ cut:'-0.15', message:'Your data suggest a slight implicit preference for ' + concept2 + ' compared to ' + concept1 },
			{ cut:'0.15', message:'Your data suggest little to no difference in implicit preference between ' + concept2 + ' and ' + concept1 },
			{ cut:'0.35', message:'Your data suggest a slight implicit preference for ' + concept1 + ' compared to ' + concept2 },
			{ cut:'0.65', message:'Your data suggest a moderate implicit preference for ' + concept1 + ' compared to ' + concept2 },
			{ cut:'3', message:'Your data suggest a strong implicit preference for ' + concept1 + ' compared to ' + concept2 }
		];

		// activate scorer
		scorer.addSettings('compute',_.defaults(properties.scorerObj || {},computeDefaults));
		scorer.addSettings('message', {
			MessageDef: properties.scorerMessage || messageDefaults
		});

		return scorer;
	};
});