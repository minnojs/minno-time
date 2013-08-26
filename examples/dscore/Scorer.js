define(['jquery','app/API','underscore','./computeD','./msgCat','./parcelMng'],function($,API,_,computeData,msgMan,parcelMng){


	var Scorer = {};

//comment

	$.extend(Scorer, {

		addSettings: function(type,Obj){

			if (type =="compute"){
				computeData.setComputeObject(Obj);

			}else{
				if (type =="message") msgMan.setMsgObject(Obj);

			}

		},

		computeD: function(Obj){


			computeData.setDataArray();
			var score = 0;
			console.log('started computeD');
			console.log(computeData);
			console.log(msgMan);
			var error = parcelMng.Init();
			parcelMng.avgAll();
			parcelMng.diffAll();
			parcelMng.varianceAll();
			score = parcelMng.scoreAll();
			console.log('the score is: '+ score);
	//		var oldScore = parcelMng.simulateOldCode();//for testing only
	//		console.log('the score from old scoree is: '+oldScore );

			return score;

		},


		getInfo: function(){

			//return computeData;

		},



    	postToServer: function(score,msg){
    		
    		var postSettings = computeData.postSettings;
    		var url = postSettings.url;
    		var scoreKey = postSettings.score;
    		var msgKey = postSettings.msg;
    		var data = {};
    		data[scoreKey] =score;
    		data[msgKey] = msg;

    		$.post(url,JSON.stringify(data));

           
    	},

      	// get message according to user input
    	getFBMsg: function(DScore, Obj){

    		var msg = msgMan.getMsg(DScore);
    		return msg;


    	}

	});
	return Scorer;
});
