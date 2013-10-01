
define(['jquery','app/API'],function($,API){


		var computeD = {

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
			//ignoreErr : false, //if this is true then if error per
			//userErrLatency : true, //if this is true then consider only trials that are between minRT  and maxRT
			//useErrSTD : true,//?

		};

		$.extend(computeD, {

			setComputeObject: function(Obj){

				if (typeof Obj.AnalyzedVar == 'undefined') {this.AnalyzedVar = Obj.AnalyzedVar ;}
				if (typeof Obj.ErrorVar == 'undefined') {this.ErrorVar = Obj.ErrorVar;}
				if (typeof Obj.condVar == 'undefined') {this.condVar = Obj.condVar;}
				if (typeof Obj.cond1VarValues == 'undefined') {this.cond1VarValues = Obj.cond1VarValues;}
				if (typeof Obj.cond2VarValues == 'undefined') {this.cond2VarValues = Obj.cond2VarValues;}
				if (typeof Obj.parcelVar == 'undefined') {this.parcelVar = Obj.parcelVar;}
				if (typeof Obj.parcelValue == 'undefined') {this.parcelValue = Obj.parcelValue;}
				if (typeof Obj.fastRT == 'undefined') {this.fastRT = Obj.fastRT;}
				if (typeof Obj.maxFastTrialsRate == 'undefined') {this.maxFastTrialsRate = Obj.maxFastTrialsRate;}
				if (typeof Obj.minRT == 'undefined') {this.minRT = Obj.minRT;}
				if (typeof Obj.maxRT == 'undefined') {this.maxRT = Obj.maxRT;}
				if (typeof Obj.errorLatency == 'undefined') {this.errorLatency = Obj.errorLatency;}
				if (typeof Obj.postSettings == 'undefined') {this.postSettings = Obj.postSettings;}
				if (typeof Obj.maxErrorParcelRate == 'undefined') {this.maxErrorParcelRate = Obj.maxErrorParcelRate;}
				//if (typeof Obj.userErrLatency == 'undefined') this.userErrLatency = Obj.userErrLatency;
				//if (typeof Obj.correctExtreme == 'undefined') this.correctExtreme = Obj.correctExtreme;
				//if (typeof Obj.useErrSTD == 'undefined') this.useErrSTD = Obj.useErrSTD;
			},

			setDataArray: function(){
				this.dataArray = API.getLogs();
			}
		});

	return computeD;


});