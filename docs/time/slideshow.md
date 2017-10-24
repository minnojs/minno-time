# Slide show

This section of the tutorial will walk you through creating a slide show. We will create a simple task that displays a series of stimuli. In this tutorial we will learn how to utilize the sequence, and the very basics of inheritance.

### A simple slide show
Tasks normally include more than one trial. The sequence holds an array: the trials in the array will be activated sequentially.

This is the trial that we already know from the *Hello world* tutorial:

```javascript
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

We will now duplicate this trial a few times for a simple slide show:

```javascript
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

You should try it (don't forget the wrapper, and the activation function at the end (`API.play()`)). Try adding another trial. Try changing the media or style of the stimuli.

Download [here](slideshow1.js). You can see it in action right [here](./slideshow1Play.html).

### Basic inheritance
Our task is becoming longer and harder to maintain. Imagine a slide show with 50 slides, it will need more than 500 lines of code. If we would want to make any changes that apply to all the trials (e.g., increase the font size), we will have to go through each trial individually and make the same change. This is where the concept of inheritance comes in. Inheritance allows you to create a prototype of a trial (or stimulus or media object), and re-use it whenever you want. To understand how this works, we need to first learn a bit about sets.

#### **Sets**
[Set](./API.html#sets) is a list of one or more miTime objects (trials, stimuli or media objects). After defining a set of objects (e.g., trials), we can re-use those objects. Therefore, if we want to create a basic trial and re-use it a few times, we create a one-trial set, and then re-use it in a sequence. We will focus here on trial sets, but everything that applies to the trials sets also applies to stimuli sets or media sets as well.

We create trial sets using the `API.addTrialSets()` function. The simplest use of the function involves two arguments; the first is the set name, and the second is an array of objects to add to the set. The following code creates a trial set called *slide* and populates it with one trial: our "Hello world" trial.

```javascript
API.addTrialSets('slide',[{
	input: [{handle:'space',on:'space'}],
	layout: [{media :{word:'Hello world'}}],
	interactions: [{
		conditions: [{type:'inputEquals',value:'space'}],
		actions: [{type:'endTrial'}]
	}]
}])
```

Now, we can refer to this trial in the future with the name we gave it ('slide'), and re-use it over and over again in a sequence. We re-use trials (and media and stimulus objects) using inheritance.

#### **Inheritance**
Inheritance allows us to re-use trials: new trials can be created by inheriting a trial from a set. If there is only one trial in the set, we simply inherit the whole set.

Trials (and stimuli and media too) have a special property called [inherit](./API.html#inheriting) that allows them to specify a specific set to inherit from. This allows trials to be significantly shorter. The following code activates our slide three times:

```javascript
API.addSequence([ //Our sequence is an array of trials.
	{inherit:'slide'}, //Each object is a trial. 
	{inherit:'slide'},
	{inherit:'slide'}
]);
```
This sequence will present the Hello World trial three times, one after the other.

#### **Extending**
But repeating slides is pretty boring. Our slideshow should display different text in each trial. So, blind inheritance is not enough for, we need also to extend.

When we inherit a trial, we can extend it by simply adding properties or overriding existing ones. Let's call the trial that inherits a `child`, and the trial that is inherited a `parent`. A child inherits all of its parent's properties. Any property that is added to it overrides the parent's properties.

For example, let's say the following object resides in the "parent" set.

```javascript
{
	family: 'Smith'
}
```

Simply inheriting it will result in an identical copy. But we can go one step further and extend it by adding an additional property; in this case - *name*:

```javascript
{
	inherit:'parent',
	name: 'John'
}
```

This extends the object which becomes:

```javascript
{
	family: 'Smith',
	name: 'John'
}
```

Going back to our example, we can now extend each of the slides to display different text by copying all the basic trial's properties, and only overriding the layout object:

```javascript
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

Download [here](slideshow2.js). You can see it in action right [here](slideshow2Play.html).

#### **Defaults**
Let's take this one step further. What if we want to centralize the way stimuli look? Let's use inheritance to control that too. First, we create the basic stimulus (we'll call it 'default'):

```javascript
API.addStimulusSets('default',[
	{css:{fontSize:'2em',color:'#D7685A'}}
]);
```

Then, when we create the stimulus object for the layout in each trial, that stimulus can inherit from our 'default' stimulus:

```javascript
API.addSequence([
	{
		inherit:'slide', //Inherit the slide trial.
		layout: [{ //override the layout object of the slide trial.
			inherit:'default', //Inherit the default stimulus.
			media :{word:'This'} //Add a media to the default stimulus.
		}]
	}
]);
```
Download the slideshow example [here](slideshow3.js). You can see it in action right [here](slideshow3Play.html).

Note that the default stimulus had no media. It means that each stimulus that will inherit this stimulus will need to add a media object. We could have done the same thing with a basic slide trial: create a trial without any layout. 
```javascript
API.addTrialSets('slide',[{
	input: [{handle:'space',on:'space'}],
	interactions: [{
		conditions: [{type:'inputEquals',value:'space'}],
		actions: [{type:'endTrial'}]
	}]
}])
```
It means that each trial that will inherit 'slide' will need to add layout stimulus. 

There is much more to learn about inheritance. You will learn about it in the [Stroop](./stroop-setupDocco.html) example.  
For instance, what happens when there are a few different objects in a set? We can use that in order to randomly choose a trial (or a stimulus or a media object). We can put three different trials in a set and then inherit the set in a way that will choose one of those trials [randomly](./stroop-inheritanceDocco.html). 
You can also try to learn all that there is to know about inheritance straight from the [API documentation](./API.html#inheritance).

