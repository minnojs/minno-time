# minno-time

Minno time (miTime) is a module of [MinnoJS](https://minnojs.github.io/).
It runs experiments with time-sensitive tasks over the Internet.
It is written in JavaScript and is built to be extremely versatile and customizable.

A simple use case can be found in this repository in the example directory.
But it is probably easiest to use within the context of [mi-manager](https://github.com/minnojs/minno-quest).
Full documentation can be found at [https://minnojs.github.io/minno-time](https://minnojs.github.io/minno-time).

### Understaning miTime

In order to use miTime effectively you need to understand two systems that are virtually independent.
The first is the trial which controls a single set of interactions between the user and the player.
The second is the sequencer which manages multiple trials, their order and various aspects of randomization.

The `time` module allows researchers to create complex **interactions** for their subjects.
Therefore the first thing that a `time` user needs to understand is how interactions work in the player.

`miTime` is an event driven player. 
The basic starting point for the player is of waiting, it is waiting for an `event` to be triggered.
Events are commonly triggered by users, by pressing a key, or clicking a button, but they can also be triggered by a timer.
Each time an event is triggered the player triggers any actions bound to that event.
So for example, you can bind an action that displays a stimulus to the event triggered when a user presses the *space* key.

When programing a task your main job is to describe these binding between events and actions.
Each binding is called an interaction, and has two parts: conditions and actions.
The conditions of the interaction, are a list of requirements that we impose in order for the actions to be triggered.
Each time an event is triggered the player reviews all interactions and checks if their conditions fit the event triggered and the state of the trial.
They allow you to define the type(s) of events that you want to respond to and define the requirements imposed on the state.
For example, you can define a set of actions to be triggered by "key press" events when the key equals *space*,
that will be activated only when the state indicates that a stimulus has already been displayed.

Actions are changes that affect the state of the player.
They can display or hide stimuli, they can log events and are free to make any custom change needed.
