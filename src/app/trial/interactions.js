/*
* Organizer for the interaction function
*/

import evaluate from './evaluate';
import activate from './action';

export default interactions;

/*
 * Trial -> Event -> Event
 * 
 * Can use trial to produce side efects
 **/
function interactions(trial){
    var interactions = trial._source.interactions;
    var isDebug = trial._source.DEBUG && window.DEBUG;

    // @TODO: validate interactions (isArray[Object], Object has conditions, Object has actions
    
    return eventMap;
    function eventMap(event){
        var i, interaction, conditionTrue;


        // eslint-disable-next-line no-console
        if (isDebug) console.groupCollapsed('Event: ' + (event.handle || event.type), event);

        // use an explicit for loop because we need to be able to break
        for (i=0; i<interactions.length; i++){
            interaction = interactions[i];
            conditionTrue = evaluate(interaction.conditions, event, trial);

            // eslint-disable-next-line no-console
            if (isDebug) console.log(conditionTrue, interaction.conditions);

            // if this action includes endTrial we want to stop evalutation
            // otherwise we might evaluate using data from the next trial by accident...
            if (conditionTrue) if ( !activate(interaction.actions, event, trial) ) break;
        }

        // eslint-disable-next-line no-console
        if (isDebug) console.groupEnd('Event: ' + (event.handle || event.type));

        return event;
    }
}
