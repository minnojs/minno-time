/**
 * Essentialy a defaults object for the scorer
 */
define(function(require){
	var $ = require('jquery');

	function ComputeD(){
		$.extend(this, {
			dataArray : {}, //The data array or structure the PIP will provide
			AnalyzedVar : "latency", //The main variable used for the score computation. Usually will be the latency.
			ErrorVar : "error", //The variable that indicates whether there was an error in the response
			condVar:"",  //The name of the variable that will store the variables
			cond1VarValues: [], //An array with the values of the condVar that will comprise of condition 1 in the comparison
			cond2VarValues: [], //An array with the values of the condVar that will comprise of condition 2 in the comparison
			parcelVar : "",
			parcelValue : [],
			fastRT : 300, //Below this reaction time, the latency is considered extremely fast.
			maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
			minRT : 400, //Below this latency
			maxRT : 10000, //above this
			maxErrorParcelRate: 0.4,
			errorLatency : {use:"latency", penalty:600, useForSTD:true},
			postSettings : {}
		});
	}

	$.extend(ComputeD.prototype, {
		setComputeObject: function(obj){
			$.extend(this,obj);
		},

		setDataArray: function(){
			// use the real global in order to preven problems with dependencies
			var global = window.piGlobal;

			this.dataArray = global.current.logs;
		}

	});

	return ComputeD;
});