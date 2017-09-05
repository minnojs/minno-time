define(function(require){
    /*
     * Organizer for the interaction function
     * Allows to subscribe and unsubscribe
     *
     */

    var evaluate = require('./evaluate');
    var activate = require('./action');

    function interactions(trial){
        var interactions = trial._source.interactions;
        var isDebug = trial._source.DEBUG && window.DEBUG;

        return eventMap;
        function eventMap(input_data){
            var i, interaction, conditionTrue;

            // TODO: move to input
            input_data.trialId = trial._id;
            input_data.trialCounter = trial.counter;

            // eslint-disable-next-line no-console
            if (isDebug) console.groupCollapsed('Event: ' + (input_data.handle || input_data.type), input_data);

            // use an explicit for loop because we need to be able to break
            for (i=0; i<interactions.length; i++){
                interaction = interactions[i];
                conditionTrue = evaluate(interaction.conditions, input_data, trial);

                // eslint-disable-next-line no-console
                if (isDebug) console.log(conditionTrue, interaction.conditions);

                // if this action includes endTrial we want to stop evalutation
                // otherwise we might evaluate using data from the next trial by accident...
                if (conditionTrue) if ( !activate(interaction.actions, input_data, trial) ) break;
            }

            // eslint-disable-next-line no-console
            if (isDebug) console.groupEnd('Event: ' + (input_data.handle || input_data.type));

            return input_data;
        }
    }

    return interactions;
});
