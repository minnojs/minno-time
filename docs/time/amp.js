// This example creates an amp task.
// 
// You can find the images used for this task [here](https://github.com/minnojs/minno-time/tree/gh-pages/images)
//
// ** This example is intended for educational purposes only. If you want to actually use this type of task, please see the [extensions page](https://app-prod-03.implicit.harvard.edu/implicit/common/all/js/pip/piscripts/ydocs/dist/index.html). **
define(['pipAPI'], function(APIconstructor) {

    var API = new APIconstructor();

    var category1 = 'Pleasant';
    var category2 = 'Unpleasant';
    var condition1= "white";
    var condition2= "black";
    //a Scorer for the AMP
    var AMPScorer = {
        counter: { prime1: {category1: 0, category2: 0} , prime2: {category1: 0, category2: 0}}
    };
    //count the resposnes of the users
    //prime1/category1++
    function inc_prime1_category1(){
        AMPScorer.counter.prime1.category1 = AMPScorer.counter.prime1.category1+1;
    }
    //prime1/category2++
    function inc_prime1_category2(){
        AMPScorer.counter.prime1.category2 = AMPScorer.counter.prime1.category2+1;
    }
    //prime2/category1++
    function inc_prime2_category1(){
        AMPScorer.counter.prime2.category1 = AMPScorer.counter.prime2.category1+1;
    }
    //prime2/category2++
    function inc_prime2_category2(){
        AMPScorer.counter.prime2.category2 = AMPScorer.counter.prime2.category2+1;
    }
    //reset all the counters to 0,call this function before we count all the responses
    function resetCounters(){
        AMPScorer.counter.prime2.category2=0;
        AMPScorer.counter.prime2.category1=0;
        AMPScorer.counter.prime1.category2=0;
        AMPScorer.counter.prime1.category1=0;
    }

    //compute the AMP score, according to the logs.
    function computeAMPScore(scoreArray){
        for(var i=3; i<scoreArray.length; i++){// the first 3 are the example images, go over all the other logs.
            if(scoreArray[i].responseHandle == category1){ //pleasant response
                if(scoreArray[i].data.condition == condition1){ //the image is from the first category
                    inc_prime1_category1();
                }
                else{//do nothing when there is no answer
                    if(scoreArray[i].data.condition == condition2){
                        inc_prime2_category1(); //the image is from the second category
                    }
                }
            }
            else{// unpleasant response
                if(scoreArray[i].responseHandle == category2){//do nothing when there is no answer
                    if(scoreArray[i].data.condition == condition1){ //the image is from the first category
                        inc_prime1_category2();
                    }
                    else{
                        if(scoreArray[i].data.condition == condition2){//do nothing when there is no answer
                            inc_prime2_category2(); //the image is from the second category
                        }
                    }
                }
            }
        }
    }
    //Set the size of the screen
    API.addSettings('canvas',{
        maxWidth: 900,
        proportions : 0.8,
        //Change the colors to allow better presentation of the colored stimuli.
        background: 'white',
        borderWidth: 5,
        canvasBackground: 'green',
        borderColor: 'black'
    });
    // from where to take the images
    API.addSettings('base_url',{
        image : '/minno-time/images'
    });

    API.addSettings('logger',{
        pulse: 20,
        url : '/implicit/PiPlayerApplet',

        // use default logger (as copied from documents.txt but replace the regular latency with the computed latency)
        logger: function(trialData, inputData, actionData,logStack){

            var stimList = this._stimulus_collection.get_stimlist();
            var mediaList = this._stimulus_collection.get_medialist();

            return {
                log_serial : logStack.length,
                trial_id: this._id,
                name: this.name(),
                responseHandle: inputData.handle,
                latency: inputData.latency - trialData.begin,
                absoluteLatency : inputData.latency,
                stimuli: stimList,
                media: mediaList,
                data: trialData
            };
        }
    });

    //Define the basic trial (the presentation of the images and words)
    API.addTrialSets({
        basicTrial: [{
            //Layout defines what will be presented in the trial. It is like a background display.
            layout: [
                {location:{left:2,top:2},media:{word:'key: E'}, css:{color:'white','font-size':'1em'}},
                {location:{left:75,top:2},media:{word:'key: I'},  css:{color:'white','font-size':'1em'}},
                {location:{left:2,top:5},media:{word:category2}, css:{color:'#33ff33','font-size':'2em'}},
                {location:{left:75,top:5},media:{word:category1},  css:{color:'#33ff33','font-size':'2em'}}
            ],
            //Inputs for two possible responses.
            input: [
                {handle:'enter',on:'enter'}
            ],
            //Set what to do.
            interactions: [
                {
                    conditions: [{type:'begin'}],
                    actions: [
                        {type:'showStim',handle:'primingImage'},// display the first stimulus=priming image
                        {type:'setInput',input:{handle:'primeOut',on:'timeout',duration:100}} //for 100 ms
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'primeOut'}], // on time out
                    actions: [
                        {type:'hideStim',handle:'primingImage'}, // hide the first stimulus
                        {type:'showStim',handle:'blankScreen'}, // and show the second one=the blank screen
                        {type:'setInput',input:{handle:'blankOut',on:'timeout',duration:100}}
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'blankOut'}], // on time out
                    actions: [
                        {type:'hideStim',handle:'blankScreen'}, // hide the blank screen
                        {type:'showStim',handle:'targetStim'}, // and show the letter
                        {type:'setInput',input:{handle:category2,on: 'keypressed', key:'e'}},//the user can only answer here on
                        {type:'setInput',input:{handle:category1,on: 'keypressed', key:'i'}},
                        {type:'setInput',input:{handle:category2,on:'leftTouch',touch:true}},
                        {type:'setInput',input:{handle:category1,on:'rightTouch',touch:true}},

                        // set the begin latency in trialData
                        {type:'setTrialAttr',setter:function(data,event){
                            data.begin = event.latency;
                        }},

                        {type:'setInput',input:{handle:'targetOut',on:'timeout',duration:100}}
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'targetOut'}], // on time out
                    actions: [
                        {type:'hideStim',handle:'targetStim'}, // hide the letter
                        {type:'showStim',handle:'MaskScreen'} // and show the mask screen
                    ]
                },

                // skip block -> if you press 'enter' you will skip the current block.
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                },

                {//What to do upon response
                    //the  condition: dont remove the mask upon timeout, wait until reaction
                    conditions: [{type:'inputEquals',value:category1}], //pleasant response
                    actions: [
                        {type:'setTrialAttr',setter:{score:'1'}},
                        {type:'hideStim',handle:'All'},
                        {type:'removeInput',handle	:[category2,category1]},//only one respnse is possible
                        //The player sends the value of score to the server, when you call the 'log' action
                        {type:'log'}, // here we call the log action. This is because we want to record the latency of this input (the latency of the response)
                        {type:'setInput',input:{handle:'endTrial',on:'timeout',duration:250}}//end the trial 250ms after the response
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:category2}], //unpleasant response.
                    actions: [
                        {type:'setTrialAttr',setter:{score:'0'}},
                        {type:'hideStim',handle:'All'},
                        {type:'removeInput',handle	:[category2,category1]},
                        {type:'log'},
                        {type:'setInput',input:{handle:'endTrial',on:'timeout',duration:250}}
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
                    actions: [{type:'endTrial'}]
                }
            ] // end interactions

        }] // end basic trial
    }); // end trialset

    API.addTrialSets({
        prime1:[{		//first condition
            data: {condition: condition1},
            inherit:{set: 'basicTrial'},
            stimuli: [
                { inherit: {set: 'targetStimulus', type:'exRandom'}, data : {handle:'targetStim'} },
                { inherit: {set: 'primingImage1', type:'exRandom'}, data : {handle:'primingImage'} },
                { inherit: 'MaskScreen'},
                { inherit: 'blankScreen'}
            ]
        }],
        prime2:[{		//second condition
            data: {condition: condition2},
            inherit:{set: 'basicTrial'},
            stimuli: [
                { inherit: {set: 'targetStimulus', type:'exRandom'}, data : {handle:'targetStim'} },
                { inherit: {set: 'primingImage2', type:'exRandom'}, data : {handle:'primingImage'} },
                { inherit: 'MaskScreen'},
                { inherit: 'blankScreen'}
            ]
        }]
    });

    //define an example trial- should be diffrent trial because it has diffrent durations.
    API.addTrialSets({
        exampleTrial: [{
            //Layout defines what will be presented in the trial. It is like a background display.
            layout: [
                {location:{left:2,top:2},media:{word:'key: E'}, css:{color:'white','font-size':'1em'}},
                {location:{left:75,top:2},media:{word:'key: I'},  css:{color:'white','font-size':'1em'}},
                {location:{left:2,top:5},media:{word:category2}, css:{color:'#33ff33','font-size':'2em'}},
                {location:{left:75,top:5},media:{word:category1},  css:{color:'#33ff33','font-size':'2em'}}
            ],
            //Inputs for two possible responses.
            input: [
                {handle:'enter',on: 'enter'}
            ],
            //Set what to do.
            interactions: [
                {
                    conditions: [{type:'begin'}],
                    actions: [{type:'showStim',handle:'primingImage'},// display the first stimulus
                        {type:'setInput',input:{handle:'primeOut',on:'timeout',duration:125}}]  //display longer time in the example trial
                },
                {
                    conditions: [{type:'inputEquals',value:'primeOut'}], // on time out
                    actions: [
                        {type:'hideStim',handle:'primingImage'}, // hide the first stimulus
                        {type:'showStim',handle:'blankScreen'}, // and show the second one
                        {type:'setInput',input:{handle:'blankOut',on:'timeout',duration:125}}
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'blankOut'}], // on time out
                    actions: [
                        {type:'hideStim',handle:'blankScreen'}, // hide the blank screen
                        {type:'showStim',handle:'targetStim'}, // and show the letter
                        {type:'setInput',input:{handle:category2,on: 'keypressed', key:'e'}},//the user can only answer here
                        {type:'setInput',input:{handle:category1,on: 'keypressed', key:'i'}},
                        {type:'setInput',input:{handle:category2,on:'leftTouch',touch:true}},
                        {type:'setInput',input:{handle:category1,on:'rightTouch',touch:true}},

                        // set the begin latency in trialData
                        {type:'setTrialAttr',setter:function(data,event){
                            data.begin = event.latency;
                        }},

                        {type:'setInput',input:{handle:'targetOut',on:'timeout',duration:125}}
                    ]
                },
                {
                    conditions: [{type:'inputEquals',value:'targetOut'}], // on time out
                    actions: [
                        {type:'hideStim',handle:'targetStim'}, // hide the first stimulus
                        {type:'showStim',handle:'MaskScreen'} // and show the mask screen
                    ]
                },
                {//What to do upon correct response
                    //the condition: dont remove the word upon timeout, wait until reaction
                    conditions: [{type:'inputEquals',value:category1}], //pleasant response
                    actions: [
                        {type:'hideStim',handle:'All'},
                        {type:'setTrialAttr',setter:{score:'1'}},
                        {type:'removeInput',handle	:[category2,category1]},
                        {type:'log'},
                        {type:'setInput',input:{handle:'endTrial',on:'timeout',duration:250}}
                    ]
                },

                {
                    conditions: [{type:'inputEquals',value:category2}], //unpleasant response.
                    actions: [
                        {type:'hideStim',handle:'All'},
                        {type:'setTrialAttr',setter:{score:'0'}},
                        {type:'removeInput',handle	:[category2,category1]},
                        {type:'log'},
                        {type:'setInput',input:{handle:'endTrial',on:'timeout',duration:250}}
                    ]
                },

                // skip block -> if you press 'enter' you will skip the current block.
                {
                    conditions: [{type:'inputEquals',value:'enter'}],
                    actions: [
                        {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                        {type:'endTrial'}
                    ]
                },

                {
                    conditions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
                    actions: [{type:'endTrial'}]
                }
            ]
        }], // end example trial

        example:[{
            data:{condition:"example"},
            inherit:{set: 'exampleTrial'},
            stimuli: [
                { inherit: {set: 'targetStimulus', type:'exRandom'}, data : {handle:'targetStim'} },
                { inherit: {set: 'exprimingImage', type:'exRandom'}, data : {handle:'primingImage'} },
                { inherit: 'exMaskScreen'},
                { inherit: 'blankScreen'}
            ]
        }]

    });

    //Define the instructions trial- will be use gor showing the instruction at the begining of each block, and the user feedback at the end.
    API.addTrialSets('inst',{
        layout: [
            {location:{left:2,top:2},media:{word:'key: E'}, css:{color:'white','font-size':'1em'}},
            {location:{left:75,top:2},media:{word:'key: I'},  css:{color:'white','font-size':'1em'}},
            {location:{left:2,top:5},media:{word:category2}, css:{color:'#33ff33','font-size':'2em'}},
            {location:{left:75,top:5},media:{word:category1},  css:{color:'#33ff33','font-size':'2em'}}
        ],
        input: [
            {handle:'space',on:'space'}, //Will handle a SPACEBAR reponse
            {handle:'enter',on:'enter'},
            {handle:'space',on:'bottomTouch',touch:true}
        ],
        interactions: [
            { // begin trial
                conditions: [{type:'begin'}],
                actions: [{type:'showStim',handle:'All'}] //Show the instructions, later use to show the user feedback
            },
            {
                conditions: [{type:'inputEquals',value:'space'}], //What to do when space is pressed
                actions: [
                    {type:'hideStim',handle:'All'}, //Hide the instructions
                    {type:'setInput',input:{handle:'endTrial', on:'timeout',duration:500}} //In 500ms: end the trial. In the mean time, we get a blank screen.
                ]
            },
            {
                conditions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
                actions: [
                    {type:'endTrial'} //End the trial
                ]
            },
            // skip block -> if you press 'enter' while the instructions is shown, you will skip the current block.
            {
                conditions: [{type:'inputEquals',value:'enter'}],
                actions: [
                    {type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
                    {type:'endTrial'}
                ]
            }
        ]
    });

    //Create the stimuli
    API.addStimulusSets({
        //These are diffrent types of stimuli.
        //That way we can later create a stimulus object the inherits from this set randomly.
        // This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
    Default: [
        {css:{color:'white','font-size':'2em'}}
    ],
    //That way we can later create a stimulus object the inherits from this set randomly.
    targetStimulus: [
        {
            data: {alias:'chinese char.'},
            inherit:'Default',
            media: {inherit:{type:'exRandom',set:'targetWords'}} //Select a word from the media, randomly
        }
    ],

    //blankScreen  stimulus (in between the trials)
    MaskScreen : [
        {
            data : {handle:'MaskScreen'},
            inherit:'Default',
            media: {image:'ampmask.jpg'},//the mask we put on the letter
            nolog:true
        }
    ],
    exMaskScreen : [// the mask with the : "Rate now"
        {
            data : {handle:'MaskScreen'},
            inherit:'Default',
            media: {image:'ampmaskr.jpg'},//the mask we put on the letter in the example trial
            nolog:true
        }
    ],
    blankScreen : [// can be used as a fixation point by replacing the word with '+'
        {
            data : {handle:'blankScreen'},
            css:{color:'green','font-size':'2em'},
            media: {word:' '},//the blank screen in between
            nolog:true
        }
    ],
    //priming stimulus: the two catagories of images
    primingImage1 : [
        //white
        {
            data : {handle:'primingImage',alias: 'white'},
            inherit:'Default',
            media: {inherit:{type:'exRandom',set:'Images1'}}
        }
    ],
    //black
    primingImage2 : [
        {
            data : {handle:'primingImage',alias: 'black'},
            inherit:'Default',
            media: {inherit:{type:'exRandom',set:'Images2'}}
        }
    ],
    //example images
    exprimingImage : [
        {
            data : {handle:'primingImage',alias:'example'},
            inherit:'Default',
            media: {inherit:{type:'exRandom',set:'exImages'}}
        }
    ]
    });

    //Create materials (media) for the stimulus
    //three catagories of priming images, and one cayagory of words.
    //example
    API.addMediaSets({
        exImages: [
            {image: 'ampchair.jpg'},
            {image: 'amplamp.jpg'},
            {image: 'ampumbrella.jpg'}
        ]
    });
    //white
    API.addMediaSets({
        Images1: [
            {image: 'sw01.jpg'},
            {image: 'sw02.jpg'},
            {image: 'sw03.jpg'},
            {image: 'sw04.jpg'},
            {image: 'sw05.jpg'},
            {image: 'sw06.jpg'},
            {image: 'sw07.jpg'},
            {image: 'sw08.jpg'},
            {image: 'sw09.jpg'},
            {image: 'sw10.jpg'},
            {image: 'sw11.jpg'},
            {image: 'sw12.jpg'},
            {image: 'wm5.jpg'},
            {image: 'wm15.jpg'}
        ]
    });
    //black
    API.addMediaSets({
        Images2: [
            {image: 'sb01.jpg'},
            {image: 'sb02.jpg'},
            {image: 'sb03.jpg'},
            {image: 'sb04.jpg'},
            {image: 'sb05.jpg'},
            {image: 'sb06.jpg'},
            {image: 'sb07.jpg'},
            {image: 'sb08.jpg'},
            {image: 'sb09.jpg'},
            {image: 'sb10.jpg'},
            {image: 'sb11.jpg'},
            {image: 'sb12.jpg'}
        ]
    });
    //the letters
    API.addMediaSets({
        targetWords: [
            {image: 'pic1.jpg'},
            {image: 'pic2.jpg'},
            {image: 'pic3.jpg'},
            {image: 'pic4.jpg'},
            {image: 'pic5.jpg'},
            {image: 'pic6.jpg'},
            {image: 'pic7.jpg'},
            {image: 'pic8.jpg'},
            {image: 'pic9.jpg'},
            {image: 'pic10.jpg'},
            {image: 'pic11.jpg'},
            {image: 'pic12.jpg'},
            {image: 'pic13.jpg'},
            {image: 'pic14.jpg'},
            {image: 'pic15.jpg'},
            {image: 'pic16.jpg'},
            {image: 'pic17.jpg'},
            {image: 'pic18.jpg'},
            {image: 'pic19.jpg'},
            {image: 'pic20.jpg'},
            {image: 'pic21.jpg'},
            {image: 'pic22.jpg'},
            {image: 'pic23.jpg'},
            {image: 'pic24.jpg'},
            {image: 'pic25.jpg'},
            {image: 'pic26.jpg'},
            {image: 'pic27.jpg'},
            {image: 'pic28.jpg'},
            {image: 'pic29.jpg'},
            {image: 'pic30.jpg'},
            {image: 'pic31.jpg'},
            {image: 'pic32.jpg'},
            {image: 'pic33.jpg'},
            {image: 'pic34.jpg'},
            {image: 'pic35.jpg'},
            {image: 'pic36.jpg'},
            {image: 'pic37.jpg'},
            {image: 'pic38.jpg'},
            {image: 'pic39.jpg'},
            {image: 'pic40.jpg'},
            {image: 'pic41.jpg'},
            {image: 'pic42.jpg'},
            {image: 'pic43.jpg'},
            {image: 'pic44.jpg'},
            {image: 'pic45.jpg'},
            {image: 'pic46.jpg'},
            {image: 'pic47.jpg'},
            {image: 'pic48.jpg'},
            {image: 'pic49.jpg'},
            {image: 'pic50.jpg'},
            {image: 'pic51.jpg'},
            {image: 'pic52.jpg'},
            {image: 'pic53.jpg'},
            {image: 'pic54.jpg'},
            {image: 'pic55.jpg'},
            {image: 'pic56.jpg'},
            {image: 'pic57.jpg'},
            {image: 'pic58.jpg'},
            {image: 'pic59.jpg'},
            {image: 'pic60.jpg'},
            {image: 'pic61.jpg'},
            {image: 'pic62.jpg'},
            {image: 'pic63.jpg'},
            {image: 'pic64.jpg'},
            {image: 'pic65.jpg'},
            {image: 'pic66.jpg'},
            {image: 'pic67.jpg'},
            {image: 'pic68.jpg'},
            {image: 'pic69.jpg'},
            {image: 'pic70.jpg'},
            {image: 'pic71.jpg'},
            {image: 'pic72.jpg'},
            {image: 'pic73.jpg'},
            {image: 'pic74.jpg'},
            {image: 'pic75.jpg'},
            {image: 'pic76.jpg'},
            {image: 'pic77.jpg'},
            {image: 'pic78.jpg'},
            {image: 'pic79.jpg'},
            {image: 'pic80.jpg'},
            {image: 'pic81.jpg'},
            {image: 'pic82.jpg'},
            {image: 'pic83.jpg'},
            {image: 'pic84.jpg'},
            {image: 'pic85.jpg'},
            {image: 'pic86.jpg'},
            {image: 'pic87.jpg'},
            {image: 'pic88.jpg'},
            {image: 'pic89.jpg'},
            {image: 'pic90.jpg'},
            {image: 'pic91.jpg'},
            {image: 'pic92.jpg'},
            {image: 'pic93.jpg'},
            {image: 'pic94.jpg'},
            {image: 'pic95.jpg'},
            {image: 'pic96.jpg'},
            {image: 'pic97.jpg'},
            {image: 'pic98.jpg'},
            {image: 'pic99.jpg'},
            {image: 'pic100.jpg'},
            {image: 'pic101.jpg'},
            {image: 'pic102.jpg'},
            {image: 'pic103.jpg'},
            {image: 'pic104.jpg'},
            {image: 'pic105.jpg'},
            {image: 'pic106.jpg'},
            {image: 'pic107.jpg'},
            {image: 'pic108.jpg'},
            {image: 'pic109.jpg'},
            {image: 'pic110.jpg'},
            {image: 'pic111.jpg'},
            {image: 'pic112.jpg'},
            {image: 'pic113.jpg'},
            {image: 'pic114.jpg'},
            {image: 'pic115.jpg'},
            {image: 'pic116.jpg'},
            {image: 'pic117.jpg'},
            {image: 'pic118.jpg'},
            {image: 'pic119.jpg'},
            {image: 'pic120.jpg'},
            {image: 'pic121.jpg'},
            {image: 'pic122.jpg'},
            {image: 'pic123.jpg'},
            {image: 'pic124.jpg'},
            {image: 'pic125.jpg'},
            {image: 'pic126.jpg'},
            {image: 'pic127.jpg'},
            {image: 'pic128.jpg'}
        ]
    });

    //Defines the sequence of trials
    API.addSequence([
        { //Instructions trial
            data: {blockStart:true},
            inherit : "inst",
            stimuli: [
                {//The instructions stimulus
                    //the instructions that will be shown on the screen
                    media:{html:'<div><p style="font-size:16px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial"><color="FFFFFF">Press the key <B>I</B> if the drawing is more pleasant than average. Hit the <b>E</b> key If it is more unpleasant than average. The images appear and disappear quickly.  Remember to ignore the first picture and evaluate only the Chinese drawing.<br/><br/>When you are ready to try a few practice responses, hit the <b>space bar</b>.</p></div>'}
                }]},
                { //The presentation example trials
                    mixer: 'repeat',// Repeat 3 times the trial.
                    times: 3,
                    data : [{inherit: 'example',data:{block:0}}]
                },

                { //Instructions trial
                    data: {blockStart:true},
                    inherit : "inst",
                    stimuli: [
                        {//The instructions stimulus
                            media:{html:'<div><p style="font-size:16px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial"><color="FFFFFF"><br/>See how fast it is? Don\'t worry if you miss some. Go with your gut feelings.<br><br>Concentrate on the drawing and rate it as more "pleasant" than average with the <b>I</b> key, or more "unpleasant" than average with the <b>E</b> key.<br/><br/>Evaluate each Chinese drawing and not the image that appears before it. The images are sometimes distracting.<br/><br/></p><p style="font-size:14px; text-align:center; font-family:arial">Ready? Press the <b>space bar</b> to begin.<br/><br/></p><p style="font-size:12px; text-align:center; font-family:arial">(round 1 of 3)</p></div>'}
                        }]},
                        { //The presentation trials
                            mixer: 'random',
                            data : [{
                                mixer: 'repeat',// Repeat 40 times the trial. (20 times each combination)
                                times: 20,
                                data : [
                                    {inherit: 'prime1',data:{block:1}},
                                    {inherit: 'prime2',data:{block:1}}
                                ]
                            }]
                        },

                        { //Instructions trial, second round
                            data: {blockStart:true},
                            inherit : "inst",
                            stimuli: [
                                {//The instructions stimulus
                                    media:{html:'<div><p style="font-size:16px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial"><color="FFFFFF"><br/>Continue to the second round of this task. The rules are exactly the same:<br/><br/>Concentrate on the drawing and rate it as more "pleasant" than average with the <b>I</b> key, or more "unpleasant" than average with the <b>E</b> key.<br/><br/>Evaluate each Chinese drawing and not the image that appears before it. The images are sometimes distracting.<br/><br/></p><p style="font-size:14px; text-align:center; font-family:arial">Ready? Press the <b>space bar</b> to begin.<br/><br/></p><p style="font-size:12px; text-align:center; font-family:arial">(round 2 of 3)</p></div>'}
                                }
                            ]},
                            { //The presentation trials
                                // Repeat 40 times the trial. (20 times each combination)
                                mixer: 'random',
                                data : [{
                                    mixer: 'repeat',// Repeat 40 times the trial. (20 times each combination)
                                    times: 20,
                                    data : [
                                        {inherit: 'prime1',data:{block:2}},
                                        {inherit: 'prime2',data:{block:2}}
                                    ]
                                }]
                            },

                            { //Instructions trial, third round
                                data: {blockStart:true},
                                inherit : "inst",
                                stimuli: [
                                    {//The instructions stimulus
                                        media:{html:'<div><p style="font-size:16px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial"><color="FFFFFF"><br/>And now to the last round of this task. The rules are exactly the same: <br/><br/>Concentrate on the drawing and rate it as more "pleasant" than average with the <b>I</b> key, or more "unpleasant" than average with the <b>E</b> key.<br><br>Evaluate each Chinese drawing and not the image that appears before it. The images are sometimes distracting.<br/><br/></p><p style="font-size:14px; text-align:center; font-family:arial">Ready? Press the <b>space bar</b> to begin.<br/><br/></p><p style="font-size:12px; text-align:center; font-family:arial">(round 3 of 3)</p></div>'}
                                    }]},
                                    { //The presentation trials
                                        mixer: 'random',
                                        data : [{
                                            mixer: 'repeat',// Repeat 40 times the trial. (20 times each combination)
                                            times: 20,
                                            data : [
                                                {inherit: 'prime1',data:{block:3}},
                                                {inherit: 'prime2',data:{block:3}}
                                            ]
                                        }]
                                    },

                                    // user feedback
                                    {
                                        data: {blockStart:true},
                                        inherit: "inst",
                                        layout: [],
                                        stimuli: [],
                                        customize: function(){
                                            var trial = this;
                                            //console.log('computing AMP score..');//printing to the console
                                            resetCounters();
                                            //console.log(API.getLogs());//printing to the consol the log's array
                                            var logs = API.getLogs();//saving the logs
                                            computeAMPScore(logs);// computing the AMP score
                                            var feedback = 'After ' + condition1 + ', '+AMPScorer.counter.prime1.category1+' of the responses were ‘pleasant’  and '+ AMPScorer.counter.prime1.category2+' of the responses were ‘unpleasant’<br>After ' + condition2 + ', '+ AMPScorer.counter.prime2.category1+' of the responses were ‘pleasant’ and '+ AMPScorer.counter.prime2.category2+' of the responses were ‘unpleasant’.';

                                            //show the score
                                            var media1 = {media:{html:'<div><p style="font-size:16px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial"><color="#FFFFFF">' + feedback + '</p></div>'}};
                                            trial.stimuli.push(media1);
                                        }
                                    },
                                    { //Instructions trial, the end of the task, instruction what to do next
                                        data: {blockStart:true},
                                        inherit : "inst",
                                        stimuli: [
                                            {//The instructions stimulus
                                                media:{html:'<div><p style="style="font-size:16px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial"><color="#FFFFFF">You have completed the task. Press space for continue to next task.</p></div>'}
                                            }
                                        ]
                                    }
    ]); // end sequence

    return API.script;
});
