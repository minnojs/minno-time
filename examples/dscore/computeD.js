
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
			errorLatency : {use:"latency", penalty:600, useForSTD:true}
			//ignoreErr : false, // if this is true then if error per 
			//userErrLatency : true, //if this is true then consider only trials that are between minRT  and maxRT
			//useErrSTD : true,//?

		};

		$.extend(computeD, {

			setComputeObject: function(Obj){
				
				 if (Obj.AnalyzedVar != null)  this.AnalyzedVar = Obj.AnalyzedVar ;
				 if (Obj.ErrorVar != null) this.ErrorVar = Obj.ErrorVar;
				 if (Obj.condVar != null) this.condVar = Obj.condVar;
				 if (Obj.cond1VarValues != null) this.cond1VarValues = Obj.cond1VarValues;
				 if (Obj.cond2VarValues != null) this.cond2VarValues = Obj.cond2VarValues;
				 if (Obj.parcelVar != null) this.parcelVar = Obj.parcelVar;
				 if (Obj.parcelValue != null) this.parcelValue = Obj.parcelValue;
				 if (Obj.fastRT != null) this.fastRT = Obj.fastRT;
				 if (Obj.maxFastTrialsRate != null) this.maxFastTrialsRate = Obj.maxFastTrialsRate;
				 if (Obj.minRT != null) this.minRT = Obj.minRT;
				 if (Obj.maxRT != null) this.maxRT = Obj.maxRT;
				 if (Obj.errorLatency != null) this.errorLatency = Obj.errorLatency;
				 // if (Obj.userErrLatency != null) this.userErrLatency = Obj.userErrLatency;
				 // if (Obj.correctExtreme != null) this.correctExtreme = Obj.correctExtreme;
				 // if (Obj.useErrSTD != null) this.useErrSTD = Obj.useErrSTD;
	
			},
			setDataArray: function(){

				this.dataArray = API.getLogs();

			}

			

		});

	return computeD;
			

});