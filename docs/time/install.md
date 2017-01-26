# Install

The Minno player is an open source project and its source code is available on [Github](https://github.com/ProjectImplicit/miTimelayer). You may use it freely under the terms of the license. This page will explain the basics of getting the player to work.

### Local installation

The player comes with a simple server that allows you to run it from your local machine. This server includes this tutorial, and lets you easily create and test tasks of your own. It does *not* save the data gathered from the player (but see the [next section](#public-installation) about that).

In order to install the player localy you have to install [Node.js](http://nodejs.org/). **Node.js** is a software platform for server-side and network applications. It is currently used by a number of large companies including LinkedIn, Microsoft, Yahoo!, Walmart and PayPal. And can be run off any of the popular operating systems.

#### Installing:
* Download and install [Node.js](http://nodejs.org/).
* Download the player from [Github](https://github.com/ProjectImplicit/miTimelayer/archive/master.zip).
* Unzip the player into the directory of your choice.
* Open a terminal (a text interface):
	* On Windows, click the Start button, select All Programs, click Accessories, and then click Command Prompt.
	* On Mac, click Finder, select Applications, then choose utilities and Double click on terminal.
	* On Ubuntu you can click ctrl+alt+T.
* Browse to the folder were you downloaded the player.
* Insert the following commands into the terminal: (You should see a long list of responses after each of these - it may take a few minutes...)
	* `npm install`
	* `npm build`
* When these commands have gone through - thats it, you've installed the player.

If you have a git client then you may want to clone Minno directly instead of downloading it:

```bash
git clone https://github.com/ProjectImplicit/miTimelayer .
```
#### Activating
Once you have installed the player, each time you want to activate the player all you have to do is run the following command: `npm start` from the player directory.

You will find that a browser window opens with the tutorials site, only this time from your local machine.

Beside serving the player and the tutorials, the local server gives you an easy interface for working with your local files. You will find a directory named `user` in your player directory. It starts out with a copy of each of the files used in the tutorials (you can freely delete them if you like), and you can add any files that you like to that.

You will notice a new tab in the navigation bar on the top: **Your Files**. This tab gives you access to a directory listing of all the scripts within your `user` directory. You will be able to see a list of any syntax errors that you may have within your files as well as the buttons allowing you to view the file or downlad it.

### Public installation

The back-end for recording the player data is not open source yet (if you want to write a back-end, thats great! we'd love to cooperate).

If you want to use the player within you own application you should use the files within `dist` and fit `index.html` to your needs. The idea is that the inner `require` takes the URL to your script (relative to the js folder - so it may be easier for you to give it absolute URLs).

```javascript
require(['js/config'], function() {
	require(['path/to/your/script']);
});
```

Integrating the player into a back-end requires the server side to parse and store the player's logs. (See [API](./API.html#logging)).
