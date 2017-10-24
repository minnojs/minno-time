define(function(){
    return {
        settings: {},
        sequence: [
            {
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
