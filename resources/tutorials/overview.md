# Project Implicit Player (PIP)

PI Player builds and runs experiments with time-sensitive tasks over the Internet. It is written in JavaScript and is built to be extremely versatile and customizable.
Researchers can program their own studies by writing scripts in a language that PIP can understand. Those scripts are written as JavaScript objects. This format allows writing simple and straightforward scripts using a constrained scripting language. The format also allows advanced users to easily create complex and dynamic scripts using in-line JavaScript.

### Central Concepts
The player treats each task as a **sequence** of **trials**.

**Trials** do three things:

* Control stimuli presentation
* Evaluate user responses
* Respond to user responses (give feedback, hide a stimulus, finish trial, etc.)

Trials are implemented with a **Trial** object. The Trial object is responsible for anything that 'happens' in the trial (e.g., presentation of stimuli). The trial object uses several other objects, the most important of them are the **Stimulus** and the **Media** objects. **Media** objects are responsible for what we show the user (text, images or any other form of media). **Stimuli** objects are responsible for how we show the media objects. For instance, the **Stimulus** objects controls the size and location of the presentation of a media object. Each stimulus includes one Media object. A Trial object may have multiple stimulus objects (to allow you showing a few different stimuli in the same trial).

Trials, Stimuli and Media are the main building blocks of your task. Often, you will want to group them into **Sets**. The Sets are used to organize and randomize their members.

There cannot be more than one trial at a time, and each trial can change just about anything in the player's behavior. To program a task you need to define the trial **sequences**.

* Trials within a sequence may be duplicated, reordered and randomly selected.
* Trials can be created by inheriting some features from another trial.
* Trials may be randomly selected from custom lists (sets).

### Creating a Task

When creating a task you first create your building blocks. You create prototypes for each trial type you intend to use and create sets of stimuli for later use. Next, you drop the building blocks into the sequence; at this stage you decide on the global structure of your task and create the exact randomization that you want.

Once your script is ready all you have to do is to call it from within the player index page.

### Collecting the data
All the data that is recorded by the player is sent to a URL of your choosing. Tasks may vary greatly so we give you the flexibility to send whatever data you need and process it however you see fit.

### Learn how to use PIP
This was only a short overview of the player. There are many ways to learn how to use it. 
We recommend you first see some examples for code. Start with the [hello world example](hello.md). Then, to understand better the syntax used in that example, read a little about [Javascript objects](javascript.md). Now go back to the [hello world example](hello.md) or continue to the [slideshow example](slideshow.md). 

Next, if you can, download and [install](install.md) a local version of a server that can run PIP scripts. When you launch that server it will take to the page you're reading right now. 
We recommend that you next read and experience our Stroop tutorial, which will take you from [setup](stroop-setup.md) to the [complete task](stroop-task.md) is a few steps. 

While reading the Stroop tutorial, we recommend that you slowly improve your own [mystroop.js file](js/mystroop.js), and create your own version of each of the scripts you'll see throughout that tutorial. 
