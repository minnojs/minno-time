/*
* Organizer for the interaction function
*/

import evaluate from './conditionsEvaluate';
import activate from './action';
import _ from 'lodash';

export default interactions;

/*
 * Trial -> Event -> Event
 * 
 * Can use trial to produce side efects
 **/
function interactions(trial){
    var interactions = trial._source.interactions;
    var isDebug = trial._source.DEBUG && window.DEBUG;

    // @TODO: parse error
    validateInteractions(interactions);
    
    return eventMap;
    function eventMap(event){
        var i, interaction, conditionTrue, endTrial;
        var groupName = 'Event: ' + (event.handle || event.type);


        // eslint-disable-next-line no-console
        if (isDebug) console.groupCollapsed(groupName, event);

        // use an explicit for loop because we need to be able to break
        for (i=0; i<interactions.length; i++){
            interaction = interactions[i];

            conditionTrue = evaluate(interaction.conditions, event, trial);
            if (isDebug) console.log(conditionTrue, interaction.conditions); // eslint-disable-line no-console

            if (conditionTrue) endTrial = activate(interaction.actions, event, trial);

            // if this action includes endTrial we want to stop evalutation immidiately
            if (endTrial) break;
        }

        // eslint-disable-next-line no-console
        if (isDebug) console.groupEnd(groupName);

        return event;
    }
}

export function validateInteractions(interactions){
    if (!Array.isArray(interactions)) throw new Error('Interactions must be an array');
    if (!interactions.length) throw new Error('There are no interactions defined');

    if (!interactions.every(_.isPlainObject)) throw new Error('Interactions must be plain objects');
    if (!interactions.every(isValidProp('conditions'))) throw new Error('Conditions must be either an array or a function');
    if (!interactions.every(isValidProp('actions'))) throw new Error('Actions must be either an array or a function');

    function isValidProp(prop){ 
        return function(interaction) {
            return Array.isArray(interaction[prop]) || _.isFunction(interaction[prop]); 
        };
    }
}
