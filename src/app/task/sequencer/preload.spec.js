import {getScriptMedia} from './scriptPreloader.js';

describe('scriptPreloader', function(){
    it('should harvest sets', function(){
        var script = {
            mediaSets: [1],
            stimulusSets: [{media:2}, {media:3}],
            trialSets: [{stimuli:[{media:4}, {media:5}]}]
        };

        var result = getScriptMedia(script).sort(function(a,b){return a-b;});

        expect(result).toEqual([1,2,3,4,5]);
    });

    it('should harvest the sequence', function(){
        var script = {
            sequence: [
                {stimuli:[{media:1}, {media:2}]},
                {stimuli:[{media:3}, {media:4}]}
            ]
        };

        var result = getScriptMedia(script).sort(function(a,b){return a-b;});

        expect(result).toEqual([1,2,3,4]);
    });

    it('should harvest stimuli,layout,input of the trial', function(){
        var script = {
            sequence: [
                {
                    input:[{element:1}, {element:2}],
                    stimuli:[{media:3}, {media:4}],
                    layout:[{media:5}, {media:6}]
                }
            ]
        };

        var result = getScriptMedia(script).sort(function(a,b){return a-b;});

        expect(result).toEqual([1,2,3,4,5,6]);
    });
});
