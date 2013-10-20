/* global xGetCookie */
define(function(require){

	var   _				= require('underscore')
		, IAT			= require('./component')
		, scorerSetter	= require('./data/iatScorer');

	// cache IAT play so we can extend it.
	var IATplay = IAT.play;

	IAT.setProperties({
		post_url: '/implicit/PiPlayerApplet'
	});

	_.extend(IAT,{
		play: function play(){
			// activate scorer
			var scorer = scorerSetter();

			//What to do at the end of the task.
			IAT.addSettings('hooks',{
				endTask: function(){
					//Compute score
					var DScoreObj = scorer.computeD();
					scorer.postToServer(DScoreObj.DScore,DScoreObj.FBMsg,"score","feedback").always(function(){top.location.href = "/implicit/Study?tid="+xGetCookie("tid");});
				}
			});

			IATplay.apply(this);
		}
	});

	return IAT;
});