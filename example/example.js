define(function(){
    return {
        settings: {
            canvas: {background:'lightgreen'}
        },
        sequence: [
            {
                DEBUG:true,
                input: [ {handle:'space',on:'space'} ],
                layout: [
                    {
                        media :{word:'Hello world'},
                        css:{fontSize:'2em',color:'#D7685A'}
                    }
                ],
                interactions: [
                    {
                        conditions: [ {type:'inputEquals',value:'space'} ],
                        actions: [ {type:'endTrial'} ]
                    }
                ]
            }
        ]
    };
});
