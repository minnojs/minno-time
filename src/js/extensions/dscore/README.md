# Project Implicit Scorer Component 

The Scorer component of the PIP resposible for computing the score for the tasks run in the PIP. The score is used to present the user with a the corresponding message and is also posted to the Implicit servers.


### How to Use

In the main IAT file enter the settings for the scorer according to the options coverd in 'compute settings'. 
In the main IAT get the score and the message from the scorer similiar to the folowing:

'''
DScoreObj = Scorer.computeD();
media = {css:{color:'black'},media:{html:'<h1><div><p style="font-size:12px"><color="#FFFAFA"> '+DScoreObj.FBMsg+'<br>The Score is:'+DScoreObj.DScore+'</p></div>'}};

'''



### Compute Settings

There are several settings options for the scorer that would be covered here:

* AnalyzedVar - This variable will contain the variable that will hold the latency. Defaulted to 'latency'
* ErrorVar -    This variable will contain the variable that will hold the error. Defaulted to 'error'. When set to true/1 then 				this trail is an error trial, if set false/0 then this trail is a correct trial. 
*condVar-		This variable will contain the variable that will hold the 
