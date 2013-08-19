define(['jquery','app/API','underscore','./computeD','./msgCat','./parcelMng'],function($,API,_,computeData,msgMan,parcelMng){


	var Scorer = {};



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



    	postToServer: function(url,score,msg){
    		var data = {};
    		data.score =score;
    		data.msg = msg;

    		$.post(url,data).done( function(retdata){
    			console.log(retdata);


    		});

    	},

      	// get message according to user input
    	getFBMsg: function(DScore, Obj){

    		var msg = msgMan.getMsg(DScore);
    		return msg;


    	}

	});
	return Scorer;
});
