## Slide show
This section of the tutorial will walk you through creating a slide show. We will create a simple task that displays a series of stimuli. In this tutorial we will learn how to utilize the sequence, and the very basics of inheritance.

### A simple slide show
Tasks normaly include more than one trial. You will note that the sequence holds an array; any trials in the array will be activated sequentialy.

This is the trial that we already know from the *Hello world* tutorial:

```js
{
	input: [{handle:'space',on:'space'}],
	layout: [{
		media :{word:'Hello world'},
		css:{fontSize:'2em',color:'#D7685A'}
	}],
	interactions: [{
		conditions: [{type:'inputEquals',value:'space'}],
		actions: [{type:'endTrial'}]
	}]
}
```

We will now string several of these trials together to get a simple slide show:

```js
API.addSequence([
	{
		input: [{handle:'space',on:'space'}],
		layout: [{
			media :{word:'Is\'nt'},
			css:{fontSize:'2em',color:'#D7685A'}
		}],
		interactions: [{
			conditions: [{type:'inputEquals',value:'space'}],
			actions: [{type:'endTrial'}]
		}]
	},
	{
		input: [{handle:'space',on:'space'}],
		layout: [{
			media :{word:'this'},
			css:{fontSize:'2em',color:'#D7685A'}
		}],
		interactions: [{
			conditions: [{type:'inputEquals',value:'space'}],
			actions: [{type:'endTrial'}]
		}]
	},
	{
		input: [{handle:'space',on:'space'}],
		layout: [{
			media :{word:'cool?'},
			css:{fontSize:'2em',color:'#D7685A'}
		}],
		interactions: [{
			conditions: [{type:'inputEquals',value:'space'}],
			actions: [{type:'endTrial'}]
		}]
	}
]);
```

You should try it! (don't forget the wrapper, and the activation function at the end (`API.play()`)). Try adding another trial. Try changing the media or style of the stimuli.

Download [here](../../resources/tutorials/js/slideshow1.js). You can see it in action right [here](#{player}../resources/tutorials/js/slideshow1.js).

### Basic inheritance
Our task is becoming longer and harder to maintain. Imagine a slide show with 50 slides, it would be more than 500 lines of code long, and if we would want to make any changes to it we would have to go through each trial individualy and change it. This is where inheritance comes in. Inheritance allows you to create a prototype of a trial (or stimulus or media object), and extend it whenever you want. We will see how this works shortly, but first we need to learn a bit about sets.

#### **Sets**
[Sets](./API.md#sets)  are list of PIP objects (trials, stiumli or media objects). They are useful for two reasons; first of all they help you organize your code, secondly, you can only inherit/extend objects that reside in sets. We will focus on trial sets for now, but everything that applies to the applies to stimuli sets or media sets as well.

You create trial sets using the `API.addTrialSets()` function. The simplest use of the function involves two arguments; the first is the set name, and the seconds is an array of objects to add to the set. The following code creates a trial set called *slide* and populates it with our "Hello world" trial.

```js
API.addTrialSets('slide',[{
	input: [{handle:'space',on:'space'}],
	layout: [{media :{word:'Hello world'}}],
	interactions: [{
		conditions: [{type:'inputEquals',value:'space'}],
		actions: [{type:'endTrial'}]
	}]
}])
```

#### **Inheritance**
So we have a trial set, what now? As soon as we have a set we can go ahead and use it for inheritance.

Trials (and stimuli and media too) have a special property called [inherit](./API.md#inheriting) that allows them to specify a specific set to inherit from. This allows trials to be significantly shorter. The following code activates our slide three times:

```js
API.addSequence([
	{inherit:'slide'},
	{inherit:'slide'},
	{inherit:'slide'}
]);
```

#### **Extending**
But repeating slides is pretty boring. Why would we want to do that?

There are several answers to that question but for now we will focus on one: **extending**. As soon as we've inherited a trial we can extend it by simply adding properties or overwriting existing ones. The model is quite simple. A child inherits all of its parents properties. any property that is added to it overrides any existing properties.

Lets follow an example. Lets say the following object recides in the "parent" set.

```js
{
	family: 'Smith'
}
```

Simply inheriting it will result in a property for property copy. But we can go one step further and extend it by adding an additional property; in this case - *name*:

```js
{
	inherit:'parent',
	name: 'John'
}
```

This extends the object which becomes:

```js
{
	family: 'Smith',
	name: 'John'
}
```

If we go back to our example we can now extend each of the slides:

```js
API.addSequence([
	{
		inherit:'slide',
		layout: [{media :{word:'This'}}]
	},
	{
		inherit:'slide',
		layout: [{media :{word:'is'}}]
	},
	{
		inherit:'slide',
		layout: [{media :{word:'even'}}]
	},
	{
		inherit:'slide',
		layout: [{media :{word:'Cooler!!'}}]
	}
]);
```

Download [here](../../resources/tutorials/js/slideshow2.js). You can see it in action right [here](#{player}../resources/tutorials/js/slideshow2.js).

#### **Defaults**
Lets take this one step further. What if we want to centralize the way stimuli look? Lets use inheritance to control that too:

```js
API.addStimulusSets('default',[
	{css:{fontSize:'2em',color:'#D7685A'}}
]);
```

And the sequence will look like this:

```js
API.addSequence([
	{
		inherit:'slide',
		layout: [{
			inherit:'default',
			media :{word:'This'}
		}]
	}
]);
```

Download [here](../../resources/tutorials/js/slideshow3.js). You can see it in action right [here](#{player}../resources/tutorials/js/slideshow3.js).