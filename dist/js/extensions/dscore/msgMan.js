define(['jquery','underscore'],function($,_){

	var messages = {
		MessageDef:[],
		manyErrors: "There were too many errors made to determine a result.",
		tooFast: "There were too many fast trials to determine a result.",
		notEnough: "There were not enough trials to determine a result."
	};

	var msgMan = {
		setMsgObject: function(Obj){
			$.extend(messages,Obj);
		},

		getScoreMsg: function(score){

			var array = messages.MessageDef;
			if (!array || !array.length){
				throw new Error('You must define a "MessageDef" array.');
			}

			var scoreNum = parseFloat(score);
			var cut = null;
			var msg = null;
			var rightMsg = 'error: msg was not set';
			var set = false;

			// @TODO repleace this whole section with a "_.find()" or something.
			_.each(array, function(val) {
				cut = parseFloat(val.cut);
				msg = val.message;
				if (scoreNum<=cut && !set){
					rightMsg = msg;
					set = true;
				}
			});

			if (!set){
				var length = array.length;
				var obj = array[length-1];
				rightMsg = obj.message;
			}
			return rightMsg;
		},

		getMessage: function getMessage(type){
			return messages[type];
		}
	};

	return msgMan;
});