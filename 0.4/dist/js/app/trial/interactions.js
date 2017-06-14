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
        var i, interaction, conditionTrue;;
        var isDebug = trial._source.DEBUG && window.DEBUG;

        input_data.trialId = trial._id;
        input_data.trialCounter = trial.counter;

        /* eslint no-console:false */
        if (isDebug) console.groupColapsed('Event: ' + (input_data.handle || input_data.type), input_data);
        /* eslint no-console:true */

        // use an explicit loop because we need to break
        for (i=0; i<interactions.length; i++){
            interaction = interactions[i];
            conditionTrue = evaluate(interaction.conditions,input_data);

            /* eslint no-console:false */
            if (isDebug) console.log(conditionTrue, interaction.conditions);
            /* eslint no-console:true */

            // if this action includes endTrial we want to stop evalutation
            // otherwise we might evaluate using data from the next trial by accident...
            if (conditionTrue) if ( !activate(interaction.actions,input_data) ) break;
        }

        /* eslint no-console:false */
        if (isDebug) console.groupEnd('Event: ' + (input_data.handle || input_data.type));
        /* eslint no-console:true */
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
