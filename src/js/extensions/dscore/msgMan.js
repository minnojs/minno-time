define(function(require){
	var _ = require('underscore');

	var messages = {
		MessageDef:[],
		manyErrors: "There were too many errors made to determine a result.",
		tooFast: "There were too many fast trials to determine a result.",
		notEnough: "There were not enough trials to determine a result."
	};

	function Message(){
		// setup default local messages
		this.messages = _.extend({}, messages);
	}

	_.extend(Message.prototype, {

		/**
		 * Setup custom local messages
		 * @param {Object} Obj 	messages object
		 */
		setMsgObject: function(Obj){
			_.extend(this.messages,Obj);
		},

		getScoreMsg: function(score){

			var array = this.messages.MessageDef;

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
			return this.messages[type];
		}
	});

	return Message;
});