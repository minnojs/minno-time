# Project Implicit Player (PIP)

The PIP is a time sensitive cognitve psychology experimentat builder for the net.
It is written in JavaScript and is built to be extremely verastile and customizable.


The PIP treats each task as a **sequence** of **trial**s. Trials are consecutive, in that there cannot be more than one trial at a time, and each trial should have the power to change anything in the players’ behavior.
Trials do three things:

* Present a stimulus or stimuli
* Evaluate a response \ responses to the stimuli
* Respond to user input (give feedback, finish trial etc.)

A task is constituted of a **sequence** of trials. The PIP supports a powerfull system for the genration and ranomizing of trial sequences.

* Trials within the sequence may be duplicated, reordered and selected using the powerfull mixing features.
* Trials may inherit their features from custom prototypes.
* Trials may be randomly picked from custom lists (**sets**).
*