define(['jquery','underscore'],function($,_){

	var msgCat = {
		mesCatArray:[]
		

	};
		


	$.extend(msgCat,{

		setMsgObject: function(Obj){
			this.mesCatArray = Obj.MessageDef;
		
		},

		getMsg: function(score){

			var array = this.mesCatArray;
			var scoreNum = parseFloat(score);
			console.log('entering getMsg'+scoreNum);
			console.log(array);
			var cut = null;
			var msg = null;
			var rightMsg = 'error: msg was not set';
			var set = false;
			var count =0;
			_.each(array, function(val,key) {
				cut = parseFloat(val.cut);
				msg = val.message;
				console.log(cut);
				console.log(msg);
				if (scoreNum<=cut && set ==false){
					rightMsg = msg;
					set = true;

				} 
				count++;
			});
			
			if (array.length ==count){
				var obj = array[count-1];
				rightMsg = obj.message;
			} 
			return rightMsg;
		}

	});
	return msgCat;
			

});