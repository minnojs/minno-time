/*
 * this file is resposible for taking the experiment script (json) and parsing it
 */

// load dependancies
import _ from 'lodash';
import Database from 'minno-sequencer';
import go from './sequenceGoto';

export default createDB;

function createDB(script){
    var db = new Database();
    db.createColl('trial');
    db.createColl('stimulus');
    db.createColl('media');

    db.add('trial', script.trialSets || []);
    db.add('stimulus', script.stimulusSets || []);
    db.add('media', script.mediaSets || []);

    if (!_.isArray(script.sequence)) throw new Error('You must set a sequence array.');

    var sequence = db.sequence('trial', script.sequence);
    sequence.go = go; // see sequence/goto.js to understand why we are doing this
    db.currentSequence = sequence;
    return db;
}