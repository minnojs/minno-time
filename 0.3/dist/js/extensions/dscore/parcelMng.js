define(function(require){

	var _ = require('underscore');

	function ParcelMng(msgMan){
		this.parcelArray = []; // Holds parcel array
		this.scoreData = {}; // Holds score and error message
		this.msgMan = msgMan;
	}

	_.extend(ParcelMng.prototype, {

/*  Method: Void Init
	Input: Uses logs from API
	Output: Sets parcelArray with array of type parcel
	Description: Init goes over the log and creates an array of object of type Parcel according to
	the parcelValue array in computeD. Each parcel object holds relevant information regarding the
	parcel including an array of trials with the relevant parcel name.


*/
		Init: function(compute){
			var parcelMng = this;
			var msgMan = this.msgMan;
			// use the real global in order to prevent problems with dependencies
			var global = window.piGlobal;

			var data = global.current.logs;
			parcelMng.parcelArray = [];
			parcelMng.scoreData = {};
			parcelMng.msgMan = msgMan;

			// get settings
			var AnalyzedVar = compute.AnalyzedVar;
			var error = compute.ErrorVar;
			var parcelVar = compute.parcelVar;
			var parcels = compute.parcelValue;
			var min = compute.minRT;
			var max = compute.maxRT;
			var fastRT= compute.fastRT;

			// set counters
			var totalScoredTrials = 0;
			var trialsUnder = 0;
			var totalTrials=0;
			var totalErrorTrials =0;
			var maxFastTrialsRate = parseFloat(compute.maxFastTrialsRate);


			if (typeof parcels == 'undefined' || parcels.length === 0){
				totalTrials =0;
				totalScoredTrials=0;
				trialsUnder=0;
				totalErrorTrials=0;
				var p = {};
				p.name = 'general';
				p.trialIData = [];
				_.each (data, function (value) {// loop per object in logger
						if (value[AnalyzedVar]>=min && value[AnalyzedVar]<=max){
							totalTrials++;
							if (value.data[error] == 1) {
								totalErrorTrials++;
							}
							//p.trialIData.push(value);//push all data
							//totalScoredTrials++;
							if (parcelMng.validate(p,value,compute)) {
								totalScoredTrials++;
							}
						}else {
							if (value[AnalyzedVar]<= fastRT) {
								trialsUnder++;
							}
						}
				});
				parcelMng.checkErrors(totalTrials,totalErrorTrials,compute);
				parcelMng.parcelArray[0] = p;
			} else {
				_.each (parcels, function(parcelName,index) {// per parcel from parcelValue
					//set variables calculated per parcel
					totalTrials =0;
					totalScoredTrials=0;
					trialsUnder=0;
					totalErrorTrials=0;
					var p = {};
					p.name = parcelName;
					p.trialIData = [];
					///////////////////////////////////
					_.each (data, function (value) {//loop per object in logger
						var trialParcelName = value.data[parcelVar];

						// if this trial belongs to parcel
						if (trialParcelName == parcelName){
							if (value[AnalyzedVar]>=min && value[AnalyzedVar]<=max){
								totalTrials++;
								if (value.data[error] == 1) {
									totalErrorTrials++;
								}
								//p.trialIData.push(value);//push all data
								//totalScoredTrials++;
								if (parcelMng.validate(p,value,compute)) {
									totalScoredTrials++;
								}
							}else {
								if (value[AnalyzedVar]<= fastRT) {
									trialsUnder++;
								}
							}

						}

					});
					parcelMng.checkErrors(totalTrials,totalErrorTrials,compute);//apply maxErrorParcelRate logic
					parcelMng.parcelArray[index] = p;
				});
			}
			if ( (trialsUnder/totalScoredTrials) > maxFastTrialsRate){
				parcelMng.scoreData.errorMessage = this.msgMan.getMessage('tooFast');

			}

		},

/*
	private
	Method: Void checkErrors
	Input: totalTrials,totalErrorTrials and compute object.
	Output: Sets scoreData with error message if relevant.
	Description: Helper method to check for errors according to maxErrorParcelRate from compute object.
	sets an error message in scoreData.

*/
		checkErrors: function(totalTrials,totalErrorTrials,compute){

			var maxErrorParcelRate = compute.maxErrorParcelRate;
			if (totalErrorTrials/totalTrials > maxErrorParcelRate){
				this.scoreData.errorMessage = this.msgMan.getMessage('manyErrors');

			}

		},

/* Function: Void validate.
	Input: parcel object, trial object from the log and the compute object.
	Output: Pushes the trial to the parcel based on information from errorLatency. Returns true/false.
	Description: Helper method to apply errorLatency logic. If set to 'latency' trials witch are error
	would be added to the parcel trial array. if set to false trials that are error would not be added,
	if set to panelty error trials will be added and later panelized.

*/

		validate: function(p,value,compute){
			var errorLatency = compute.errorLatency;
			var error = compute.ErrorVar;
			var data = value.data;


			if (errorLatency.use =='latency'){
				p.trialIData.push(value);
				return true;
			}else{
				if (errorLatency.use =='false'){
					if(data[error]=='1'){
						return false;
					}else{
						p.trialIData.push(value);
						return true;
					}
				}
				if(errorLatency.use =='penalty'){
					p.trialIData.push(value);
					return true;
				}
			}
		},

/*  Function: Void addPenalty.
	Input: parcel object and the compute object.
	Output: adds penalty to latency of trials
	Description: Helper method to add average and penalty to error trials
	if errorLatency is set to 'penalty'. Should be called after avgAll.

*/

		addPenalty: function(p,compute){
			var errorLatency = compute.errorLatency;
			var parcelMng = this;


			if (errorLatency.use == 'penalty'){

				var penalty = parseFloat(errorLatency.penalty);
				var ErrorVar = compute.ErrorVar;
				var AnalyzedVar = compute.AnalyzedVar;
				var condVar = compute.condVar;
				var cond1 = compute.cond1VarValues;
				var cond2 = compute.cond2VarValues;
				var trialIData = p.trialIData;
				var avg1 = p.avgCon1;
				var avg2 = p.avgCon2;


				_.each (trialIData, function (value) {
					var data = value.data;
					var error = data[ErrorVar];
					var dataCond = data[condVar];
					var diff1 = parcelMng.checkArray(dataCond,cond1);
					var diff2 = parcelMng.checkArray(dataCond,cond2);

					if (error=='1'){
						if (diff1){
							value[AnalyzedVar] += avg1+ penalty;
						}else{
							if (diff2){
								value[AnalyzedVar] += avg2+ penalty;
							}
						}

					}
				});

			}
		},

/*  Function: Void avgAll.
	Input: compute object.
	Output: setting avgCon1 and avgCon2
	Description: Loop over the parcels and Set average for condition 1 trials and for condition 2 trials.

*/

		avgAll: function(compute){
			var parcelMng = this;
			_.each(parcelMng.parcelArray, function (value) {
				parcelMng.avgParcel(value,compute);
			});
		},


/*
	private
	Function: Void avgParcel.
	Input: compute object, parcel.
	Output: setting avgCon1 and avgCon2 in parcel.
	Description: Set average for condition 1 trials and for condition 2 trials in the parcel.

*/

		avgParcel: function(p,compute){
			var parcelMng = this;
			var trialIData = p.trialIData;
			var condVar = compute.condVar;
			var cond1 = compute.cond1VarValues;
			var cond2 = compute.cond2VarValues;
			var AnalyzedVar = compute.AnalyzedVar;
			var avgCon1 = 0;
			var avgCon2 = 0;
			var avgBoth = 0;
			var numCond1 = 0;
			var numCond2 = 0;
			var numBoth = 0;

			_.each (trialIData, function (value) {

				var AnVar = value[AnalyzedVar];
				var data = value.data;
				avgBoth += AnVar;
				numBoth ++;
				//var diff1 = ( _(data[condVar]).difference(cond1) );
				//var diff2 = ( _(data[condVar]).difference(cond2) );
				var dataCond = data[condVar];
				var diff1 = parcelMng.checkArray(dataCond,cond1);
				var diff2 = parcelMng.checkArray(dataCond,cond2);

				if (diff1) {
					numCond1++;
					avgCon1 += AnVar;
				} else {
					if (diff2){
						numCond2++;
						avgCon2 += AnVar;
					}
				}

			});
			if (numCond1 <= 2 || numCond2 <= 2){
				parcelMng.scoreData.errorMessage = this.msgMan.getMessage("notEnough");
			}
			if (numCond1 !== 0) {
				avgCon1 = avgCon1/numCond1;
			}
			if (numCond2 !== 0) {
				avgCon2 = avgCon2/numCond2;
			}
			p.avgCon1 = avgCon1;
			p.avgCon2 = avgCon2;
			p.diff = p.avgCon1 - p.avgCon2;
			if (numBoth !== 0) {
				p.avgBoth = avgBoth/numBoth;
			}
			parcelMng.addPenalty(p,compute);
		},

/*  Function: Void checkArray.
	Input: the condition from the trial and an array of condition from computeD object.
	Output: return true if condition is in the array.
	Description: Helper function that returns true if condition is in the array or false otherwise.

*/

		checkArray: function(conFromData,con){
			for(var i=0; i<con.length; i++){
				var condition = con[i];
				if (condition == conFromData ){
					return true;
				}
			}

			return false;
		},

/*  Function: Void varianceAll.
	Input: compute object, parcel.
	Output: variance variable in parcel.
	Description: Loop over the parcels and set the variance variable.

*/

		varianceAll: function(compute){
			var parcelMng = this;
			_.each (parcelMng.parcelArray, function (value) {
				parcelMng.varianceParcel(value,compute);
			});
		},

/*  Function: Void varianceParcel.
	Input: compute object, parcel.
	Output: setting variance variable in parcel.
	Description: goes over the trials of the parcel and calculate variance.

*/
		varianceParcel: function(p,compute){
			var parcelMng = this;
			var AnalyzedVar = compute.AnalyzedVar;
			var trialIData = p.trialIData;
			var cond1 = compute.cond1VarValues;
			var cond2 = compute.cond2VarValues;
			var condVar = compute.condVar;
			var avg = p.avgBoth;
			var d = 0;
			var x2 = 0;
			var pooledCond1 = [];
			var pooledCond2 = [];
			var pooledData = [];
			var errorLatency = compute.errorLatency;
			var useForSTD = errorLatency.useForSTD;


			_.each (trialIData, function (value) {//pool to one array
				var data = value.data;
				var AnVar = value[AnalyzedVar];
				var ErrorVar = compute.ErrorVar;
				var error = data[ErrorVar];
				var dataCond = data[condVar];
				var diff1 = parcelMng.checkArray(dataCond,cond1);
				var diff2 = parcelMng.checkArray(dataCond,cond2);
				//var diff1 = ( _(data[condVar]).difference(cond1) );
				//var diff2 = ( _(data[condVar]).difference(cond2) );
				if (diff1) {
					if (useForSTD){
						pooledCond1.push(AnVar);
					}
					else{
						if (error=='0') {
							pooledCond1.push(AnVar);
						}
					}
				}
				else {
					if (diff2){
						if (useForSTD){
							pooledCond2.push(AnVar);
						}
						else{
							if (error=='0') {
								pooledCond1.push(AnVar);
							}
						}

					}
				}


			});

			pooledData = pooledCond1.concat(pooledCond2);
			_.each (pooledData, function (value) {//pool to one array
				var AnVar = value;
				d = AnVar-avg;
				x2 += d*d;

			});
			p.variance = x2/(pooledData.length-1);
		},


/*  Function: Void scoreAll.
	Input: compute object.
	Output: score variable in scoreData object
	Description: Average the scores from all parcels set score in scoreData object.

*/
		scoreAll: function(compute){
			var parcelMng = this;
			var dAvg = 0;
			_.each (parcelMng.parcelArray, function (value) {
				parcelMng.scoreParcel(value,compute);
				dAvg +=  value.score;
			});
			var score = (dAvg/(parcelMng.parcelArray.length));
			parcelMng.scoreData.score = score.toFixed(2);

		},

/*
	private
	Function: Void scoreParcel.
	Input: compute object, parcel.
	Output: score variable in parcel
	Description: Calculate the score for the parcel.

*/
		scoreParcel: function(p){
			var parcelMng = this;
			var sd = Math.sqrt(p.variance);
			if (sd === 0){
				parcelMng.scoreData.errorMessage = this.msgMan.getMessage("notEnough");
				p.score = p.diff;
			} else {
				p.score = p.diff/sd;
			}
		}

	});

	return ParcelMng;
});