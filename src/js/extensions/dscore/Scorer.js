define(function(require){

	var $ = require('jquery')
		, ComputeData = require('./computeD')
		, MsgMan = require('./msgMan')
		, ParcelMng = require('./parcelMng');

	// Description: make sure console.log is safe among all browsers.
	// js hint thinks that console is read only - and its correct except where it doesn't exist...  this is how we tell it to ignore these lines
	/* jshint -W020 */
	!!window.console || (console = {log: $.noop, error: $.noop});
	console.log || (console.log = $.noop);
	/* jshint +W020 */



	function Scorer(){
		this.computeData = new ComputeData();
		this.msgMan = new MsgMan();
		this.parcelMng = new ParcelMng(this.msgMan);
	}

	$.extend(Scorer.prototype, {

		/**
		 * Set settings for computeD or msgMan
		 * @param {String} type 'compute' or 'message' - the type of settingsObj to set
		 * @param {Object} Obj  The settings object itself
		 */
		addSettings: function(type,Obj){
			switch (type){
				case 'compute':
					this.computeData.setComputeObject(Obj);
					break;
				case 'message':
					this.msgMan.setMsgObject(Obj);
					break;
				default:
					throw new Error('SCORER:addSettings: unknow "type" ' + type);
			}
		},

		/**
		 * Calculate the score
		 * @return {Object} an object that holds the score and an error message
		 */
		computeD: function(){
			var computeData = this.computeData;
			var parcelMng = this.parcelMng;

			computeData.setDataArray();

			parcelMng.Init(computeData);
			parcelMng.avgAll(computeData);

			parcelMng.varianceAll(computeData);
			parcelMng.scoreAll(computeData);

			var scoreObj = parcelMng.scoreData;

			if (scoreObj.errorMessage === undefined || scoreObj.errorMessage === null){
				return {
					FBMsg : this.getFBMsg(scoreObj.score),
					DScore : scoreObj.score,
					error: false
				};
			}else{
				return {
					FBMsg : scoreObj.errorMessage,
					DScore : '',
					error: true
				};
			}
		},

		/**
		 * Post the score and message to the server
		 * @param  {[type]} score    [description]
		 * @param  {[type]} msg      [description]
		 * @param  {String} scoreKey The key with which to send the score data
		 * @param  {String} msgKey   The key with which to send the msg data
		 * @return {promise}         A promise that is resolved with the post
		 */
		postToServer: function(score,msg,scoreKey,msgKey){
			var postSettings = this.computeData.postSettings || {};
			var url = postSettings.url;
			var data = {};

			if (!scoreKey) {
				scoreKey = postSettings.score;
			}

			if (!msgKey) {
				msgKey = postSettings.msg;
			}

			// create post object
			data[scoreKey] = score;
			data[msgKey] = msg;

			return $.post(url,JSON.stringify(data));
		},

		/**
		 * Blindly post all "data" to the server
		 * @param  {Object} data Arbitrary data to be sent to the server
		 * @return {promise}      A promise that is resolved with the post
		 */
		dynamicPost: function(data){
			var postSettings = this.computeData.postSettings || {};
			var url = postSettings.url;

			return $.post(url,JSON.stringify(data));
		},

		// get message according to user input
		getFBMsg: function(DScore){
			var msg = this.msgMan.getScoreMsg(DScore);
			return msg;
		}

	});
	return Scorer;
});