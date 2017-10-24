// You can find the images used for this task [here](https://github.com/minnojs/minno-time/tree/gh-pages/images)
// and the templates [here](https://github.com/minnojs/minno-time/tree/gh-pages/resources).
define(['pipAPI'], function(APIconstructor) {

    var API = new APIconstructor();

    API.addSequence([
        // ### Stimuli and media
        // The stimulus object is the object that tells the miTime exactly what and how to display a stimulus.
        // Part of each stimulus is the media that it displays.

        /* The trial begins here */
        {
            input: [
                {handle:'space',on:'space'}
            ],

            // The layout property is an array of the static stimuli in the trial
            layout:[
                /* the top right stimulus begins here */
                {
                    // The **location** property of the stimulus controls where the stimulus will appear. </br>
                    // Permitted values are numbers (percentages of canvas size), 'center' or 'auto'. By default, location is set to center.
                    location:{right:0,top:0},

                    // The **css** property of the stimulus controls the styling of displayed elements
                    // it uses the jquery property name standard (http://api.jquery.com/css/)
                    css: {color:'red',fontSize:'2em'},

                    // The **media** property of the stimulus controls what it is that we are about to display.
                    // the simplest form of media is a **word**, or string of text
                    media:{word:'top right (word)'}
                },
                /* the top right stimulus ends here */


                // The media object can be a piece of **html** too.
                /* the top left stimulus begins here */
                {
                    location:{left:0,top:0},
                    media:{html:'<b>bottom left (html)</b>'}
                },
                /* the top left stimulus begins here */

                // In this case the media objects uses an **external html** file.
                // (see documentation regarding how to use this as a javascript template)
                /* the bottom left stimulus begins here */
                {
                    location:{left:0,bottom:0},
                    media:{template:'../../../resources/bottom_left.html'}
                }
                /* the bottom left stimulus begins here */

            ],

            // The stimuli property holds stimuli that are to be dynamically presented
            stimuli: [
                // Lets show an **image** this time. </br>
                // The size property allows you to control the image size (in percentage of canvas). By default it is set to 'auto'.
                {
                    size: {height:75, width:'auto'},
                    media :{image:'../../images/learning.jpg'},
                    // `nolog` allows you to control whether this stimulus will be logged (see the interactions section)
                    nolog:true
                }
            ],

            interactions: [
                {
                    conditions: [{type:'begin'}],
                    actions: [{type:'showStim',handle:'All'}]
                },

                {
                    conditions: [{type:'inputEquals',value:'space'}],
                    actions: [{type:'endTrial'}]
                }
            ]
        }
        /* The trial ends here */

    ]);
    /* this is where we close the sequence */

    return API.script;
});
/* don't forget to close the require wrapper */
