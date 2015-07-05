### Table of contents

- [Overview](#overview)
- [Mixer](#mixer)
    - [Mixer types](#mixer-types)
    - [Conditions](#conditions)
    - [Operators](#operators)
    - [Aggregation](#aggregation)
- [Templates](#templates)
- [Variables](#variables)
- [Inheritance](#inheritance)
    - [Sets](#sets)
    - [Inheriting](#inheriting)
    - [Merge](#merge)
    - [Type](#type)
    - [Repeat](#repeat)
    - [Seed](#seed)
    - [Customization](#customization)

### Overview

All PI tasks use the same framework to manage their elements. Its purpose is to allow dynamic creation and management of your elements. It has three critical components: The sequence mixer, inheritance and templating.

Each PI task is composed of a series of elements sequentially activated and presented to the users (these are trials for piPlayer, pages for piQuest and tasks for piManager). The sequence [**mixer**](#mixer) is responsible for the order of the elements presented to the users, it is capable of randomization as well as various other manipulations on the structure of the sequence.

Each element may be based upon other elements. This allows us to create simpler scripts as well as add a level of randomization to our tasks. In order to base an element on other elements we use the [inheritance](#inheritance) system.

All tasks use a system of global as well as local variables that can be used to customize elements (as well as some other things). You can put the [variables](#variables) at your service using [templates](#templates) that allow you to have your settings dynamically depend on the environmental variables.

We will start by reviewing the sequence and mixers. And then get into inheritance, variables and templates.

### Mixer

The mixer is responsible for managing sequences of elements within the PI tasks, it is capable of repeating, randomizing and even changing the list according to [environmental variables](#variables). You may use it within the sequence or within some of the lists within pi tasks (such as piQuest questions arrays).

The mixer allows wrapping a sub sequence in an object that allows you to manipulate the way in which it appears. You may insert such an object at any place within a sequence and it will be replaced by the appropriate objects.

The basic structure of a mixer object is:
```js
{
    mixer: 'mixerType', // let the sequencer know that this is a mixer
    data: [obj1, obj2] // define the sub-sequence to be mixed
}
```

The `mixer` property defines the mixer type. It tells the mixer what to do with the sub-sequence. The `data` property defines the sub-sequence; an array of elements (either plain objects or mixer objects themselves).

A sequence can look something like this:

```js
[
    // The first obj to present.
    firstobj,

    // Repeat the structure inside 10 time (so we get 40 objs)
    {
        mixer: 'repeat',
        times: 10,
        data: [
            // Delay the mixing of these elements until after the `repeat`.
            {
                mixer: 'wrapper',
                data: [
                    obj1,
                    // Randomize the order of the objectss within.
                    {
                        mixer: 'random',
                        data: [
                            obj2,
                            // Keep obj 3 and 4 together.
                            {
                                mixer: 'wrapper',
                                data: [
                                    obj3,
                                    obj4
                                ]
                            }
                        ]
                    } // end random
                ]
            } // end wrapper
        ]
    }, // end repeat

    // the last obj to present
    lastobj
]
```

This sequence has an opening and ending obj (`firstobj` and `lastobj`).
Between them them we repeat a set of four objs ten times.
The order within the four objects is randomized, so that `obj1` always comes first and the order of the following objs are randomized but `obj3` and `obj4` are wrapped together and therefore always stay consecutive.

#### Mixer types

**repeat**:
Repeats the element in `data` `times` times.
* `{mixer:'repeat', times:10, data: [obj1,obj2]}`

**random**:
Randomizes the order of elements in `data`. Please note that the randomizer pre-mixes all the content in data, so that any branching mixers will be branched according to the environment as it is when the random mixer is reached. If you want to delay the branching until it is reached, simply wrap it within a `wrapper` mixer.
* `{mixer:'random', data: [obj1,obj2]}`

**weightedRandom**:
Selects a single element using a weighted random algorithm. Each element in `data` is given the appropriate weight from `weights`. In the following example obj2 has four times the probability of being selected as obj1.
* `{mixer:'weightedRandom', weights: [0.2,0.8], data: [obj1,obj2]}`

**choose**:
Selects `n` random elements from `data` (by default the chooser picks one element).
* `{mixer:'choose', data: [obj1,obj2]}` pick one of these two objs
* `{mixer:'choose', n:2, data: [obj1,obj2,obj3]}` pick two of these three objs

**wrapper**:
The wrapper mixer serves a sort of parenthesis for the mixer. In case you want to keep a set of elements as a block (when randomizing) simply wrap them and they'll stay together.
* `{mixer:'wrapper', data: [obj1,obj2]}`

**branch**:
* `{mixer:'branch', conditions:[cond], data:[obj1,obj2]}`
* `{mixer:'branch', conditions:[cond], data:[obj1,obj2], elseData: [obj3, obj4]}`
Select the elements in `data` if all the conditions in the `conditions` array are true, select the elements in `elseData` if at least one of the conditions in `conditions` are not true. If `elseData` is not defined, or is left empty, then nothing happen in case the conditions are not true (See [conditions](#conditions) to learn about how conditions work).

**multiBranch**:
```js
{
    mixer: 'multiBranch',
    branches: [
        {conditions: [],data: []},
        {conditions: [],data: []}
    ],
    elseData: [] // optional
}
```
Find the first object within `branches` for which `conditions` is true, and select the elements in that objects `data`. If no object is selected then select `elseData` (optional). (See [conditions](#conditions) to learn about how conditions work).

#### Conditions
The conditional mixers (`branch` & `multiBranch`) allow you to change the content of a list according to [environmental variables](#variables). Each list has specific variables available to it, you can find the relevant details in the documentation for each list, but all lists have access to the `global` and `current` objects, so we'll use them for all examples here.

A condition is a proposition, it is evaluated to either a `true` or `false` value. Conditions are used for decision making within the branching mixers. Conditions are represented by objects. The following condition object `compare`s **global.var** `to` **current.otherVar** and examines if they are equal (if you aren't sure what **global.var** means, see [here](#variables)):

```js
var cond = {
    compare: 'global.myVar',
    to: 'current.myOtherVar'
}
```

Conditions should be treated as a type of equation.

In the `compare` and `to` properties you can set either straight forward values or references to a variable:

```js
//Compares the variable time to the value 12
var cond1 = {
    compare: 'global.time',
    to: '12'
}
//Compare the variable gender to the value 'Female'
var cond2 = {
    compare: 'Female',
    to: 'local.gender'
}
```

When you want to refer to a variable, you use text with dots: `global.var`, `questions.q1.response`; these values will be treated as pointing to variables within the lists context. `questions.q1.response` will retrieve the value of the response for q1 from the questions object.

Here are the condition's possible properties:

Property        | Description
--------------- | -------------------
compare         | The left side of the equation.
to              | The right side of the equation.
operator        | The type of comparison to do (read more about operators [here](#operators)).

In piQuest and piManager, you may want to debug conditions by [activating the DEBUG `conditions` setting](#debugging). When activated, then any condition that is evaluated will be logged to the console.

Advanced users may want to replace the whole condition object with a custom function that returns true or false. The context for the function is an object holding the *global*, *current* and *questions* objects.

```js
function cond(){
    var global = this.global; // get the global from the context
    return global.skip;
}
```


#### Operators
The default comparison for a condition is to check equality (supports comparison of objects and arrays too). You can use the `operator` property to change the comparison method. The following checks if var is greater than otherVar:

```js
var cond = {
    compare: 'global.var',
    to: 'local.otherVar',
    operator: 'greaterThan'
}
```

Operator            | Description
------------------- | -----------------
equals              | This is the default operator. It checks if *compare* is equal to *to* (supports comparison of objects and arrays too)
exactly             | Checks if *compare* is exactly equal to *to* (uses ===)
greaterThan         | *compare* > *to*
greaterThanOrEquals | *compare* >= *to*
in                  | *compare* is in the Array *to*;
function(){}        | This operator allows you to use a custom function of the form: `function(compareValue, toValue, context){return {Boolean}}`. The context is an object holding the *global*, *current* and *questions* objects.

#### Aggregation
Sometimes you will want a branch to be activated only if more than one condition is true, or in some other complex specific condition. For cases like this, the mixer supports aggregation. The mixer supports applying logical operations on conditions in the following way:

An aggregator object has a single property, denoting the type of aggregation, holding an array of conditions to aggregate. The following condition will only be true if `cond1` and `cond2` are both true:

```js
var cond = {and:[cond1, cond2]};
```

The mixer supports several types of aggregators:

Aggregator  | Description
----------- | --------------
and         | If all conditions are true
or          | If at least one condition is true
nor         | If all conditions are false
nand        | If at least one condition is false

By default, if the mixer runs into an array instead of an object, it will treat it as an `and` aggregator and be true only if all conditions within the array are true.

Following are several examples for how to create different aggregations:

```js
// cond1 && cond2
var conds = [cond1, cond2];

// cond1 && (cond2 || cond3)
var conds = [cond1, {or:[cond2,cond3]}];

// (cond1 && cond2) || cond2
var conds = [{or:[{and:[cond1,cond2]},cond3]}]
```

### Templates
One of the ways to create dynamic questionnaires is using templates. Templates are a format that allows you to dynamically generate settings for your questions. You can replace any non-object setting from within your elements with a template, and it will be rendered according to the [environmental variables](#variables) (The exception to this rule is the `inherit` setting that cannot use templates).

A template is a string that has a section of the form `<%= %>` in it. Within these brackets you can write any Javascript that you like and it will be evaluated and printed out. The player uses [lodash templates](http://lodash.com/docs#template) internally, you can look them up to see all the possible uses.

The main use of templates is probably accessing local and global variables. For instance, in order to print the global variable "name", you could create a template that looks like this: `My name is <%= global.name%>`.

Templates allow access only to a confined number of variables; These vary a bit between different tasks, but you can expect the templates to have access to the `global` and `current` objects. Element templates also have access to their own data property as {namespace}Data (so that trials will have a `trialData` object, and stimuli a `mediaData` property). Some objects have access to additional properties, you can find them in their respective documentation.

### Variables
Sometimes it is not enough to hard code behaviors into your tasks, sometimes you want behavior to depend on a previous response, or change your texts according to randomization. In order to support these behaviors you can use variables.

#### Environmental Variables
The `global` variable is the context of everything that happens within the task manager. It is an object that holds a property for each task that is run. 
In addition, you as a user may extend it manually using the `API.addGlobal` or `API.addCurrent` functions. Any Task element can have the additional property `addGlobal` or `addCurrent` that get added to the global/current whenever that element is activated. This options is useful in various cases of branching.For advanced uses you can also access the global object directly by changing the `window.piGlobal` object.

```js
API.addGlobal({
    value: 123,
    variable: [1,2,3]
})
```

Each task creates an object associated with it that logs anything that happens within the task. In the duration of the task, this object can be accessed using the `current` object. After the task ends, the object stays available from within the global object as `global.taskName`, where "taskName" is the name associated with this specific task.
The task object is there for you to change. You can extend it to your hearts content using `API.addCurrent`:

```js
API.addCurrent({
    value: 123,
    variable: [1,2,3]
})
```

Tasks add any data that they log into their task object. For instance, piQuest maintains a `current.questions` object that holds the responses for all questions.

#### Local Variables
In addition to these environmental variables, you have access to two types of local variables; *Data* and *Meta* . They are each available within the mixer/templates with specific names tied to their type. The naming convention for these variables is `<elementName>Data` and `<elementName>Meta`. For example, for tasks they appear as `tasksData` and `tasksMeta`. 

The elementNames for the various tasks are as follows:

Task        | elementName | Object names
----------- | ----------- | ------------
piManager   | tasks       | tasksData, tasksMeta
piQuest     | pages       | pagesData, pagesMeta
            | questions   | questionsData, questionsMeta
piPlayer    | trial       | trialData, trialMeta
            | stimulus    | stimulusData, stimulusMeta
            | media       | mediaData, mediaMeta

If you set the data property of your elements, then they become available as the `<elementName>Data` objects.

Each element within the sequence gets a Meta object that holds automatically generated information regarding the location of the element within the sequence. It has two properties:

Property    | Description  
----------- | -----------
number      | The serial number for this element within the sequence (i.e. 3 if this is the third element to be presented).
outOf       | An attempt to estimate how many elements are in the sequence overall. This number cannot be fully trusted as the number of elements may be dynamically generated and depend on various variables not yet determined.

### Inheritance

The inheritance system allows you to compose task elements based on previously defined prototypes.

This behavior is often used for the abstraction of tasks; having the behavior of multiple elements defined at a single location. The other typical use, is for different types of randomizations.

We will first cover the creation of prototype sets from which we can inherit. Then we will go over the actual inheritance behavior.

#### Sets
Each element in the PI tasks can inherit its attributes from an element set.

The element sets are defined using the `addSet` functions defined in the [API](API.html). Each element type has its own function (for example, `addQuestionsSets` for piQuest).

Each set holds an array of elements that can later be referred to as prototypes for new elements.

```js
API.addQuestionsSet('likert', [
    {type: 'selectOne', numericValues: true}
]);

API.addQuestionsSet('sizeLikert', [
    {inherit: 'likert', answers: ['Big', 'Medium', 'Small']}
]);
```

Note that the name that you give the set (in the example: *likert* or *sizeLikert*) is the handle that you will later use to refer to it.

#### Inheriting

Inheritance means that we use one element as the prototype, or parent, for another element.

When inheriting an element, the child element starts out with all of the parent's attributes and extends them with its own. This means that we use the parent element as a base and then copy in any properties that the child has, overwriting any existing properties.
One exception to this rule is the `data` objects which we attempt to merge (giving precedence to the child).

Follow this pseudo code:
```js
// The parent page
{
    data: {name: 'jhon', family:'doe'}
    questions: [
        quest1,
        quest2
    ]
}

// The child page which attempts to inherit the parent
{
    inherit: 'parent',
    data: {name: 'jack'}
    questions: [
        quest3
    ]
}

// The result would be:
{
    // the child kept its own name but inherited the family name
    data: {name: 'jack', family:'doe'}
    // the questions array was completely overwritten
    questions: [                          
        quest3
    ]
}
```

In order for an element to inherit another element it must use the `inherit` property. `inherit` takes an object or a string, with instructions for which element to inherit. If a string is used, the sequencer treats it as if it was a set name, and picks a random element from within that set.

```js
{
    inherit: {set:'mySetName', type:'random'}
}
```

property        | description
--------------- | ---------------------
set             | The name of the set from which we want to inherit.
type            | The inheritance type - essentially how to pick from within the set (random by default, see [docs](#type)).
merge           | An array of property names that we want to merge instead of overwrite (see [docs](#merge)).
seed            | The randomization seed (see [docs](#seed)).
repeat          | Repeat the result of the last randomization (see [docs](#repeat)).
customize       | A function that can customize the element before it is used. This is an option only for advanced users, use this only if you really know what you are doing (seed [docs](#customization))

#### Merge
By default, inheritance overwrites each property of the parent that the child already has. In order to change this behavior, you can add property names to the `merge` array, and the sequencer will attempt to merge the data from the parent into the child.
This can look something like this:
```js
// The parent page
{    
    set: 'parent'
    stimuli: [
        stim1        
    ]
}

// The child page which attempts to inherit the parent
{
    inherit: {set:'parent', merge:['stimuli']},    
    stimuli: [
        stim2
    ]
}

// The result would be:
{
    // the stimuli array was merged instead of overwritten
    stimuli: [                          
        stim1,
        stim2
    ]
}
```

#### Type
We have implemented several types of inheritance:

##### random:
Randomly selects an element from the set (in case the set has only one element, the same element will always be selected, of course). 
* `'setName'`
* `{set: 'setName'}`
* `{set: 'setName', type:'random'}`

This is the default inheritance type, so it is not obligatory to use the `type` property. You can also use a short cut and set the `set` using only its name, like we did in the example above

##### exRandom:
Selects a random element without repeating the same element until we've gone through the whole set
* `{set: 'setName', type:'exRandom'}`

##### sequential:
Selects the elements by the order they were inserted into the set
* `{set: 'setName', type:'sequential'}`

##### byData:
Selects a specific element from the set.
We compare the `data` property to the `element.data` property and if `data` is a subset of `element.data` it selects the element (this means that if all properties of data property equal to the properties of the same name in element.data it is a fit).
This function will select only the first element to fit the data.
If the data property is set as a string, we assume it refers to the element handle.

* `{set: 'setName', type: 'byData', data: {block:1, row:2}}` picks the element with both block:1 and row:2
* `{set: 'setName', type: 'byData', data: "myStimHandle"}` picks the element that has the "myStimHandle" handle

##### function:
You may also use a custom function to select your element (the function here, fully replaces the inherit object).
```js
function(collection){
    // The collection holds all the elements within the namespace you are querying.
    // Simply return the element you want to inherit.
}
```

#### Seed

The inheritance systems uses seeds to keep track of consecutive calls to the different types of inheritance. If you want to have parallel groups of inheritance to the same set, you can use seeds.
Each inheritance query automatically gets assigned to a "seed" that is used to track its progress. For example, the seed is used to keep track of the current element in the `sequential` type inheritance.
Most of the time, the seed is transparent to the user, but sometimes it becomes useful to have manual control over the inheritance seed. For instance, if you want to reset an `exRandom` inheritance - simply use `exRandom` with a new seed. Same goes if you want to keep two instances of a `sequential` inheritance.

In the following example, both elements inherit exRandomly from the trials set. But the second element restarts the randomization.
```js
[
    {
        inherit: {set:'trials', type:'exRandom',seed:'block1'}
    },
    {
        inherit: {set:'trials', type:'exRandom',seed:'block2'}
    }
]

```

Seeds are not confined to a specific set, and not even to a specific element type. Maybe a more interesting use, is to use the same seed across two different sets (you can see a real world application for this under the [repeat](#repeat) option).
It is important to take note that if you create custom seeds, it is your responsibility that they query sets of the same length. If you try to inherit two sets with different lengths the sequencer will throw an error.
In order to create a new seed all you have to do is set the `seed` property with the new seeds name (String).

#### Repeat
Sometimes we have need to repeat a previous choice done by the inheritance picker (especially in cases of randomization). In order to do this, all you have to do is set the `repeat` property to true.

For instance, the following sequence will display a random element from the trials set twice.
```js
[
    {
        inherit:{set:'trials',type:'random'}
    },
    {
        inherit:{set:'trials',type:'random', repeat:true}
    }
]
```

The `repeat` property can used within any type of randomization. We've seen a simple use, but its true power comes when combined with [seeds](#seeds).

The following example uses the same exRandom seed to pick a both a trial and the two stimuli associated with it (the n<sup>th</sup> element in trials is always associated with the n<sup>th</sup> elements of stimuli-1 and stimuli-2).

```js
[
    {
        inherit: {set:'trials', type:'exRandom', seed:'mySeed'}
        stimuli:[
            {inherit: {set:'stimuli-1', type:'exRandom', seed:'mySeed', repeat:true}
            {inherit: {set:'stimuli-2', type:'exRandom', seed:'mySeed', repeat:true}
        ]
    }
]
```

#### Customization

Each element can also define a `customize` method, this method is called once the element is inherited but before it is activated.
It accepts two argument: the source element on which it is called, and the global object (in which you can find the current object etc.). The source element is also the context for the function.
You should make any changes that you want on the source element itself.

```js
{    
    inherit: 'mySet',
    customize : function(element, global){
        element.questions.push(quest);
    }
}
```