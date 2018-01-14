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

var MAX_RECURSION_DEPTH = 50;
function interactions(trial){
    var recursionDepth = 0;
    var interactions = trial._source.interactions;

    try {
        validateInteractions(interactions);
    } catch(error){
        trial.$messages({type:'error', message: 'trial.interactions error', error:error, context:trial._source});
        throw error;
    }
    return eventMap;

    function eventMap(event){
        var i, interaction, conditionTrue, endTrial;
        var groupName = 'Event: ' + (event.handle || event.type);
        var debugLog = [];

        if (recursionDepth > MAX_RECURSION_DEPTH) throw new Error('It seem you have created an infinite loop. Minno has been halted');

        recursionDepth++;
        try{
            // use an explicit for loop because we need to be able to break
            for (i=0; i<interactions.length; i++){
                interaction = interactions[i];

                conditionTrue = evaluate(interaction.conditions, event, trial);
                debugLog.push([conditionTrue, interaction.conditions]);

                if (conditionTrue) endTrial = activate(interaction.actions, event, trial);

                // if this action includes endTrial we want to stop evalutation immidiately
                if (endTrial) break;
            }

        } catch(error){
            trial.$messages({type:'error', message: 'trial.interactions error', error:error});
            throw error;
        }
        recursionDepth--;

        trial.$messages({type:'debug', message: groupName, rows: debugLog});

        // this is here and not within actions so that messages can be sent befor ending the trial
        if (endTrial) trial.end();

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

