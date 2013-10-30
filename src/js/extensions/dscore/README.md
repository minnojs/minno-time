# Project Implicit Scorer Component 

The Scorer component of the PIP resposible for computing the score for the trials that run in the PIP. The score is used to present the user with a the corresponding message and is also posted to the Implicit servers.
In order to compute the score the trials are devided to parcels, the score for each parcel is computed and then the scores are avarged. 

### How to Use

In the main IAT file enter the settings for the scorer according to the options coverd in 'compute settings'. 
In the main IAT get the score and the message from the scorer similiar to the folowing:

```
DScoreObj = Scorer.computeD();
media = {css:{color:'black'},media:{html:'<h1><div><p style="font-size:12px"><color="#FFFAFA"> '+DScoreObj.FBMsg+'<br>The Score is:'+DScoreObj.DScore+'</p></div>'}};

```



### Compute Settings

There are several settings options for the scorer that would be covered here:

* AnalyzedVar -    Which variable to analyze. Defaulted to 'latency'.
* ErrorVar -       Which variable indicates if the trial is an error trial. Defaulted to 'score'. 1 is error, 0 no 								   error. Make sure that this variable corresponde to the variable used in the API engine.
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

