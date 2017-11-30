## lifecycle

The life cycle of the player is composed of three stage:

The [setup stage](./app/setup.js), where we create and setup the canvas as well as the global variables etc.
Then we [preload](./app/preloadPhase.js) neccessary media (images and tempaltes) and if neccessary display a progress bar.
Then we [play](./app/playPhase) the sequence.

Finally we dispose of the canvas and defer control to the runner (probably [minno-manager](https://github.com/minnojs/minno-quest)).
