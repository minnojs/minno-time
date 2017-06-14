// ### Interactions
// The `interactions` module of the miTime is composed of pairs of conditions and actions.
// Each interaction object has both a conditions and an actions property. </br>

//        {
//            conditions: [condition1, condition2],
//            actions: [action1, action2]
//        }

define(['pipAPI'], function(APIconstructor) {

	var API = new APIconstructor();

	// ### conditions
	// `conditions` are sets of conditions that can be either true or false.
	// Each time there is an event (any input or the begining of a trial) all the conditions are evaluated.
	// In case all the conditions of an interaction are true, we execute all the `actions` associated with it.

	API.addSequence([
		// ##### begin
		// begin is a special condition that gets automaticaly fired at the begining of each trial.
		// Use it to dispaly stimuli, and setup any time based action in your task.
		{
			// &nbsp;
			input: [
				{handle:'end',on:'space'}
			],
			stimuli: [{data:{handle:'myStim'},media :{word:'[begin]: Click space to move on'}}],
			interactions: [
				// This first interaction displays the stimulus
				{
					conditions: [
						{
							// Set the condition type
							type:'begin'
						}
					],
					actions: [{type:'showStim',handle:'myStim'}]
				},
				// The second interaction is responsible for moving on (more about this in the inputEquals section)
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [{type:'endTrial'}]
				}
			]
		},


		// ##### inputEquals
		// Check if the triggering input handle is a static value.
		{
			// We set i as the right key, and e as the left key
			input: [
				{handle:'right',on:'keypressed', key:'i'},
				{handle:'left',on:'keypressed', key:'e'}
			],
			layout: [{media :{word:'[inputEquals]: Click e to move on'}}],
			interactions: [
				{
					conditions: [
						{
							// Set the condition type
							type:'inputEquals',
							// This action will only be activated if the input handle is 'left' </br>
							// Pro tip: You can pass an array to the `value` property instead of just a handle name
							value:'left'
						}
					],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### inputEqualsTrial
		// Each trial has an optional data property that holds an array of user defined values.
		// The `inputEqualsTrial` condition compares the input handle with the contents of the `property` property of the current trials data property.
		{
			// We set the leftOrRight property of trial data to 'right'
			data: {leftOrRight: 'right'},
			input: [
				{handle:'right',on:'keypressed', key:'i'},
				{handle:'left',on:'keypressed', key:'e'}
			],
			layout: [{media :{word:'[inputEqualsTrial]: Click i to move on'}}],
			interactions: [
				{
					conditions: [
						{
							// Set the condition type
							type:'inputEqualsTrial',
							// This action will only be activated if the input handle is equal to the leftOrRight property of the trial data.
							// in this case it will only be activated if the input handle is equal to 'right'.
							property:'leftOrRight'
						}
					],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### inputEqualsStim
		// Each stimulus has an optional data property that holds an array of user defined values.
		// The `inputEqualsStim` condition compares the input handle with the contents of the `property` property of the current stimulus data property.
		// Note that only stimuli in the stimuli property are checked, stimuli under layout are ignored!!
		{
			// &nbsp;
			input: [
				{handle:'right',on:'keypressed', key:'i'},
				{handle:'left',on:'keypressed', key:'e'}
			],
			stimuli: [{data:{handle:'myStim' ,leftOrRight:'left'}, media :{word:'[inputEqualsStim]: Click e to move on'}}],
			interactions: [
				// Just display the stimulus
				{
					conditions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'myStim'}]
				},
				// End trial when the correct key is pressed
				{
					conditions: [
						{
							// Set the condition type
							type:'inputEqualsStim',
							// This action will only be activated if the input handle is equal to the leftOrRight property of the stimulus data.
							// In this case it will only be activated if the input handle is equal to 'right'.
							property:'leftOrRight',
							// The handle tells the player to search for the triggering property only in stimuli with the 'myStim' handle.
							// (You can ommit the handle property and the condition activates if any of the stimuli fit the inputEqualsStim criteria)
							handle:'myStim'
						}
					],
					actions: [{type:'endTrial'}]
				}
			]
		},

		// ##### Negate
		// Sometimes we want a condition to be true only if a certain condition does NOT happen.
		// In these cases we can use the negate property to reverse a condition.
		// (when using negate you should be carefull that the condition doesn't turn out true in unexpected situations, for instance - on the begin input, or when triggering various timeouts)
		{
			data: {leftOrRight: 'right'},
			input: [
				{handle:'right',on:'keypressed', key:'i'},
				{handle:'left',on:'keypressed', key:'e'}
			],
			layout: [{media :{word:'[inputEqualsTrial+negate]: Click e to move on'}}],
			interactions: [
				{
					conditions: [
						// If input does not equal to the leftOrRight property
						{
							type:'inputEqualsTrial',
							property:'leftOrRight',
							negate: true
						},
						// And does not equal to the begin either.
						// (Without this part of the condition the endTrial action would be fired upon the begin of the trial - which isn't a right keypress)
						{
							type:'begin',
							negate:true
						}
					],
					actions: [{type:'endTrial'}]
				}
			]
		}

		// ### Actions
		// Each time there is an event (any input or the begining of a trial) all the conditions are evaluated.
		// In case all the conditions of an interaction are true, we execute all the `actions` associated with it.
		,

		// ##### Stimulus actions
		// This trial allows showing and hiding stimuli using keyboard input.
		// It also saves the status of the stimuli into the displayed property of the stimulus data object.
		{
			/* This trial marker is used in the goto trial later*/
			data: {actionStart:true},
			input: [
				{handle:'show',on:'enter'},
				{handle:'hide',on:'space'},
				{handle:'end',on:'esc'}
			],
			layout: [{location:{top:0}, media :{word:'[showStim, hideStim, endTrial]: Click escape to move on, enter to show stimulus, space to hide it'}}],
			stimuli: [{data:{handle:'myStim', displayed:false},media :{word:'MyStim'}}],
			interactions: [
				// *Display the stimulus*
				{
					conditions: [{type:'inputEquals', value:'show'}],
					actions: [
						// `type:'showStim'` displays a stimulus. `handle` defines which stimuli should be affected
						{
							type:'showStim',
							handle:'myStim'
						},
						// `typ:'setStimAttr'` logs data into the stimulus data object. </br>
						// `handle` defines which stimuli should be affected. </br>
						// `setter` is an object to merge with the current stimulus data, overinging any clashing properties.</br>
						// In this case `type:'setStimAttr'` marks displayed as true.
						{
							type:'setStimAttr',
							handle:'myStim',
							setter:{displayed:true}
						}
					]
				},
				// *Hide the stimulus*
				{
					conditions: [{type:'inputEquals', value:'hide'}],
					actions: [
						// `type:'hideStim'` displays a stimulus. `handle` defines which stimuli should be affected
						{
							type:'hideStim',
							handle:'myStim'
						},
						// In this case `type:'setStimAttr'` marks displayed as false.
						{
							type:'setStimAttr',
							handle:'myStim',
							setter:{displayed:false}
						}

					]
				},
				// *End the trial*
				{
					conditions: [{type:'inputEquals', value:'end'}],
					actions: [
						// `type:'endTrial'` ends a trial and moves us on.
						{
							type:'endTrial'
						}
					]
				}
			]
		},

		// ##### Trial Actions
		// This trial ends when space is clicked or 5 seconds have passed. </br>
		// You should note in particular the `type:'log'` action that is the way we tell the player to save the interaction and later send it to the server.
		{

			input: [
				{handle:'end',on:'space'}
			],
			layout: [{media :{word:'[Trial actions]: Click space to move on or wait 5 seconds'}}],
			interactions: [
				// *Activate timeout at the begining* </br>
				{
					conditions: [{type:'begin'}],
					actions: [
						// `type:'setInput'` creates a new input for this trial. `input` is a regular input object.
						{
							type:'setInput',
							input:{handle:'time',on:'timeout',duration:5000}
						}
					]
				},
				// *End trial on timeout*
				{
					conditions: [{type:'inputEquals', value:'time'}],
					actions: [
						{
							type:'endTrial'
						},
						// The `type:'log'` action tells the player to log this interaction.
						{
							type:'log'
						}
					]
				},
				// *End trial on click*</br>
				// On space click, remove listerner for the timeout, mark this trial as manualy terminated, log it and end trial.
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [
						// `type:'removeInput'` removes all inputs that have the `handle` handles.
						{
							type:'removeInput',
							handle	:'time'
						},
						// `type: 'setTrialAttr'` merges the values from `setter` into the trial data.
						// (setter may also take a function, see documentation)
						{
							type: 'setTrialAttr',
							setter: {terminatedManual:true}
						},
						{
							type:'log'
						},
						{
							type:'endTrial'
						}
					]
				}
			]
		},

		// ##### goto
		// The `type:'goto'` action is responsible for the next trial we move on to. It is special in that it executes only after the trial ends, so you will usualy want to follow it with an endTrial action.
		// There are many types of goto destinations, refer to the documentation for a full list.
		{

			input: [
				{handle:'restart',on:'space'},
				{handle:'end',on:'esc'}
			],
			layout: [{media :{word:'[goto]: Click space to restart actions, escape to end task'}}],
			interactions: [
				{
					conditions: [{type:'inputEquals',value:'restart'}],
					actions: [
						// `destination` defines what type of goto this is, in this case go to the last trial that has all the properties in `properties`. </br>
						// `properties` is an object to compare to the trial data. note that the properties will only compare to properties present in the raw sequence (before inheritance)! </br>
						// In this case `previousWhere` finds the first action trial which is marked by the data object {actionStart : true}
						{
							type:'goto',
							destination:'previousWhere',
							properties: {actionStart:true}
						},
						{
							type:'endTrial'
						}
					]
				},
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [
						{
							type:'endTrial'
						}
					]
				}
			]
		}
	]);

	return API.script;
});