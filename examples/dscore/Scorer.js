define(['jquery','app/API','underscore','./computeD','./msgCat','./parcelMng'],function($,API,_,computeData,msgMan,parcelMng){


	var Scorer = {};

//comment

	$.extend(Scorer, {

/*  Function: Void addSettings.
	Input: settings object.
	Output: set the settings in computeD  object or msgCat according to input
	Description: Settings for computeD or msgCat

*/
		addSettings: function(type,Obj){

			if (type =="compute"){
				computeData.setComputeObject(Obj);


			}else{
				if (type =="message") msgMan.setMsgObject(Obj);

			}

		},

/*  Function: Void init.
	Input: none.
	Output: none
	Description: make sure console.log is safe among all browsers.

*/
		init: function(){
			console || (console = {});
			console.log || (console.log = function(){});
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
		//	console.log('the score from new scoree is: '+scoreObj.score );
			//var oldScore = parcelMng.simulateOldCode(computeData);//for testing only
			//console.log('the score from old scoree is: '+oldScore );
			return scoreObj;
			//return score.toFixed(2);

		},


		getInfo: function(){

			//return computeData;

		},

/*  Function: Void postToServer.
	Input: score, a message a key to be used.
	Output: Ajax send to server.
	Description: post to server the score and the message.

*/

    	postToServer: function(score,msg,scoreKey,msgKey){

    		var postSettings = computeData.postSettings;
    		var url = postSettings.url;

    		if (scoreKey == null || scoreKey == undefined) scoreKey = postSettings.score;
    		if (msgKey == null || msgKey == undefined) msgKey = postSettings.msg;
    		var data = {};
    		data[scoreKey] =score;
    		data[msgKey] = msg;

    		$.post(url,JSON.stringify(data));


    	},

      	// get message according to user input
    	getFBMsg: function(DScore){

    		var msg = msgMan.getMsg(DScore);
    		return msg;


    	}

	});
	return Scorer;
});
