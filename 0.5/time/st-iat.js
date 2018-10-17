// You can find the images used for this task [here](https://github.com/minnojs/minno-time/tree/gh-pages/images).
//
// ** This example is intended for educational purposes only. If you want to actually use this type of task, please see the [extensions page](https://app-prod-03.implicit.harvard.edu/implicit/common/all/js/pip/piscripts/ydocs/dist/index.html). **
define(['pipAPI','pipScorer'], function(APIConstructor,Scorer) {

    var API = new APIConstructor('plainIAT');
    var scorer = new Scorer();

    var attribute1 = 'Unpleasant';
    var attribute2 = 'Pleasant';
    var category = 'Black People';
    // the layout for the trials were the 'Black People' are on the left side (with the 'Unpleasant')
    var leftLayout = [
        {location:{left:16,top:12},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
        {location:{left:10,top:6},media:{word:attribute1}, css:{color:'white','font-size':'2em'}},
        {location:{left:10,top:18},media:{word:category}, css:{color:'red','font-size':'2em'}},
        {location:{right:10,top:6},media:{word:attribute2}, css:{color:'white','font-size':'2em'}}
    ];
    // the layout for the trials were the 'Black People' are on the right side (with the 'Pleasant')
    var rightLayout = [
        {location:{right:16,top:12},media:{word:'or'}, css:{color:'black','font-size':'2em'}},
        {location:{left:10,top:6},media:{word:attribute1}, css:{color:'white','font-size':'2em'}},
        {location:{right:6,top:18},media:{word:category}, css:{color:'red','font-size':'2em'}},
        {location:{right:10,top:6},media:{word:attribute2}, css:{color:'white','font-size':'2em'}}
    ];

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
        image : '/minno-time/images'
    });

    API.addSettings('logger',{
        pulse: 20,
        url : '/implicit/PiPlayerApplet'
    });

    //the scorer that computes the user feedback
    scorer.addSettings('compute',{
        ErrorVar:'score',
        condVar:"condition",
        //condition 1
        cond1VarValues: [// Unpleasant, Black people/ pleasant
            attribute1 + ',' + category + '/' + attribute2
        ],
        //condition 2
        cond2VarValues: [// Unpleasant / Black people, Pleasant
            attribute2 + ',' + category + '/' + attribute1
        ],
        parcelVar : "parcel",
        parcelValue : ['first'],
        fastRT : 150, //Below this reaction time, the latency is considered extremely fast.
        maxFastTrialsRate : 0.1, //Above this % of extremely fast responses within a condition, the participant is considered too fast.
        minRT : 400, //Below this latency
        maxRT : 10000, //above this
        errorLatency : {use:"latency", penalty:600, useForSTD:true},
        postSettings : {score:"score",msg:"feedback",url:"/implicit/scorer"}
    });

    scorer.addSettings('message',{ /**chack*/
                       MessageDef: [
                           { cut:'-0.65', message:'Your data suggest strong positive automatic attitude toward Black People.' },
                           { cut:'-0.35', message:'Your data suggest moderate positive automatic attitude toward Black People.' },
                           { cut:'-0.15', message:'Your data suggest weak positive automatic attitude toward Black People.' },
                           { cut:'0.15', message:'Your data suggest neutral automatic attitude toward Black People.' },
                           { cut:'0.35', message:'Your data suggest weak negative automatic attitude toward Black People.' },
                           { cut:'0.65', message:'Your data suggest moderate negative automatic attitude toward Black People.' },
                           { cut:'5', message:'Your data suggest strong negative automatic attitude toward Black People.' }
                       ]
    });

    /**
     * Create default Trial
     * note that this function takes a single object
     */
    API.addTrialSets('Default',{
        // by default each trial is correct, this is modified in case of an error
        data: {score:0},
        // set the interface for trials
        input: [
            {handle:'enter',on:'enter'},
            {handle:'left',on:'keypressed',key:'e'},
            {handle:'right',on:'keypressed',key:'i'},
            {handle:'left',on:'leftTouch',touch:true},
            {handle:'right',on:'rightTouch',touch:true}
        ],

        // user interactions
        interactions: [
            // begin trial : display stimulus imidiately
            {
                conditions: [{type:'begin'}],
                actions: [{type:'showStim',handle:'myStim'}]
            },

            // error
            {
                conditions: [
                    {type:'inputEqualsStim',property:'side',negate:true},								// check if the input handle is unequal to the "side" attribute of stimulus.data
                    {type:'inputEquals',value:['right','left']}									// make sure this is a click interaction
                ],
                actions: [
                    {type:'showStim',handle:'error'},											// show error stimulus
                    {type:'setTrialAttr', setter:{score:1}}										// set the score to 1
                ]
            },

            // correct
            {
                conditions: [{type:'inputEqualsStim',property:'side'}],								// check if the input handle is equal to the "side" attribute of stimulus.data
                actions: [
                    {type:'removeInput',handle:['left','right']},
                    {type:'hideStim', handle: 'All'},											// hide everything
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
    });

    /**
     * Create default Introduction trials
     * note that this function takes an array of objects
     */
    API.addTrialSets("introduction", [
        // generic introduction trial, to be inherited by all other inroduction trials
        {
            // set block as generic so we can inherit it later
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
    API.addTrialSets({

        leftBlack:[{//black people + unpleasant/ pleasant

            data: {condition: attribute1 + ',' + category + '/' + attribute2},
            layout: leftLayout,
            inherit: 'Default',
            stimuli: [
                {inherit:{type:'exRandom',set:'category_left'}},
                {inherit:{type:'random',set:'feedback'}}
            ]
        }],
        rightUnpleasant:[{ //black people + pleasant/ unpleasant

            data: {condition: attribute2 + ',' + category + '/' + attribute1},
            layout: rightLayout,
            inherit: 'Default',
            stimuli: [
                {inherit:{type:'exRandom',set:'left'}},
                {inherit:{type:'random',set:'feedback'}}
            ]
        }],
        leftUnpleasant:[{ //black people + unpleasant/ pleasant

            data: {condition: attribute1 + ',' + category + '/' + attribute2},
            layout: leftLayout,
            inherit: 'Default',
            stimuli: [
                {inherit:{type:'exRandom',set:'left'}},
                {inherit:{type:'random',set:'feedback'}}
            ]
        }],

        leftPleasant:[{ //black people + unpleasant/ pleasant

            data: {condition: attribute1 + ',' + category + '/' + attribute2},
            layout: leftLayout,
            inherit: 'Default',
            stimuli: [
                {inherit:{type:'exRandom',set:'right'}},
                {inherit:{type:'random',set:'feedback'}}
            ]
        }],
        rightPleasant:[{ //black people + pleasant/ unpleasant

            data: {condition: attribute2 + ',' + category + '/' + attribute1},
            layout: rightLayout,
            inherit: 'Default',
            stimuli: [
                {inherit:{type:'exRandom',set:'right'}},
                {inherit:{type:'random',set:'feedback'}}
            ]
        }],

        rightBlack:[{ //black people + pleasant/ unpleasant
            data: {condition: attribute2 + ',' + category + '/' + attribute1},
            layout: rightLayout,
            inherit: 'Default',													// inherit the default trial
            stimuli: [
                {inherit:{type:'exRandom',set:'category_right'}},
                {inherit:{type:'random',set:'feedback'}}
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
    // Each stimulus set holds the left and right stimuli for a specific page settings (is the first attribute/category in the left or right?)
    // Notably the attribute/category sets repeat themselves 5 times each, this is so that when calling them they will be balanced accross each ten trials
    category_left: [
        {data:{side:'left', handle:'myStim', alias:category}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category'}}}
    ],
    category_right : [
        {data:{side:'right', handle:'myStim', alias:category}, inherit:'Default', media: {inherit:{type:'exRandom',set:'category'}}}
    ],
    right : [
        {data:{side:'right', handle:'myStim', alias:attribute2}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute2'}}}
    ],
    left : [
        {data:{side:'left', handle:'myStim', alias:attribute1}, inherit:'Default', media: {inherit:{type:'exRandom',set:'attribute1'}}}
    ],

    // this stimulus used for giving feedback, in this case only the error notification
    feedback : [
        {handle:'error', location: {top: 80}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true}
    ]
    });

    API.addMediaSets({
        attribute1 : [
            {word: 'Bomb'},
            {word: 'Abuse'},
            {word: 'Sadness'},
            {word: 'Pain'},
            {word: 'Poison'},
            {word: 'Grief'}
        ],
        attribute2: [
            {word: 'Paradise'},
            {word: 'Pleasure'},
            {word: 'Cheer'},
            {word: 'Wonderful'},
            {word: 'Splendid'},
            {word: 'Love'}
        ],
        category: [
            {image: 'epbm1.jpg'},
            {image: 'epbm2.jpg'},
            {image: 'epbm3.jpg'},
            {image: 'epbf1.jpg'},
            {image: 'epbf2.jpg'},
            {image: 'epbf3.jpg'}
        ]
    });

    /*
     *	Create the Task sequence
     */
    API.addSequence([
        //first block
        {
            data: {block:1, blockStart:true},			// we set the data with the category names so the template can display them
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
            layout: rightLayout,
            stimuli: [{
                inherit:'Instructions',
                media:{html:'<div><p style="font-size:24px"><color="#FFFAFA"><br/><br/>Put your middle or index fingers on the <b>E</b> key and <b>I</b> keys of your keyboard. Items representing the categories at the top will appear one-by-one in the middle of the screen. When the item belongs to a category on the left, press the <b>E</b> key;when the item belongs to a category on the right, press the <b>I</b> key. Items belong to only one category.If you make an error, an <font color="#FF0000"><b>X</b></font> will appear - fix the error by hitting the other key.<br/><b>GO AS FAST AS YOU CAN</b> while making as few mistakes as possible.Going too slow or making too many errors will result in an uninterpretable score.<br /><p align="center"><br/>Press the <b>space bar</b> to begin.<br><br>(round 1 of 4)</p></p></div>'}
            }]
        },
        { //The presentation trials
            mixer: 'random',		//in random order: 14 times: pleasant, 14 times: black people 14+6=20 times: unpleasant
            data : [
                { //The presentation trials
                    mixer: 'repeat',
                    times:14,
                    data : [
                        {inherit: 'rightBlack',data:{block:1, parcel:'first'}},
                        {inherit: 'rightPleasant',data:{block:1, parcel:'first'}},
                        {inherit: 'rightUnpleasant',data:{block:1, parcel:'first'}}
                    ]
                },
                { //The presentation trials
                    mixer: 'repeat',
                    times:6,
                    data : [
                        {inherit: 'rightUnpleasant',data:{block:1, parcel:'first'}}
                    ]
                }
            ]
        },
        //second block
        {
            data: {block:2, blockStart:true},
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
            layout: leftLayout,
            stimuli: [{
                inherit:'Instructions',
                media:{html:'<div><p style="font-size:24px"><color="#FFFAFA"><br/><br/><b>See above, the categories have changed locations.</b><br/> The rules, however, are the same.</p><br /><p>When the item belongs to a category on the left, press the <b>E</b> key; when the item belongs to a category on the right, press the <b>I</b> key. Items belong to only one category. <br/> <b>GO AS FAST AS YOU CAN.</b></p><br /> <p align="center">Press the <b>space bar</b> to begin.<br><br>(round 2 of 4)</p></p></p></div>'}
            }]
        },
        { //The presentation trials
            mixer: 'random',		//in random order: 14 times: unpleasant, 14 times: black people 14+6=20 times: pleasant
            data : [
                { //The presentation trials
                    mixer: 'repeat',
                    times:14,
                    data : [
                        {inherit: 'leftBlack',data:{block:2, parcel:'first'}},
                        {inherit: 'leftUnpleasant',data:{block:2, parcel:'first'}},
                        {inherit: 'leftPleasant',data:{block:2, parcel:'first'}}
                    ]
                },
                { //The presentation trials
                    mixer: 'repeat',
                    times:6,
                    data : [
                        {inherit: 'leftPleasant',data:{block:2, parcel:'first'}}
                    ]
                }
            ]
        },
        //third block
        {
            data: {block:3, blockStart:true},
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
            layout: rightLayout,
            stimuli: [{
                inherit:'Instructions',
                media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"><br/><br/><b>The categories have changed locations again.</b><br/><br/><br/><p align="center">Press the <b>space bar</b> to continue with the same task.<br><br>(round 3 of 4)</p></p></div>'}
            }]
        },
        { //The presentation trials
            mixer: 'random',
            data : [
                {
                    mixer: 'repeat',
                    times:14,
                    data : [
                        {inherit: 'rightBlack',data:{block:3, parcel:'second'}},
                        {inherit: 'rightPleasant',data:{block:3, parcel:'second'}},
                        {inherit: 'rightUnpleasant',data:{block:3, parcel:'second'}}
                    ]
                },
                { //The presentation trials
                    mixer: 'repeat',
                    times:6,
                    data : [
                        {inherit: 'rightUnpleasant',data:{block:3, parcel:'second'}}
                    ]
                }
            ]
        },
        //fourth block
        {
            data: {block:4, blockStart:true},
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},			// inhertit the generic instruction block
            layout: leftLayout,
            stimuli: [{
                inherit:'Instructions',
                media:{html:'<div><p style="font-size:26px"><color="#FFFAFA"><br/><br/>The task is almost finished.<br/> Press the <b>space bar</b> when you are ready for the final round.</p><br/><br/><br/>(round 4 of 4)</p></div>'}
            }]
        },
        { //The presentation trials
            mixer: 'random',
            data : [
                {
                    mixer: 'repeat',
                    times:14,
                    data : [
                        {inherit: 'leftBlack',data:{block:4, parcel:'second'}},
                        {inherit: 'leftUnpleasant',data:{block:4, parcel:'second'}},
                        {inherit: 'leftPleasant',data:{block:4, parcel:'second'}}
                    ]
                },
                { //The presentation trials
                    mixer: 'repeat',
                    times:6,
                    data : [
                        {inherit: 'leftPleasant',data:{block:4, parcel:'second'}}
                    ]
                }
            ]
        },
        // user feedback- here we will use the computeD function.
        {
            inherit: {set:'introduction', type:'byData', data: {block:'generic'}},
            data: {blockStart:true},
            stimuli: [],
            customize: function(){
                /* global console */
                var DScoreObj, DScore, FBMsg;
                var trial = this;


                scorer.addSettings('compute',{
                    parcelValue : ['first']
                });

                DScoreObj = scorer.computeD();
                var DScore1= DScoreObj.DScore;

                //////second call to score//////
                scorer.addSettings('compute',{
                    parcelValue : ['second']
                });

                DScoreObj = scorer.computeD();
                var DScore2 = DScoreObj.DScore;

                //avrage the scores
                console.log(DScore1);
                console.log(DScore2);
                // If all scores are numbers
                if ((DScore1 !== '') && (DScore2 !== '')){
                    //Average the 4 scores
                    DScore = (parseFloat(DScore1) + parseFloat(DScore2))/2;
                    FBMsg = scorer.getFBMsg(DScore);
                } else {
                    DScore = '';
                    FBMsg = 'An error has occurred';
                }

                var media = {css:{color:'black'},media:{html:'<div><p style="font-size:28px"><color="#FFFAFA"> '+FBMsg+'<br>The Score is:'+DScore+'</p></div>'}};
                trial.stimuli.push(media);
                scorer.dynamicPost({
                    score1: DScoreObj.DScore,
                    feedback1: DScoreObj.FBMsg
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
