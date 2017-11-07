// You can find the images used for this task [here](https://github.com/minnojs/minno-time/tree/gh-pages/images)
// and the templates [here](https://github.com/minnojs/minno-time/tree/gh-pages/resources/GNAT).
//
// ** This example is intended for educational purposes only. If you want to actually use this type of task, please see the [extensions page](https://app-prod-03.implicit.harvard.edu/implicit/common/all/js/pip/piscripts/ydocs/dist/index.html). **
define(['pipAPI','pipScorer'], function(APIConstructor,Scorer) {

    var API = new APIConstructor('plainIAT');
    var scorer = new Scorer();

    var attribute1 = 'Pleasant';
    var attribute2 = 'Unpleasant';
    var category1 = 'Black People';
    var category2 = 'White People';
    var practiceCategory1 = 'Birds';
    var practiceCategory2= 'Mammals';

    API.addSettings('canvas',{
        maxWidth: 1000,
        proportions : 0.8,
        //Change the colors to allow better presentation of the colored stimuli.
        background: 'white',
        canvasBackground: 'green',
        borderWidth: 5,
        borderColor: 'black'
    });

    API.addSettings('base_url',{
        image : '/minno-time/images',
        template : '/minno-time/resources/GNAT'
    });


    API.addSettings('logger',{
        url : '/implicit/PiPlayerApplet'
    });

    //the scorer that computes the user feedback
    scorer.addSettings('compute',{
        ErrorVar:'score',
        condVar:"condition",
        //condition 1
        cond1VarValues: [
            category1 + '+' + attribute1 //Pleasant + Black people
        ],
        //condition 2
        cond2VarValues: [
            category2 + '+' + attribute1 //Pleasant + White people
        ],
        parcelVar : "parcel",
        parcelValue : ['first'],
        fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
        maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
        minRT : 400, //Below this latency
        maxRT : 1000, //above this
        errorLatency : {use:"latency", penalty:600, useForSTD:true},
        postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
        /**NEED TO ADD*/
        //Recode latencies faster than 400ms to 400, and latencies slower than 2000ms to 2000 (perhaps not supported by Ben’s computeD function; need to ask him to update the function to support that).
        //Ignore tasks with more than 40% error trials in one of the blocks Yoav: (let me know if not supported by Ben’s function because we can use an alternative rule here).

    });

    scorer.addSettings('message',{
        MessageDef: [
            { cut:'-0.65', message:'Your data suggest a strong implicit preference for Black People compared to White People' },
            { cut:'-0.35', message:'Your data suggest a moderate implicit preference for Black People compared to White People.' },
            { cut:'-0.15', message:'Your data suggest a slight implicit preference for Black People compared to White People.' },
            { cut:'0.15', message:'Your data suggest little to no difference in implicit preference between Black People and White People.' },
            { cut:'0.35', message:'Your data suggest a slight implicit preference for White People compared to Black People' },
            { cut:'0.65', message:'Your data suggest a moderate implicit preference for White People compared to Black People' },
            { cut:'5', message:'Your data suggest a strong implicit preference for White People compared to Black People' }
        ]
    });

    /**
     * Create default Trial
     * note that this function takes a single object
     */
    //this trial is for the 'Go' trial, during the first practice block
    API.addTrialSets({
        PracticeGo: [{
            // by default each trial is correct, this is modified in case of an error
            data: {score:0},

            input: [
                {handle:'enter',on:'enter'} //to skip block
            ],

            // user interactions
            interactions: [
                // begin trial : display stimulus afte 1000ms
                {
                    conditions: [{type:'begin'}],
                    actions: [
                        {type:'showStim',handle:'blankScreen'},
                        {type:'setInput',input:{handle:'showMyStim', on:'timeout',duration:1000}}//show the stim 1000 ms after the beginin
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'showMyStim'}],
                    actions: [
                        {type:'showStim',handle:'myStim'},
                        {type:'setInput',input:{handle: 'in',on:'centerTouch',touch:true}},
                        {type:'setInput',input:{handle: 'in',on:'space'}},
                        {type:'setInput',input:{handle:'targetOut',on:'timeout',duration:1500}}
                    ]
                },

                // error
                {
                    conditions: [{type:'inputEquals',value:'targetOut'}],
                    actions: [
                        {type:'removeInput',handle:'in'},
                        {type:'showStim',handle:'error'},						// show error stimulus
                        {type:'log'},											// log this trial
                        {type:'setTrialAttr', setter:{score:1}},
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}					// set the score to 1
                    ]
                },

                // correct
                {
                    conditions: [{type:'inputEquals',value:'in'}],
                    actions: [
                        {type:'removeInput',handle:['in','targetOut']},
                        {type:'showStim', handle: 'correct'},
                        {type:'log'},																// log this trial
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}			// trigger the "end action after ITI"
                    ]
                },

                // end after ITI
                {
                    conditions: [{type:'inputEquals',value:'end'}],
                    actions: [
                        {type:'endTrial'}
                    ]
                },

                // skip block
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                }
            ]
        }] // end basic trial
    }); // end trialsets
    //this trial is for the 'NoGo' trial, during the first practice block
    API.addTrialSets({
        PracticeNoGo: [{
            // by default each trial is correct, this is modified in case of an error
            data: {score:0},

            input: [
                {handle:'enter',on:'enter'}
            ],

            // user interactions
            interactions: [
                {
                    conditions: [{type:'begin'}],
                    actions: [
                        {type:'showStim',handle:'blankScreen'},
                        {type:'setInput',input:{handle:'showMyStim', on:'timeout',duration:1000}}//show the stim 1000 ms after the beginin
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'showMyStim'}],
                    actions: [
                        {type:'showStim',handle:'myStim'},
                        {type:'setInput',input:{handle: 'in',on:'centerTouch',touch:true}},
                        {type:'setInput',input:{handle: 'in',on:'space'}},
                        {type:'setInput',input:{handle:'targetOut',on:'timeout',duration:1500}}
                    ]
                },

                // correct
                {
                    conditions: [{type:'inputEquals',value:'targetOut'}],
                    actions: [
                        {type:'removeInput',handle:'in'},
                        {type:'log'},
                        {type:'showStim',handle:'correct'},											// show error stimulus
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}
                    ]
                },

                // error
                {
                    conditions: [{type:'inputEquals',value:'in'}],
                    actions: [
                        {type:'removeInput',handle:['in','targetOut']},
                        {type:'showStim', handle: 'error'},
                        {type:'log'},
                        {type:'setTrialAttr', setter:{score:1}},									// set the score to 1
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}			// trigger the "end action after ITI"
                    ]
                },

                // end after ITI
                {
                    conditions: [{type:'inputEquals',value:'end'}],
                    actions: [
                        {type:'endTrial'}
                    ]
                },

                // skip block
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                }
            ]
        }] // end basic trial
    });
    //this trial is for the 'Go' trial
    API.addTrialSets({
        Go: [{
            // by default each trial is correct, this is modified in case of an error
            data: {score:0},

            input: [
                {handle:'enter',on:'enter'}
            ],

            // user interactions
            interactions: [
                {
                    conditions: [{type:'begin'}],
                    actions: [
                        {type:'showStim',handle:'blankScreen'},
                        {type:'setInput',input:{handle:'showMyStim', on:'timeout',duration:1000}}//show the stim 1000 ms after the beginin
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'showMyStim'}],
                    actions: [
                        {type:'showStim',handle:'myStim'},
                        {type:'setInput',input:{handle: 'in',on:'centerTouch',touch:true}},
                        {type:'setInput',input:{handle: 'in',on:'space'}},
                        {type:'setInput',input:{handle:'targetOut',on:'timeout',duration:1200}}
                    ]
                },

                // error
                {
                    conditions: [{type:'inputEquals',value:'targetOut'}],
                    actions: [
                        {type:'removeInput',handle:'in'},
                        {type:'showStim',handle:'error'},// show error stimulus
                        {type:'log'},
                        {type:'setTrialAttr', setter:{score:1}},
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}					// set the score to 1
                    ]
                },

                // correct
                {
                    conditions: [{type:'inputEquals',value:'in'}],
                    actions: [
                        {type:'removeInput',handle:['in','targetOut']},
                        {type:'showStim', handle: 'correct'},											// hide everything
                        {type:'log'},																// log this trial
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}			// trigger the "end action after ITI"
                    ]
                },

                // end after ITI
                {
                    conditions: [{type:'inputEquals',value:'end'}],
                    actions: [
                        {type:'endTrial'}
                    ]
                },

                // skip block
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                }
            ]
        }] // end basic trial
    });
    //this trial is for the 'NoGo' trial
    API.addTrialSets({
        NoGo: [{
            // by default each trial is correct, this is modified in case of an error
            data: {score:0},

            input: [
                {handle:'enter',on:'enter'}
            ],

            // user interactions
            interactions: [
                {
                    conditions: [{type:'begin'}],
                    actions: [
                        {type:'showStim',handle:'blankScreen'},
                        {type:'setInput',input:{handle:'showMyStim', on:'timeout',duration:1000}}//show the stim 1000 ms after the beginin
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'showMyStim'}],
                    actions: [
                        {type:'showStim',handle:'myStim'},
                        {type:'setInput',input:{handle: 'in',on:'centerTouch',touch:true}},
                        {type:'setInput',input:{handle: 'in',on:'space'}},
                        {type:'setInput',input:{handle:'targetOut',on:'timeout',duration:1000}}
                    ]
                },

                // correct
                {
                    conditions: [{type:'inputEquals',value:'targetOut'}],
                    actions: [
                        {type:'removeInput',handle:'in'},
                        {type:'showStim',handle:'correct'},	// show error stimulus
                        {type:'log'},
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}					// set the score to 1
                    ]
                },

                // error
                {
                    conditions: [{type:'inputEquals',value:'in'}],
                    actions: [
                        {type:'removeInput',handle:['in','targetOut']},
                        {type:'showStim', handle: 'error'},
                        {type:'log'},
                        {type:'setTrialAttr', setter:{score:1}},
                        {type:'setInput',input:{handle:'end', on:'timeout',duration:250}}			// trigger the "end action after ITI"
                    ]
                },

                // end after ITI
                {
                    conditions: [{type:'inputEquals',value:'end'}],
                    actions: [
                        {type:'endTrial'}
                    ]
                },

                // skip block
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                }
            ]
        }] // end basic trial
    });

    /**
     * Create default Introduction trials
     * note that this function takes an array of objects
     */
    API.addTrialSets("introduction", [
        // generic introduction trial, to be inherited by all other inroduction trials

        {
            data: {block: 'generic'},
            // create user interface (just click to move on...)
            input: [
                {handle:'space',on:'space'},
                {handle:'enter',on:'enter'},
                {handle:'space',on:'bottomTouch',touch:true}
            ],
            interactions: [
                // display instructions
                {
                    conditions: [{type:'begin'}],
                    actions: [
                        {type:'showStim',handle:'All'}
                    ]
                },

                // end trial
                {
                    conditions: [{type:'inputEquals',value:'space'}],
                    actions: [{type:'endTrial'}]
                },

                // skip block
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                }
            ]
        }
    ]);

    /**
     * Create specific trials for each block
     */
    API.addTrialSets({ // pleasant+black people as 'go'
        BlackGo:[{
            data: {condition: category1 + '+' + attribute1},
            layout: [
                {location:{top:3},media:{word:"Hit 'space' bar if the item belongs to"}, css:{color:'black','font-size':'1em'}},
                {location:{top:6},media:{word:category1}, css:{color:'black','font-size':'2em'}},
                {location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
                {location:{top:22},media:{word:attribute1}, css:{color:'black','font-size':'2em'}}
            ],
            inherit:{set: 'Go'},
            stimuli: [
                {inherit:{type:'exRandom',set:'category1_attribute1'}},
                {inherit:{type:'random',set:'blankScreen'}},
                {inherit:{type:'random',set:'correctFeedback'}},
                {inherit:{type:'random',set:'errorFeedback'}}
            ]
        }],
        BlackNoGo:[{ // pleasant+white people as 'go'
            data: {condition: category1 + '+' + attribute2},
            layout: [
                {location:{top:3},media:{word:"Hit 'space' bar if the item belongs to"}, css:{color:'black','font-size':'1em'}},
                {location:{top:6},media:{word:category2}, css:{color:'black','font-size':'2em'}},
                {location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
                {location:{top:22},media:{word:attribute1}, css:{color:'black','font-size':'2em'}}
            ],
            inherit:{set: 'NoGo'},
            stimuli: [
                {inherit:{type:'exRandom',set:'category1_attribute2'}},
                {inherit:{type:'random',set:'blankScreen'}},
                {inherit:{type:'random',set:'correctFeedback'}},
                {inherit:{type:'random',set:'errorFeedback'}}
            ]
        }],

        WhiteGo:[{ // pleasant+white people as 'go'
            data: {condition: category2 + '+' + attribute1},
            layout: [
                {location:{top:3},media:{word:"Hit 'space' bar if the item belongs to"}, css:{color:'black','font-size':'1em'}},
                {location:{top:6},media:{word:category2}, css:{color:'black','font-size':'2em'}},
                {location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
                {location:{top:22},media:{word:attribute1}, css:{color:'black','font-size':'2em'}}
            ],

            inherit:{set: 'Go'},													// inherit the default trial
            stimuli: [
                {inherit:{type:'exRandom',set:'category2_attribute1'}},
                {inherit:{type:'random',set:'blankScreen'}},
                {inherit:{type:'random',set:'correctFeedback'}},
                {inherit:{type:'random',set:'errorFeedback'}}
            ]
        }],
        WhiteNoGo:[{ //pleasant + black people as 'go'
            data: {condition: category2 + '+' + attribute2},
            layout: [
                {location:{top:3},media:{word:"Hit 'space' bar if the item belongs to"}, css:{color:'black','font-size':'1em'}},
                {location:{top:6},media:{word:category1}, css:{color:'black','font-size':'2em'}},
                {location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
                {location:{top:22},media:{word:attribute1}, css:{color:'black','font-size':'2em'}}
            ],
            inherit:{set: 'NoGo'},
            stimuli: [
                {inherit:{type:'exRandom',set:'category2_attribute2'}},
                {inherit:{type:'random',set:'blankScreen'}},
                {inherit:{type:'random',set:'correctFeedback'}},
                {inherit:{type:'random',set:'errorFeedback'}}
            ]
        }],
        practiceBlockGo:[{
            data: {condition: 'example'},
            layout: [
                {location:{top:3},media:{word:"Hit 'space' bar if the item belongs to"}, css:{color:'black','font-size':'1em'}},
                {location:{top:6},media:{word:practiceCategory1}, css:{color:'black','font-size':'2em'}},
                {location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
                {location:{top:22},media:{word:attribute1}, css:{color:'black','font-size':'2em'}}
            ],
            inherit:{set: 'PracticeGo'},
            stimuli: [
                {inherit:{type:'exRandom',set:'exampleGo'}},
                {inherit:{type:'random',set:'blankScreen'}},
                {inherit:{type:'random',set:'correctFeedback'}},
                {inherit:{type:'random',set:'errorFeedback'}}
            ]
        }],
        practiceBlockNoGo:[{
            data: {condition: 'example'},
            layout: [
                {location:{top:3},media:{word:"Hit 'space' bar if the item belongs to"}, css:{color:'black','font-size':'1em'}},
                {location:{top:6},media:{word:practiceCategory1}, css:{color:'black','font-size':'2em'}},
                {location:{top:14},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
                {location:{top:22},media:{word:attribute1}, css:{color:'black','font-size':'2em'}}
            ],
            inherit:{set: 'PracticeNoGo'},
            stimuli: [
                {inherit:{type:'exRandom',set:'exampleNoGo'}},
                {inherit:{type:'random',set:'blankScreen'}},
                {inherit:{type:'random',set:'correctFeedback'}},
                {inherit:{type:'random',set:'errorFeedback'}}
            ]
        }]
    });

    /*
     *	Stimulus Sets
     *
     */
    API.addStimulusSets({
        // This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
    Default: [
        {css:{color:'white','font-size':'2em'}}
    ],
    Instructions: [
        {css:{'font-size':'1.3em',color:'black', lineHeight:1.2}}
    ],
    // The trial stimuli
    category1_attribute1 : [ // pleasant + black people
        {data:{handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
        {data:{handle:'myStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}}
    ],
    category1_attribute2 : [ // unpleasant + black people
        {data:{handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
        {data:{handle:'myStim', alias:category1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category1'}}}
    ],
    category2_attribute1 : [ // pleasant + white people
        {data:{handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
        {data:{handle:'myStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
    ],
    category2_attribute2 : [ // unpleasant + white people
        {data:{handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
        {data:{handle:'myStim', alias:category2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category2'}}}
    ],
    //for the first block (Mammals/ Birds)
    exampleGo: [ //pleasant + Birds
        {data:{handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}},
        {data:{handle:'myStim', alias:practiceCategory1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'practiceCategory1'}}}
    ],
    exampleNoGo: [ //unpleasant + mammals
        {data:{handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}},
        {data:{handle:'myStim', alias:practiceCategory2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'practiceCategory2'}}}
    ],


    // this stimulus used for giving feedback
    errorFeedback : [  //error
        {handle:'error', location: {top: 80}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true}
    ],
    correctFeedback : [ //correct
        {handle:'correct', location: {top: 80}, css:{color:'#00FF00','font-size':'4em'}, media: {word:'O'}, nolog:true}
    ],
    blankScreen : [ // for the first 1000 ms in the begining of each trial (can be used for fixation)
        {handle:'blankScreen', location: {top: 80}, css:{color:'black','font-size':'4em'}, media: {word:' '}, nolog:true}
    ]
    });
    API.addMediaSets({
        attribute1 : [// Pleasant
            {word: 'Nice'},
            {word: 'Heaven'},
            {word: 'Happy'},
            {word: 'Pleasure'}
        ],
        attribute2: [ //Unpleasant
            {word: 'Nasty'},
            {word: 'Hell'},
            {word: 'Horrible'},
            {word: 'Rotten'}
        ],
        category1: [ // Black people
            {image: 'bf14_nc.jpg'},
            {image: 'bf23_nc.jpg'},
            {image: 'bf56_nc.jpg'},
            {image: 'bm14_nc.jpg'}
        ],
        category2: [ //White people
            {image: 'wf2_nc.jpg'},
            {image: 'wf3_nc.jpg'},
            {image: 'wf6_nc.jpg'},
            {image: 'wm1_nc.jpg'}
        ],
        practiceCategory1: [//birds
            {image: 'ctsduck.jpg'},
            {image: 'ctsparrot.jpg'},
            {image: 'ctsrobin.jpg'},
            {image: 'ctssparrow.jpg'}
        ],
        practiceCategory2: [//mammals
            {image: 'ctsbison.jpg'},
            {image: 'ctsgiraffe.jpg'},
            {image: 'ctshippo.jpg'},
            {image: 'ctsrhino.jpg'}
        ]
    });
    //  the 'black people' as the first focal category
    var GNAT1 = [{
        data: {block:0,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst1.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'practiceBlockGo',data:{block:0}},
                    {inherit: 'practiceBlockNoGo',data:{block:0}}
                ]
            } // end wrapper
        ]
    },
    {   //the instructions
        data: {block:1,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:1,parcel:'first'}},
                    {inherit: 'WhiteNoGo',data:{block:1}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:2,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}}]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:2}},
                    {inherit: 'WhiteGo',data:{block:2,parcel:'first'}}
                ]
            } // end wrapper
        ]
    },
    //blocks 3+4
    {
        data: {block:3,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:3,parcel:'second'}},
                    {inherit: 'WhiteNoGo',data:{block:3}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:4,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:4}},
                    {inherit: 'WhiteGo',data:{block:4,parcel:'second'}}
                ]
            } // end wrapper
        ]
    },
    //blocks 5+6
    {
        data: {block:5,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:5,parcel:'third'}},
                    {inherit: 'WhiteNoGo',data:{block:5}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:6,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:6}},
                    {inherit: 'WhiteGo',data:{block:6,parcel:'third'}}
                ]
            } // end wrapper
        ]
    },
    //blocks 7+8
    {
        data: {block:7,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:7,parcel:'fourth'}},
                    {inherit: 'WhiteNoGo',data:{block:7}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:8,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:8}},
                    {inherit: 'WhiteGo',data:{block:8,parcel:'fourth'}}
                ]
            } // end wrapper
        ]
    }
    ];
    //  the 'white people' as the first focal category
    var GNAT2 = [{
        data: {block:0,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst1.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'practiceBlockGo',data:{block:0}},
                    {inherit: 'practiceBlockNoGo',data:{block:0}}
                ]
            } // end wrapper
        ]
    },
    {   //the instructions
        data: {block:1,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:1}},
                    {inherit: 'WhiteGo',data:{block:1,parcel:'first'}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:2,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}}]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:2,parcel:'first'}},
                    {inherit: 'WhiteNoGo',data:{block:2}}
                ]
            } // end wrapper
        ]
    },
    //blocks 3+4
    {
        data: {block:3,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:3}},
                    {inherit: 'WhiteGo',data:{block:3,parcel:'second'}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:4,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:4,parcel:'second'}},
                    {inherit: 'WhiteNoGo',data:{block:4}}
                ]
            } // end wrapper
        ]
    },
    //blocks 5+6
    {
        data: {block:5,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:5}},
                    {inherit: 'WhiteGo',data:{block:5,parcel:'third'}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:6,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:6,parcel:'third'}},
                    {inherit: 'WhiteNoGo',data:{block:6}}
                ]
            } // end wrapper
        ]
    },
    //blocks 7+8
    {
        data: {block:7,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst3.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackNoGo',data:{block:7}},
                    {inherit: 'WhiteGo',data:{block:7,parcel:'fourth'}}
                ]
            } // end wrapper
        ]
    },
    {
        data: {block:8,blockStart:true},
        inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
        stimuli: [{
            inherit:'Instructions',
            media:{template:'inst2.jst'}
        }]
    },
    { //The presentation trials
        // Repeat 16 times the trial. (8 times each combination)
        mixer: 'random',		//
        data : [
            {
                mixer: 'repeat',
                times: 8,
                data : [
                    {inherit: 'BlackGo',data:{block:8,parcel:'fourth'}},
                    {inherit: 'WhiteNoGo',data:{block:8}}
                ]
            } // end wrapper
        ]
    }
    ];



    /*
     *	Create the Task sequence
     */
    API.addSequence([
        {
            mixer: 'choose', //randomly choose if 'White People' or 'Black People' will be the first focal category
            data: [
                {mixer:'wrapper',data:GNAT1},
                {mixer:'wrapper',data:GNAT2}
            ]
        },

        // user feedback- here we will use the computeD function.
        {
            data: {blockStart:true},
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
            stimuli: [],
            customize: function(){
                /* global console */
                var trial = this;
                console.log('calling scorer');
                var DScoreObj, DScore, FBMsg;

                //////first call to score//////
                scorer.addSettings('compute',{
                    parcelValue : ['first']
                });

                DScoreObj = scorer.computeD();
                var DScore1 = DScoreObj.DScore;
                console.log(DScore1);

                //////second call to score//////
                scorer.addSettings('compute',{
                    parcelValue : ['second']
                });

                console.log('calling scorer for the second time');
                DScoreObj = scorer.computeD();
                var DScore2 = DScoreObj.DScore;
                console.log(DScore2);


                //////third call to score//////
                scorer.addSettings('compute',{
                    parcelValue : ['third']
                });
                console.log('calling scorer for the third time');
                DScoreObj = scorer.computeD();
                var DScore3 = DScoreObj.DScore;
                console.log(DScore3);


                //////fourth call to score//////
                scorer.addSettings('compute',{
                    parcelValue : ['fourth']
                });
                console.log('calling scorer for the fourth time');
                DScoreObj = scorer.computeD();
                var DScore4 = DScoreObj.DScore;
                console.log(DScore4);

                // If all scores are numbers
                if ((DScore1 !== '') && (DScore2 !== '') && (DScore3 !== '') && (DScore4 !== '')){
                    //Average the 4 scores
                    DScore = (parseFloat(DScore1) + parseFloat(DScore2) + parseFloat(DScore3) + parseFloat(DScore4))/4;
                    FBMsg = scorer.getFBMsg(DScore);
                } else {
                    DScore = '';
                    FBMsg = 'An error has occurred';
                }

                console.log(DScore);
                console.log(FBMsg);
                var media = {css:{color:'black'},media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> '+FBMsg+'<br>The Score is:'+DScore+'</p></div>'}};
                trial.stimuli.push(media);
                scorer.dynamicPost({
                    score: DScoreObj.DScore,
                    feedback: DScoreObj.FBMsg
                });

            }
        },

        { //Instructions trial, the end of the task, instruction what to do next
            data: {blockStart:true},
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
            stimuli: [
                {//The instructions stimulus
                    data : {'handle':'instStim'},
                    css: {color:'black'},
                    media:{html:'<div><p style="font-size:28px"><color="#FFFAFA">You have completed the study<br/><br/>Thank you very much for your participation.<br/><br/> Press "space" for continue to next task.</p></div>'}
                }
            ]
        }
    ]);

    return API.script;
});
