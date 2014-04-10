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

	IAT.addSettings('logger',{logger: (function(){
		var current_block = 0;
		var count = 0;

		var defaultLogger = function(trialData, inputData, actionData,logStack){
			if (current_block != trialData.block){
				current_block = trialData.block;
				count = 0;
			} else {
				count++;
			}

			var stimList = this._stimulus_collection.get_stimlist();
			var mediaList = this._stimulus_collection.get_medialist();

			return {
				log_serial : logStack.length,
				trial_id: this.counter,
				trial_number: count,
				name: this.name(),
				responseHandle: inputData.handle,
				latency: Math.floor(inputData.latency),
				stimuli: stimList,
				media: mediaList,
				data: trialData
			};
		};

		return defaultLogger;
	})()});

	_.extend(IAT,{
		play: function play(){
			// activate scorer
			var scorer = scorerSetter();

			//What to do at the end of the task.
			IAT.addSettings('hooks',{
				endTask: function(){

					// get the block 3 condition so we can report it
					var block3Cond = _(IAT.getLogs()).find(function(log){return log.data.block===3;});
					if (!block3Cond || !block3Cond.data.condition){
						block3Cond = "Block 3 condition was not found";
					} else {
						block3Cond = block3Cond.data.condition;
					}

					//Compute score
					var DScoreObj = scorer.computeD();
					scorer.dynamicPost({
						score: DScoreObj.DScore,
						feedback: DScoreObj.FBMsg,
						block3Cond: block3Cond
					}).always(function(){top.location.href = "/implicit/Study?tid="+xGetCookie("tid");});
				}
			});

			IATplay.apply(this);
		}
	});

	return IAT;
});