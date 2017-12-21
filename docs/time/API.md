# API

- [Definitions](#definitions)
- [Media](#media)
- [Stimuli](#stimuli)
- [Trial](#trial)
    - [Layout / stimuli](#layout-stimuli)
    - [Input](#input)
    - [Interactions](#interactions)
        + [Conditions](#interactions-conditions)
        + [Actions](#interactions-actions)
- [Logging](#logging)

### Definitions
* **Media** are the objects that we display.
* **Stimuli** are responsible for how we display the media.
* **Trials** are a set of stimuli and the rules governing their display.

### Media
Media are the objects that we display. We currently support five types of media:

* Plain text: `{word: 'Your very cool stimulus'}`
* Image: `{image: 'some/url/image.png}`
* Jquery elements:` {jquery: $('<div>',{text: 'anything you want' })}`
* HTML: `{html: "<div>any html</div>"}`

If you insert a string instead of a media object the player treats it as if it was Plain text.
The folowing two media definitions have the same outcome:`'Wiki'`, `{word:'Wiki'}`

### Stimuli

Stimuli are responsible for *how* we present the media.


```javascript
{
    handle:'myStim',
    size: {height:25,width:25},
    location: {left:25,top:75},
    css:{color:'red','font-size':'2em'},
    media: {word: 'Your very cool stimulus'},
    data: {myData: 'some info', myOtherData: 'some other info'}
    nolog: false
}
```

`handle`:
Each trial may have multiple stimuli, and they are refered to by `handle`.
This is how refer to this specific stimulus inside the player (i.e. if we want to hide or show it). 
If more than one stimulus (per trial) has the same handle, all actions targeted at that handle will affect all stimuli.
You can set a stimulus handle either by setting the `handle` property, or by setting `handle` into the [data object](/minno-quest/0.1/basics/variables.html#local-variables-local-&-meta).
Alternatively, if a stimulus is inherited from a set, the handle is defined by default as the set that the stimulus was inherited from.

`size`:
The size of the stimulus in percentage of the player canvas. By default, size is set to {height:'auto',width:'auto'}.

`location`:
The location to display the stimulus, in percentage of the player canvas. Where `left:20` means that the left border of the stimulus should be 20% from the left of the canvas. You may define any of `left`/`right`/`top`/`bottom` attributes.

Instead of specifying percentages you may use the keyword `center` in order to center the stimulus, or the keyword `auto` in order to override any previous settings.
By default, location is set to `{left:'center', right:'center',top:'center', bottom:'center'}`.

`css`:
Accepts any jquery css object. (see the [api](http://api.jquery.com/css/) for details)

`media`:
Defines the media associated with this stimulus.

`touchMedia`:
An alternative media object to display in case we are on a touch device (by default, the regular media is used).

`data`:
In addition to the basic attributes of the stimulus you may add any attribute you like as meta deta that will be available from within the player

`nolog`:
If this attribute is set to true, this stimulus (and its associated media) will not be logged.
By default nolog is set to false.


### Trial

Trials are responsible for organizing stimuli and interactions with the user.

```javascript
{
    data:{my: 'arbitrary',data:'object'},
    layout: [
        stimulus1,
        stimulus2
    ],
    input: [
        {handle:'left',on:'leftTouch'},
        {handle:'right',on:'rightTouch'}
    ],
    stimuli: [
        stimulus3
    ],
    interactions: [
        {
            conditions: [{type:'begin'}],
            actions: [{type:'hideStim',handle:'myStimHandle'}]
        },
        {
            conditions: [{type:'inputEqualsStim',property:'orientation'}],
            actions: [
                {type:'showStim',handle:'myStim'},
                {type:'setInput',input:{handle:'time',on:'timeout',duration:300}}
            ]
        },
        {
            conditions: [
                {type:'inputEqualsStim',property:'orientation',negate:true},
                {type:'inputEquals',value:'time',negate:true}
            ],
            actions: [{type:'endTrial'}]
        },
        {
            conditions: [{type:'inputEquals',value:'time'}],
            actions: [{type:'hideStim',handle:'myStim'}]
        }
    ]
}
```

#### layout / stimuli

The `layout` and `stimuli` are arrays that list the stimuli associated with this trial. Stimuli in `layout` will be statically displayed throughout the trial. stimuli within `stimuli` are not displayed automatically and may be dynamically interacted with during the trial (see interactions).

#### Input

The input attribute lists the input objects that the player reacts to.
Each input object must include both a `handle` and an `on` property.

`handle`: the way we refer to this input element inside the player (e.g., 'rightClick')
`on`: what triggers this input element. for now we have several types of input:

**keypressed**: Takes a `key` property that may either be a key code, a one letter string, or an array of keys.
* `{handle: 'enter',on: 'keypressed',key:'a'}`
* `{handle: 'enter',on: 'keypressed',key:13}`
* `{handle: 'enter',on: 'keypressed',key:[13,'a']}`

**keyup**: Takes a `key` property that may either be a key code, a one letter string, or an array of keys.
* `{handle: 'enter',on: 'keypressed',key:'a'}`
* `{handle: 'enter',on: 'keypressed',key:13}`
* `{handle: 'enter',on: 'keypressed',key:[13,'a']}`

**click**: Takes either a stimulus handle (`stimHandle`) or an html element (`element`). The input is activated when the user clicks the stimulus or the html element. In case an element is defined it is presented as soon as the input is activated.
* `{handle:'right',on:'click',element:$('<div>',css:{})}`
* `{handle:'right',on:'click',stimHandle:'myStimHandle'}`

**mouseup**: Takes a stimulus handle (`stimHandle`). Triggers each time the mouse key is released over the space of the target object.
* `{handle:'right',on:'mouseup',stimHandle:'myStimHandle'}`

**mousedown**: Takes a stimulus handle (`stimHandle`). Triggers each time the mouse key is pressed over the space of the target object.
* `{handle:'right',on:'mousedown',stimHandle:'myStimHandle'}`

**mouseenter**: Takes a stimulus handle (`stimHandle`). Triggers each time the mouse enters the space of the target object. (note that this behaviour is meaningless in touch devices)
* `{handle:'right',on:'mouseenter',stimHandle:'myStimHandle'}`

**mouseleave**: Takes a stimulus handle (`stimHandle`). Triggers each time the mouse leaves the space of the target object. (note that this behaviour is meaningless in touch devices)
* `{handle:'right',on:'mouseleave',stimHandle:'myStimHandle'}`

**timeout**: Takes a `duration` property and fires after the duration passes
* `{handle:'time',on:'timeout',duration:300}`
* `{handle:'time',on:'timeout',duration:[300,600,900]]}`            pick a random value from an array
* `{handle:'time',on:'timeout',duration:{min:300, max: 900}}}`      randomly pick from within a range
* `{handle:'time',on:'timeout',duration:function(){return 630}}`    use a custom function to pick duration

In addition, we have several shortcuts for commonly used inputs:
* `{handle: 'enter',on: 'enter'}`
* `{handle: 'space',on: 'space'}`
* `{handle: 'escape',on: 'esc'}`
* `{handle:'left',on:'leftTouch'}`
* `{handle:'right',on:'rightTouch'}`
* `{handle:'top',on:'topTouch'}`
* `{handle:'bottom',on:'bottomTouch'}`

`leftTouch`, `rightTouch`, `topTouch` and `bottomTouch` support the property `css` that will allow you to change the style of the touch area, for example:

```javascript
{handle:'bottom', on: 'bottomTouch', css: {background:'blue', width: '50%'}}
```

Protip: In addition to the preset input types you can create custom input:
```javascript
    {
        handle: 'myInput',
        on: function(callback){
            // do your mojo here and then
            // where e is the raw event, and 'eventType' is the name of this event
            callback(e, 'eventType');
        },
        off: function(){
            // remove your listener (if you need to keep state you can encapsulate the whole input object in a module)
        }
    }
```

The input objects support an additional meta property: `touch`. If touch is undefined then this input will always be used.
If it is set to `true` then the input will be used only on touch devices.
If it is set to `false` then the input will be used only on non touch devices.
* `{handle:'end',on:'bottomTouch',touch:true}`
* `{handle: 'end',on: 'enter', touch:false}`

#### Interactions
Interactions are composed of conditions and actions. Every time an event is fired (any input including timeout or the begining of a trial) all the conditions are evaluated.
Notably the `begin` event at the begining of each trial only evaluates interactions that have a `{type:'begin'}` condition.

The `interactions` array is composed of interaction objects, each holding an array of conditions and an array of actions.
For each interaction object, if all the conditions are true, then all the actions are carried out.

```javascript
{
    conditions: [
        condition1,
        condition2
    ],
    actions: [
        action1,
        action2
    ]
}
```
#### Interactions: conditions

Each condition object has a `type` property that defines what type of evaluation to perform.

In addition, it has a `negate` property (false by default) that determines whether to activate the condition when the evaluation is true or when it is false.

It is possible to create complex conditions, the following condition, for instance, is activated in case there is an input that is not equal to trial.data.customAttribute, and the input handle is not "time".
```javascript
[
    {type:'inputEqualsTrial',property:'customAttribute',negate:true},
    {type:'inputEquals',value:'time',negate:true}
]
```


**begin**:
Automatically activated at the beginning of the trial, and is never fired again.
* `{type:'begin'}`

**inputEquals**:
Check if the input `handle` equals to a static value, `value` may be either a string or an array strings.
* `{type:'inputEquals',value:'enter'}`
* `{type:'inputEquals',value:['left','right']}`

**inputEqualsTrial**:
Check if the input `handle` equals to the `property` property of trial.data
* `{type:'inputEqualsTrial',property:'customAttribute'}`

**inputEqualsStim**:
Check if the input `handle` equals to the `property` property of any one of the stimulus.data in this trial.
The optional property `handle` narrows the search down to stimuli fitting the `handle`
* `{type:'inputEqualsTrial',property:"customAttribute"}`
* `{type:'inputEqualsTrial',property:"customAttribute",handle:'myStimHandle'}`

**trialEquals**:
Check if the `property` property of the trial.data object equals to `value`.
* `{type:'trialEquals',property:'customProperty', value:'someValue'}`

**inputEqualsGlobal**
Check if the input `handle` equals to the `property` property of the global object.
* `{type:'inputEqualsGlobal',property:'customAttribute'}`

**globalEquals**:
Check if the `property` property of the global object equals to `value`.
* `{type:'globalEquals',property:'customProperty', value:'someValue'}`

**globalEqualsTrial**:
Check if the global property `globalProp` equals to the trial.data property `trialProp`.
* `{type:'globalEqualsTrial',globalProp:'customAttribute', trialProp:'otherCustomAttribute'}`

**globalEqualsStim**:
Check if the global property `globalProp` equals to the `stimProp` property of any one of the stimulus.data in this trial.
The optional property `handle` narrows the search down to stimuli fitting the `handle`
* `{type:'globalEqualsTrial',globalProp:'customAttribute', stimProp:'otherCustomAttribute'}`
* `{type:'globalEqualsTrial',globalProp:'customAttribute', stimProp:'otherCustomAttribute', handle:'myStimHandle'}`

**inputEqualsCurrent**
Check if the input `handle` equals to the `property` property of the current object.
* `{type:'inputEqualsCurrent',property:'customAttribute'}`

**currentEquals**:
Check if the `property` property of the current object equals to `value`.
* `{type:'currentEquals',property:'customProperty', value:'someValue'}`

**currentEqualsTrial**:
Check if the current property `currentProp` equals to the trial.data property `trialProp`.
* `{type:'currentEqualsTrial',currentProp:'customAttribute', trialProp:'otherCustomAttribute'}`

**currentEqualsStim**:
Check if the current property `currentProp` equals to the `stimProp` property of any one of the stimulus.data in this trial.
The optional property `handle` narrows the search down to stimuli fitting the `handle`
* `{type:'currentEqualsTrial',currentProp:'customAttribute', stimProp:'otherCustomAttribute'}`
* `{type:'currentEqualsTrial',currentProp:'customAttribute', stimProp:'otherCustomAttribute', handle:'myStimHandle'}`

**function**:
This options is deprecated. use **custom** instead.

**custom**:
It is also possible to create a custom condition:

```javascript
{type:'custom', value:function(condtion, inputData, trial){
    // do your mojo here and return true or false
}}
```

#### Interactions: actions

If all the conditions in a row of interactions are true, its actions will be executed.

**showStim**:
Display a stimulus, takes a stimulus `handle`. Use 'All' for all stimuli.
* `{type:'showStim',handle:'myStim'}`
* `{type:'showStim',handle:'All'}`

**hideStim**:
Hide a stimulus, takes a stimulus `handle`. Use 'All' for all stimuli.
* `{type:'hideStim',handle:'myStim'}`
* `{type:'hideStim',handle:'All'}`

**setStimAttr**:
Set a stimulus.data attribute, takes a stimulus `handle` and a `setter` object or function.
Any attributes in the setter object will be coppied to the stimulus.data object.
* `{type:'setStimAttr',handle:'myStim',setter:{property:'value',otherProperty:'otherValue'}}`
* The setter function:

    ```javascript
    {type:'setStimAttr',handle:'myStim',setter:function(){
        // do your mojo here :)
        // the context ("this") of this function is the stimulus model
    }}
    ```

**setTrialAttr**:
Set a trial.data attribute, takes a `setter` object or function.
Any attributes in the setter object will be coppied to the trial.data object.
* `{type:'setTrialAttr',setter:{property:'value',otherProperty:'otherValue'}}`
* The setter function:

    ```javascript
    {type:'setTrialAttr',setter:function(trialData, eventData){
        // do your mojo here :)
        // trialData is the data object for this trial
        // eventData is the internal event that triggered this action
        // the context ("this") of this function is the trial object
    }}
    ```

**setGlobalAttr**:
Set a global object property, takes a `setter` object or function.
Any attributes in the setter object will be coppied into the global object.
* `{type:'setGlobalAttr',setter:{property:'value',otherProperty:'otherValue'}}`
* The setter function:

    ```javascript
    {type:'setGlobalAttr',setter:function(globalObject){
        // do your mojo here :)
        // globalObject is the global object...
    }}
    ```

**trigger**:
Activate the input `handle`. If duration is set, the activation happens after the duration. By default the input `handle` is triggered immediately.
* `{type:'trigger',handle:'now'}`
* `{type:'trigger',handle:'later',duration:250}`
* `{type:'trigger',handle:'time',on:'timeout',duration:[300,600,900]]}`            pick a random value from an array
* `{type:'trigger',handle:'time',on:'timeout',duration:{min:300, max: 900}}}`      randomly pick from within a range
* `{type:'trigger',handle:'time',on:'timeout',duration:function(){return 630}}`    use a custom function to pick duration

**setInput**:
Set input listener (useful for adding timeouts), takes an `input` [object](#input).
* `{type:'setInput',input:{handle:'time',on:'timeout',duration:300}}`

**removeInput**:
Remove input listener, takes an input `handle` or an array of input handles. The special keyword `All` removes all listeners. **Warning** you must add listeners after using removeInput:All, or else the player will get stuck. This command removes triggers as well as regular input listeners.
* `{type:'removeInput',handle : 'time'}`
* `{type:'removeInput',handle : ['time','left']}`
* `{type:'removeInput',handle : 'All'}`

**resetTimer**:
Resets trial timer. The latency of any events from here on (including the current one) will be calculated back to the reset instead of the begining of the trial.
* `{type:'resetTimer'}`

**endTrial**:
End this trial (note that any actions that come after this is called may not work properly).
* `{type:'endTrial'}`

**canvas**:
Change canvas style using any of the following properties (see [settings](#canvas)): `background`, `canvasBackground`, `borderColor`, `borderWidth`.
* `{type:'canvas', background:'blue'}`

**log**:
Log this action. Pushes this action into the logging stack so that it is later sent to the server (you can set how the player logs an action using the [logger settings](#logger))
* `{type:'log'}`

**custom**
Run a custom function. This action is intended to for use by experienced users that want to tinker with the inner workings of the player - use at your own risk! The `fn` property takes a custom function. The function takes two arguments: options is the action object itself, the second is the event data object.
* `{type:'custom',fn:function(options,eventData){}}`

**goto**:
Responsible for the next trial we go to. This action will be executed only after the trial ends, you will probably want to follow it with an endTrial action.

The `destination` property defines what type of goto this is (default is "next").

The `properties` property is an object to compare to the trial data. Note that the properties will only compare to properties present in the raw sequence before inheritance!

* `{type:'goto',destination: 'next'}` goto the next trial (this is the default)
* `{type:'goto',destination: 'current'}` rerun the current trial
* `{type:'goto',destination: 'first'}` goto the first trial
* `{type:'goto',destination: 'last'}` goto the last trial
* `{type:'goto',destination: 'end'}` end this task
* `{type:'goto',destination: 'nextWhere', properties: {blockStart:true}}` goto the next trial that has these properties
* `{type:'goto',destination: 'previousWhere', properties: {blockStart:true}}` goto the previous trial that has these properties

### Changing Settings

Player wide settings are set within the "settings" property of the task JSON.
```javascript
settings = {
    logger: {
        url: 'your/target/url',
        logger: function(){
            // do your mojo here :)
        }
    },
    canvas: {
        maxWidth: 800,
        proportions : 1
    }
}
```

#### Logger

```javascript
logger: {
    url: 'your/target/url',
    pulse: 3,
    fullpath: false,
    logger: function(){
        // do your mojo here :)
    }
}
```

The logger section is responsible for logging options.

`url`:
Is the url to which we send the logged data (ask your IT team what it should be). You should set this if you want to log your data...

`pulse`:
After how many rows should we send data to the server.
In case the number of rows is reached during a trial, the player waits until the end of the trial and sends all the log rows it gathered at once.
Regardless of pulse, the player sends all remaining log rows at the end of the task.
This means that it is possible to get pulses holding more or less than "pulse" rows.
If pulse is not set (or is set to 0) the player will send all data at the end of the task.

`fullpath`:
When using the media path to log media elements (for images and templates), should we use the full path or just the filename (`false` by default)

`meta`:
An object that is used to extend each logged row. This is useful in case you want to add some global data to the posts (such as server generated user id, or task name).

`logger`:
Accepts a function to replace the existing logging function. (don't touch this if you don't **realy** know what you're doing).
The logger function is called each time a log action is triggered (see interactions: actions [log](#interactions-actions)).
It is responsible for adding a logging row to be sent to the server.

```javascript
function(trialData, inputData, actionData,logStack){
    // trialData: the data object from this trial
    // inputData: the input object that triggered this action
    // actionData: the action object that was triggered (it should look like {type:'log', your:'custom property'})
    // logStack: an array with all previously logged rows

    // the context for this function ("this") is the original trial object

    // the function should return an object to be pushed into the trial stack, and later be sent to the server
}
```

This is what the default logger looks like:
```javascript
function(trialData, inputData, actionData,logStack){
    var stimList = this._stimulus_collection.get_stimlist();
    var mediaList = this._stimulus_collection.get_medialist();

    return {
        log_serial : logStack.length,
        trial_id: this._id,
        name: this.name(),
        responseHandle: inputData.handle,
        latency: Math.floor(inputData.latency),
        stimuli: stimList,
        media: mediaList,
        data: trialData
    };
};
```

#### Canvas

The canvas section is responsible for the overall look of the player.
It controls the shape and appearance of the canvas.

```javascript
canvas: {
    maxWidth: 800,
    proportions : 0.8
}
```

`width`:
If width is set, then the canvas size is set to a constant width (set the hight using the `proportions` property).

`maxWidth`:
The maximum width (in pixels) that the canvas may reach. By default it is set to 500px (note that if `width`  is set, then this property is ignored and the canvas size stays static).

`proportions`:
Responsible for the shape of the canvas. You can set it either as a number or an object. By default it is set to `0.8`.
* `{width:2,height:3}`
* `1.5` calculated as height/width

`textSize`:
Controls the default font size in the canvas. It takes a single number that represents font size in percentage of the canvas height (similar to the CSS3 `vh` unit). By default it is set to 3. Any fontSize within your script that uses a relative unit (percent/em) will be relative to this size. Any fontSize that uses an absolute unit (px/pt) will ignore it.

`background`:
Controls the background color of the whole screen.

`canvasBackground`:
Controls the background color of the player canvas.

`borderWidth`:
Controls the width of the player canvas borders (in pixels).

`borderColor`:
Controls the color of the player canvas borders.

`css`:
Allows you to add any custom css to the canvas (using the jquery css [API](http://api.jquery.com/css/)).

#### Base_url

The `base_url` section is responsible for loading images and templates. It allows the user to pick a base url from which to load all images and templates.
It accepts either an object setting the base url for images and templates or a string that will be used for both images and templates:
```javascript
// object notation
base_url: {
    image: "images",
    template: "templates/"
}

// string notation
base_url: "media/"
```

#### Redirect

The redirect setting decides where to redirect the player at the end of the task.
By default, the player simply refreshes the current page.
This option is not used if the endTask hook is set.

```javascript
redirect: '//my.domain.edu'
```

#### Hooks
Hooks are functions that are to be run at predefined points throughout the player.

```javascript
hooks: {
    endTask: function(){}
}
```

`endTask`:
Called at the end of the task instead of the default redirect.

#### onEnd
Called at the end of the task instead of the default redirect.
This function is a more standart complient version of `hooks.endTask`.


#### Meta data

Meta data is data that should be returned with every request to the server.
Any key value pair in the meta data is added to every post the player makes to the server.
In order to create a post with three keys: json, session_id and task_id - you would write something like this:

```javascript
metaData: {
    session_id: 9872356,
    task_id: '43BTW78'
}
```

(the json field is the field that holds the player data it is created automaticaly)



### API

The API is a javascript object that is used to activate the miTime.
The basic format for accessing the API is as follows:

```javascript
define(['app/API'], function(APIconstructor) {
    var API = new APIconstructor();

    API.addScript(script);
    
    return API.script;
});
```

The API object exposes several helper function to help you organize your script.

**addScript**:
Allows pushing a whole script to the player:
* `API.addScript(script);`

**getScript**:
Returns the whole player script:
* `API.getScript();`

**addGlobal, addCurrent**
Allows extending the global or current objects respectively:
* `API.addGlobal(object);`
* `API.addCurrent(object);`

    For instance if the current global object looks like this:

    ```javascript
    var globalObject = {
        name: 'Sándor Ferenczi',
        score: '90'
    }
    ```

    Then the following script:
    ```javascript
    API.addGlobal({
        score: '100',
        done: true
    })
    ```

    Will leave the global object as
    ```javascript
    var globalObject = {
        name: 'Sándor Ferenczi',
        score: '100',
        done: true
    }
    ```

**getGlobal, getCurrent**:
Returns the global or current object respectively:
* `API.getGlobal();`
* `API.getCurrent();`

**addSettings**:
`API.addSettings` allows you to add settings to your script.

You may add a whole settings section:

```javascript
API.addSettings({
    canvas: {},
    logger: {}
});
```

Alternatively you may add a specific setting:
```javascript
API.addSettings('canvas',{
    maxWidth: 800,
    proportions : 0.8
});
```

**addTrialSets, addStimulusSets and addMediaSets**:
There are three add set functions, one for each of the set types: `addTrialSets`, `addStimulusSets` and `addMediaSets`.
Each of them allows adding sets to your script.
You may add a complete sets object:

```javascript
API.addTrialSets({
    Default: [defaultTrial],
    introduction: [intro1, intro2, intro3]
});
```

Or you may add a single set:
```javascript
API.addTrialSets("introduction",[intro1, intro2]); // adds intro1 and intro2 to the introduction set
```

Or part of a set
```javascript
API.addTrialSets("introduction",intro3); // adds intro3 to the introduction set
```

**addSequence**
Allows adding sequence objects to your script.

Here is a single set:
```javascript
API.addSequence([trial1,trial2]);
```

And part of a set:
```javascript
API.addSequence(trial2);
```

**getScript**:
Returns the script that you've built so far. Useful mainly for debugging:
* `console.log(API.getScript());`

**getLogs**:
Returns the logs for this task. Useful for giving user feedback or creating staircase tasks
* `console.log(API.getLogs());`

### Logging

The player sends all the data it has gathered to the url defined in the settings [logger](#logger).
The data is sent as an ajax POST where the only field is "json" (unless you added something using [metadata](#meta-data)).
The field includes a json array including all logs created. each log is an object including the following fields:


Field           | Description
--------------- |---
log_serial      | the serial number for this log row (starts at 1)
trial_id        | a unique identifier for this trial
name            | the name of this trial - an alias if one is set, otherwise the set the trial inherited
block           | the block attribute of trial.data (it is up to the user to set this attribute, usually in the trial definitions)
responseHandle  | the handle for the input that triggered this log
score           | the score attribute of trial.data (it is up to the user to set this attribute, usually using setTrialAttr)
latency         | the latency of the response from the beginning of the trial
stimuli         | a json including the stimuli used in this trial (we use an alias if one is set, otherwise the stimulus set, otherwise the stimulus handle otherwise stim#)
media           | a json including the media used in this trial (we use an alias if one is set, otherwise the media set, otherwise media#)
data            | a json including the data property of this trial

You can control the names that the different elements get by adding an `alias` property to the element itslef or to its `data`.
If the `alias` isn't set, then the player attempts to choose a meaningful name on its own (using the inherited set, or whatever is appropriate).
