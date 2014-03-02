# Project Implicit Scorer Component

The Scorer component of the PIP responsible for computing the score for the trials that runs in the PIP. The score is used to present the user with the corresponding message and is also posted to the Implicit servers.
In order to compute the score the trials are divided to parcels, the score for each parcel is computed and then the scores are averaged.

### How to Use

In the main IAT file enter the settings for the scorer according to the options covered in 'compute settings'.
In the main IAT get the score and the message from the scorer similar to the following:

```
DScoreObj = Scorer.computeD();
media = {css:{color:'black'},media:{html:'<h1><div><p style="font-size:12px"><color="#FFFAFA"> '+DScoreObj.FBMsg+'<br>The Score is:'+DScoreObj.DScore+'</p></div>'}};

```



### Compute Settings

There are several settings options for the scorer that would be covered here:

* AnalyzedVar -    Which variable to analyze. Defaulted to 'latency'.
* ErrorVar -       Which variable indicates if the trial is an error trial. Defaulted to 'score'. 1 is error, 0 no 								   error. Make sure that this variable correspond to the variable used in the API engine.
Example:

in the settings:
```
Scorer.addSettings('compute',{
		ErrorVar:'score',
		condVar:"condition",
		.......

```
in the API
```
API.addTrialSets('Default',{
		// by default each trial is correct, this is modified in case of an error
		data: {score:0},
		.....
actions: [
				{type:'showStim',handle:'error'},// show error stimulus
				{type:'setTrialAttr', setter:{score:1}}// set the score to 1
			]
		},

```

* condVar -		   The variable that indicate the condition.
* cond1VarValues - An array with the values of the condVar that will comprise of condition 1 in the comparison.
* cond2VarValues - An array with the values of the condVar that will comprise of condition 2 in the comparison.
* parcelVar -	   A variable that indicate the name for the parcels, usually it would be 'parcel'.
* parcelValue -    An array with the values for the parcels, when building the experiment sign for each trial the parcel it
				   belongs to, make sure that each parcel has trials that belong to condition 1 and condition 2.

Example:

```
Setting the Scorer:

Scorer.addSettings('compute',{
		...

		parcelVar : "parcel",
		parcelValue : ['first','second'],

		...


In the API:

{
			data: {block:3, row:1, left1:attribute1, right1:attribute2, left2:concept1, right2:concept2, condition: attribute1 + ',' + concept1 + '/' + attribute2 + ',' + concept2,parcel:'first'},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'concept1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

{
			data: {block:4, row:1, left1:attribute1, right1:attribute2, left2:concept1, right2:concept2, condition: attribute1 + ',' + concept1 + '/' + attribute2 + ',' + concept2,parcel:'second'},
			inherit: 'Default',
			stimuli: [
				{inherit:{type:'exRandom',set:'concept1_left'}},
				{inherit:{type:'random',set:'feedback'}}
			]
		},

```

* fastRT : A variable that indicates the latency that beyond it the latency is considered too fast. If the number of trials that 		   are too fast are above then maxFastTrialsRate (next variable) then an error would be generated and saved. (
		   calculation will continue thou).
* maxFastTrialsRate : Above this % of extremely fast responses within a condition, the participant is considered too fast.
* minRT : Only trials that have latency between minRT and maxRT will be calculated.
* maxRT : Only trials that have latency between minRT and maxRT will be calculated.
* maxErrorParcelRate: If the % of error trials are greater than this value then an error would be generated and saved.
* errorLatency : An object that help determine the behavior of the scorer related to error trials.
				 this objects hold three variables:
				 use - can have three values: 'latency','false' and 'penalty'.
					 latency -  is the default, when set the scorer will use trials that are error in its calculations.
					 false - when set the scorer will not use trials that are errors in its calculation.
					 penalty - when set the scorer will add the latency average and the penalty as set in the penalty variable to the latency of error trials.
     			 penalty: The penalty that will be added to error trials if use:'penalty'.
     			 useForSTD: If true error trials would be used in the calculation of variance.

Example
```
Scorer.addSettings('compute',{

		fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
		maxFastTrialsRate : 0.1,
		minRT : 400,
		maxRT : 10000, //above this
		errorLatency : {use:"latency", penalty:600, useForSTD:true},//ignore error responses

		....

```

* postSettings : Used to determine the url and variable to send to the implicit server.

Example:

```
postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
```

### Messages

The `Scorer.addSetings` function may be used in order to create feedback messages too.

```js
	Scorer.addSettings('message',{
		manyErrors: "Not enough correct responses",
		tooFast: "Too many fast trials",
		notEnough: "Not enough correct responses",
		MessageDef: [
			{ cut:'-0.65', message:'Your data suggest a strong implicit preference for Black People compared to White People' },
			{ cut:'-0.35', message:'Your data suggest a moderate implicit preference for Black People compared to White People.' },
			{ cut:'-0.15', message:'Your data suggest a slight implicit preference for Black People compared to White People.' },
			{ cut:'0', message:'Your data suggest little to no difference in implicit preference between Black People and White People.' },
			{ cut:'0.15', message:'Your data suggest a slight implicit preference for White People compared to Black People' },
			{ cut:'0.35', message:'Your data suggest a moderate implicit preference for White People compared to Black People' },
			{ cut:'0.65', message:'Your data suggest a strong implicit preference for White People compared to Black People' }
		]
	});
```

`manyErrors` is the feedback in case the user did not give enough correct responses.

`tooFast` is the feedback in case there were too many fast trials.

`notEnough` is the feedback in case we don't have enough correct responses to compute the score.

`MessageDef` is an array cutoff scores and messages for interpreting the results.