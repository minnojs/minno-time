# API

The Scorer component of the miTime is an implementation of the D-score algorithm for computing IAT scores. The scorer allows creating an appropriate feedback message for the users, as well as logging them to the server.
In order to compute the score the trials are divided to parcels, the score for each parcel is computed and then the scores are averaged.

### Table of contents

- [How to Use](#how-to-use)
- [Settings: compute](#settings-compute)
	- [Parcels](#parcels)
	- [errorLatency](#errorlatency)
- [Settings: message](#settings-message)
- [Posting to the server.](#posting-to-the-server)
	- [dynamicPost](#dynamicpost)
	- [postToServer](#posttoserver)

### How to Use

Create instance of the scorer:

```javascript
var scorer = new Scorer();
```

Set the settings for the scorer as covered in [compute](#settings-compute), and [messages](#settings-message).

The scorer has two sets of settings; [compute](#settings-compute), and [messages](#settings-message). The first has to do with the way the score is computed, the second allows you to customize the feedback messages that the scorer creates. Each takes an object with an assortment of properties as described below.
You can set the different settings using the following commands:

```javascript
scorer.addSettings('compute',computeObj);
scorer.addSettings('message',messageObj);
```

Get the score and the message from the scorer (make sure that you do this in a function that is called at the end of the miTime task, after the scores are collected);

```javascript
var DScoreObj = scorer.computeD();
```

### computeD
The computeD function activates the scorer and returns an object with the score and feedback message.

```javascript
var DScoreObj = scorer.computeD();
```

The DscoreObj has the following properties:

Property 			| Description
--------------- 	| -----------
Dscore 				| The computed score for this task (if an error was encountered the score will be an empty string).
FBMsg 				| The feedback message (either a score message or an error message).
error 				| (true or false) whether an error has happened.

### Settings: compute
The compute settings affects the way that the final score is computed. In order to use it you set an object into the compute setting. The available properties are described below.

```javascript
scorer.addSettings('compute',{
	property : value
});
```


Property 			| Description
--------------- 	| -----------
AnalyzedVar 		| Which variable to analyze. Defaulted to 'latency'.
ErrorVar 			| Which data property marks the trial as an error trial (default: 'score'). 1 is considered an error, 0 no error.
condVar 			| The variable that indicate the condition (default: 'condition').
cond1VarValues 		| An array with the values of the condVar that will comprise of condition 1 in the comparison.
cond2VarValues 		| An array with the values of the condVar that will comprise of condition 2 in the comparison.
parcelVar 			| A variable that indicate the name for the parcels (default: 'parcel').
parcelValue 		| An array with the values for the parcels. When building the experiment mark each trial with the parcel it belongs to, make sure that each parcel has trials that belong to both to condition 1 and condition 2.
fastRT 				| A variable that indicates the latency limit beyond which the latency is considered too fast. (also see the `maxFastTrialsRate` property)
maxFastTrialsRate 	| The percentage of fast trials we are willing to tolerate. Above this % of extremely fast responses within a condition, the participant is considered too fast. If the number of trials that are too fast is too hight then an error message will be generated and saved (calculation will continue though).
minRT 				| Only trials that have latency between minRT and maxRT will be calculated.
maxRT 				| Only trials that have latency between minRT and maxRT will be calculated.
maxErrorParcelRate 	| If the % of error trials are greater than this value then an error will be generated and saved.
errorLatency 		| An object that determines the behavior of the scorer n relation to error trials. The object has three properties: `use`, `latency` and `useForSTD`. See documentation [below](#errorLatency).
postSettings 		| An object used to determine the url and variable to send to the implicit server when any of the post methods are used. It has three properties; `score`: the default key to which the score is set. `msg`: the default key to which the message is set. `url`: the url to which the data is sent. More about posting [here](#posting-to-the-server).

#### Parcels
First we set up the parcels:

```javascript
scorer.addSettings('compute',{
		...
		parcelVar : "parcel",
		parcelValue : ['first','second'],
		...
});
```

Then set up the assorted trial parcels.
```javascript
	{
		data: {parcel:'first' ...},
		...
	},
	{
		data: {parcel:'second' ...},
		...
	}
```

Each parcel will be computed separately, and the final score will be the average of all parcels.

#### errorLatency
The `errorLatency` property takes an object with the following properties.

Property 			| Description
--------------- 	| -----------
use 				| May have three values: `latency` (the default): the scorer will include error trials. `false`: the scorer will ignore error trials. `penalty`: the scorer will add a penalty to the the latency of error trials (see penalty property).
penalty 			| The penalty that will be added to error trials if `use`is set to 'penalty'.
useForSTD 			| If true error trials will be used in calculations of variance.

The following examples shows a setting that penalizes mistakes by 600ms, and includes them in variance calculations.
```
scorer.addSettings('compute',{
		....
		errorLatency : {use:"penalty", penalty:600, useForSTD:true},
		....
}
```

### Settings: message

The message setting affects the feedback messages that the scorer produces. In order to use it you set an object into the message setting. The available properties are described below.

```javascript
scorer.addSettings('message',{
	property : value
});
```

Property 			| Description
--------------- 	| -----------
manyErrors			| The feedback in case the user did not give enough correct responses.
tooFast				| The feedback in case there were too many fast trials.
notEnough			| The feedback in case we don't have enough correct responses to compute the score.
MessageDef			| An array of cutoff scores and messages for interpreting the results. Scores that fall between two cutoffs will be associated with the cutoff above them. Scores below the lowest cutoff will be associated with the lowest cutoff. Scores above the highest cutoff cause trouble! set your cutoff high enough so that this never happens.


For example:

```javascript
	scorer.addSettings('message',{
		manyErrors: "There were too many errors made to determine a result.",
		tooFast: "There were too many fast trials to determine a result.",
		notEnough: "There were not enough trials to determine a result."
		MessageDef: [
			{ cut:'-0.65', message:'strong preference left' },
			{ cut:'-0.35', message:'moderate preference left' },
			{ cut:'-0.15', message:'slight preference left' },
			{ cut:'0.15', message:'little to no preference' },
			{ cut:'0.35', message:'slight preference right' },
			{ cut:'0.65', message:'moderate preference right' },
			{ cut:'5', message:'strong preference right' }
		]
	});
```


### Posting to the server.

The scorer offers two methods for posting scorer data to the server. The preferable method is using the scorer function `dynamicPost`. We keep the deprecated function `postToServer` only for backward compatibility.

You can and should set the post settings in the `postSettings` property of the [compute setting](#settings-compute). Most notably, that is where you set the target URL.

```javascript
scorer.addSettings('compute',{
	postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
});
```


#### dynamicPost
This function takes an object, jsonifies it, and sends it to the server. It returns a jQuery promise so you can do anything that you like after it finishes.

```javascript
// Compute score
var DScoreObj = scorer.computeD();
// Post to the server
scorer.dynamicPost({
	score: DScoreObj.DScore,
	feedback: DScoreObj.FBMsg
}).always(function(){ // always run the following code, even if the post failed.
	top.location.href = "/my/next/url/";
});
```

#### postToServer
This method is deprecated. Use [dynamicPost](#dynamicpost) instead.

If you need to use it anyway, The syntax is like so:
```javascript
// Compute score
var DScoreObj = scorer.computeD();
var score = DScoreObj.DScore,
var feedback = DScoreObj.FBMsg
var score = 'score';
var msg = 'feedback';

// post to server
scorer.postToServer(score, msg, scoreKey, msgKey);
```

Where the arguments are as follows:

Argument 			| Description
--------------- 	| -----------
score 				| The task score (required).
msg 				| The feedback message (required).
scoreKey 			| The key for the score data (optional, uses the `postSettings` property `score` by default).
msgKey 				|  The key for the message data (optional, uses the `postSettings` property `msg` by default).
