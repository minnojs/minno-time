define(function(require){
    /*
     * Organizer for the interaction function
     * Allows to subscribe and unsubscribe
     *
     */

    var pubsub = require('utils/pubsub')
        , evaluate = require('./evaluate')
        , activate = require('./action')
        , currentTrial = require('app/trial/current_trial');

    var subscriptionStack = window.a = [];

    function interact(interactions,input_data){
        var trial = currentTrial();
        var i, interaction;

        input_data.trialId = trial._id;
        input_data.trialCounter = trial.counter;

        // use an explicit loop because we need to break
        for (i=0; i<interactions.length; i++){
            interaction = interactions[i];
            if (evaluate(interaction.conditions,input_data)) {
                // if this action includes endTrial we want to stop evalutation
                // otherwise we might evaluate using data from the next trial by accident...
                if ( !activate(interaction.actions,input_data) ) break;
            }
        }
    }

    return {
        activate : function(interactions){
            // subscribe to input and interact with each input
            pubsub.subscribe('input',subscriptionStack,function(input_data){
                interact(interactions,input_data);
            });

            // start by checking for "begin" actions (must be after subscribing!)
            interact(interactions,{type:'begin', latency:0});
        },
        disable : function(){
            // unsubscribe from all interactions
            subscriptionStack.forEach(pubsub.unsubscribe.bind(pubsub));
            // clean substack
            subscriptionStack.length = 0;
        }
    };
});
