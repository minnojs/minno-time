# Project Implicit Player (PIP)

PI Player builds and runs experiments with time-sensitive tasks over the Internet. It is written in JavaScript and is built to be extremely versatile and customizable.
The scripts for the player are written as JavaScript objects. This format allows, writing simple and straightforward scripts using a constrained scripting language. The format also allows advanced users to easily create complex and dynamic scripts using in-line JavaScript.

### Central Concepts
The player treats each task as a **sequence** of **trials**.

**Trials** do three things:

* Control stimuli presentation
* Evaluate user responses
* Respond to user responses (give feedback, hide a stimulus, finish trial etc.)

Trials are implemented with a **Trial** object. The Trial object is responsible for anything that 'happens' in the trial (e.g., presentation of stimuli). The trial object uses several other objects, the most important of them are the **Stimulus** and the **Media** objects. **Media** objects are responsible for what we show the user (text, images or any other form of media). **Stimuli** objects are the how for the what of the media objects - they control the size, location etc. of their respective media. Each stimulus has one Media object. A Trial object may have multiple stimulus objects.

Trials, Stimuli and Media are the main building blocks of your task. Often, you will want to group them into **Sets**. The Sets are used to organize and randomize their members.

There cannot be more than one trial at a time, and each trial can change just about anything in the player's behavior. The player supports a powerful system for the generation and randomization of trial **sequences**.

* Trials within a sequence may be duplicated, reordered and randomly selected.
* Trials can be created by inheriting some features from another trial.
* Trials may be randomly selected from custom lists (sets).

### Creating a Task

When creating a task you first create your building blocks. You create prototypes for each trial type you intend to use and create sets of stimuli for later use. Next, you drop the building blocks into the sequence; at this stage you decide on the global structure of your task and create the exact randomization that you want.

Once your script is ready all you have to do is to call it from within the player index page.

### Collecting the data
All the data that is recorded by the player is sent to a URL of your choosing. Tasks may vary greatly so we give you the flexibility to send whatever data you need and process it however you see fit.