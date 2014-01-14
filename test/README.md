# Test harness

## Install and activate

The pip testing harness relies on [Grunt](http://gruntjs.com/) and on [Selenium webserver](http://docs.seleniumhq.org/).

In order to run the tests you must have access to a Selenium server. We currently support two types of servers; a local server, and a sauce-connect server.
Following are instructions how to set up either of them.

### Local Selenium server

The local Selenium server allows you to run the automated tests localy on your computer

In order to activate a local Selenium server you must:

1. Download the latest **selenium-server-standalone** `jar` file from the [selenium site](https://code.google.com/p/selenium/downloads/list).
2. Open a command prompt.
3. Go to the server directory and start the server:

		java -jar selenium-server-standalone-2.x.x.jar -port 4444

	Note that you should replace `2.x.x` with your current version of the server.

4. When you see "connected", you are ready to go!
5. Run your tests:

		grunt test:local

6. You may edit the settings for the test (including browser types) from within `Gruntfile.js`.

### Sauce-connect server

The Sauce-connect server allows you to use the browsers on [Saucelabs](http://saucelabs.com/) in order to test your local files.

In order to activate it you need to:

1. [Download](https://saucelabs.com/docs/connect) the latest connect server, and unzip.
2. Open a command prompt.
3. Go to the server directory and start Connect:

		java -jar Sauce-Connect.jar YOUR-SAUCE-USERNAME YOUR-SAUCE-API-KEY

4. When you see "connected", you are ready to go!
5. In order for the test harness to work correctly you need to set the username and API-key that you got from saucelabs as environment variables. The way this is done differs between different operating systems (You can read more [here](http://superuser.com/a/284351)).

	Windows:

		set SAUCE_USERNAME="YOUR-SAUCE-USERNAME"
		set SAUCE_ACCESS_KEY="YOUR-SAUCE-API-KEY"

	Linux:

		export SAUCE_USERNAME="YOUR-SAUCE-USERNAME"
		export SAUCE_ACCESS_KEY="YOUR-SAUCE-API-KEY"

6. Run your tests:

		grunt test:connect

6. You may edit the settings for the test (including browser types) from within `Gruntfile.js`.

## Grunt task API

The grunt task that activates the tests is a multitask called test. Each subtask takes an object that has several components:

`src`: A grunt style file list with all the tests to be run.

`server`: The url to the webserver (this should be `http://localhost:4444/wd/hub` for a local selenium server, `http://localhost:4445/wd/hub` for sauce-connect and `http://ondemand.saucelabs.com/wd/hub` for a remote sauce server).

`paralel`: Whether to run the tests serialy or in paralel (takes true/false, false by default). Running more than one test at a time on a local machine may cause problems. This is not a problem when using a Saucelabs server.

`browsers`: A list of browser types to use for this test. The three most important properties are `browserName`, `version` and `platform`. For a full overview see [here](http://code.google.com/p/selenium/wiki/DesiredCapabilities).

## Test harness API

Each test must export a function that takes a [WebDriverJs](http://code.google.com/p/selenium/wiki/WebDriverJs) driver. The function may also have an property called options that may hold a test name and tags.

```
module.exports = function(driver){
	// your code here
};

module.exports.options = {
	tags: ['several','test','tags'],
	name: 'my test name'
};
```

The harness is activated from within `test/runner.js`.