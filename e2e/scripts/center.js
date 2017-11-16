define(function() {
    var settings = { };

    var sequence = [
        {
            input: [ {handle:'space',on:'space'} ],
            stimuli: [
                { media : {html:'<div></div>'}, size:{width:50, height:50}, css:{background:'red'} },
                { media : {html:'<div></div>'}, size:{width:50, height:50}, location: {top:0}, css:{background:'blue'} },
                { media : {html:'<div></div>'}, size:{width:50, height:50}, location: {right:0}, css:{background:'green'} },
            ],
            interactions: [
                {
                    conditions: [ {type:'begin'} ],
                    actions: [ {type:'showStim',handle:'All'} ]
                }
            ]
        }
    ];

    var trialSets = [];

    return {settings:settings, sequence:sequence, trialSets:trialSets};
});


