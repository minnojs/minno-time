# Project Implicit Player (PIP)

The PIP is a time sensitive, cognitive psychology, experiment builder for the Internet.
It is written in JavaScript and is built to be extremely versatile and customizable.

The scripts for the PIP are written as JavaScript objects.
This format allows, on one hand, the writing of simple and straightforward scripts using a constrained scripting language.
And on the other hand, allows advanced users to easily create extremely complex and dynamic scripts using in-line JavaScript.

### Central Concepts
The PIP treats each task as a **sequence** of **trials**.

**Trials** do three things:

* Control stimuli presentation
* Evaluate user responses
* Respond to user responses (give feedback, finish trial etc.)

The PIP treats each trial as composed of three types of objects. **Trial** objects are the frame for the trial, and are responsible for anything that 'happens' in the trial. **Media** objects are responsible for *what* we show the user - be it text, images or any other form of media. **Stimuli** objects are the *how* for the *what* of the media objects - they control the size, location etc. of their respective media. Each Stimuli has to have exactly one Media, but the Trials may have multiple stimuli.
These objects (Trials, Stimuli and Media) that are the building blocks of your task may be grouped into **Sets**. The Sets are used to organize and randomize their members.

The PIP supports a powerful system for the generation and randomization of trial **sequences**.
Trials are consecutive, in that there cannot be more than one trial at a time, and each trial has the power to change just about anything in the players' behavior (It is possible to jump between trials though).

* Trials within a sequence may be duplicated, reordered and selected using powerful mixing tools.
* Trials may inherit their features from custom prototypes.
* Trials may be randomly picked from custom lists (**sets**).


### Creating a Task

When creating a task you first create your building blocks. You create prototypes for each trial type you intend to use and create sets of stimuli for later use.
Next, you drop the building blocks into the sequence; at this stage you decide on the global structure of your task and create the exact randomization that you want.

Once your script is ready all you have to do is to call it from within the PIP index page.

### Collecting the data
All the data that is gathered by the PIP is sent to a URL of your choosing. Tasks may vary greatly so we give you the flexibility to send whatever data you need and process it however you see fit.