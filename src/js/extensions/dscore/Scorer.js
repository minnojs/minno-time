define(['jquery','underscore','./computeD','./msgMan','./parcelMng'],function($,_,computeData,msgMan,parcelMng){
	window.console || (window.console = {log: $.noop, error: $.noop});
	var Scorer = {};

//comment

	$.extend(Scorer, {

/*  Function: Void addSettings.
	Input: settings object.
	Output: set the settings in computeD  object or msgMan according to input
	Description: Settings for computeD or msgMan

*/
		addSettings: function(type,Obj){

			if (type =="compute"){
				computeData.setComputeObject(Obj);
			}else{
				if (type =="message") {
					msgMan.setMsgObject(Obj);
				}
			}

		},

/*  Function: Void init.
	Input: none.
	Output: none
	Description: make sure console.log is safe among all browsers.

*/
		init: function(){
			// js hint thinks that console is read only - and its correct except where it doesn't exist...  this is how we tell it to ignore these lines
			/* jshint -W020 */
			!!window.console || (console = {});
			console.log || (console.log = function(){});
			/* jshint +W020 */
		},

/*  Function: Void computeD.
	Input: none.
	Output: final score.
	Description: Calculate the score returns an object that hold
	the score an an error msg.

*/
		computeD: function(){

			Scorer.init();
			computeData.setDataArray();
			// console.log('started computeD');
			// console.log(computeData);
			// console.log(msgMan);
			parcelMng.Init(computeData);
			parcelMng.avgAll(computeData);
			//parcelMng.diffAll(computeData);
			parcelMng.varianceAll(computeData);
			parcelMng.scoreAll(computeData);
			var scoreObj = parcelMng.scoreData;
			var scoreData = {};
			if (scoreObj.errorMessage === undefined || scoreObj.errorMessage === null){
					scoreData.FBMsg = Scorer.getFBMsg(scoreObj.score);
					scoreData.DScore = scoreObj.score;
			}else{
					scoreData.FBMsg = scoreObj.errorMessage;
					scoreData.DScore = "";
			}

		//	console.log('the score from new scoree is: '+scoreObj.score );
			//var oldScore = parcelMng.simulateOldCode(computeData);//for testing only
			//console.log('the score from old scoree is: '+oldScore );

			return scoreData;


		},


		getInfo: function(){
			//return computeData;
		},

/*
	Function: Void postToServer.
	Input: score, a message a key to be used.
	Output: Ajax send to server.
	Description: post to server the score and the message.
*/

		postToServer: function(score,msg,scoreKey,msgKey){
			var postSettings = computeData.postSettings || {};
			var url = postSettings.url;

			if (!scoreKey) {
				scoreKey = postSettings.score;
			}
			if (!msgKey) {
				msgKey = postSettings.msg;
			}
			var data = {};
			data[scoreKey] = score;
			data[msgKey] = msg;

			return $.post(url,JSON.stringify(data));
		},

		dynamicPost: function(data){
			var postSettings = computeData.postSettings || {};
			var url = postSettings.url;
			return $.post(url,JSON.stringify(data));
		},

		// get message according to user input
		getFBMsg: function(DScore){
			var msg = msgMan.getScoreMsg(DScore);
			return msg;
		}

	});
	return Scorer;
});