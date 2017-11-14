define(function() {

    var settings = { };

    var sequence = [
        {
            input: [ {handle:'space',on:'space'} ],
            stimuli: [
                { media :'hello world' }
            ],
            interactions: [
                {
                    conditions: [ {type:'inputEquals',value:'space'} ],
                    actions: [ {type:'showStim',handle:'All'} ]
                }
            ]
        }
    ];

    var trialSets = [];

    return {settings:settings, sequence:sequence, trialSets:trialSets};
});


