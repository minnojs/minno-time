/* global module */
var webdriver = require('selenium-webdriver');
var options = {
	paralel: false,
	serverUrl : "http://localhost:4444/wd/hub"
};
var promiseArr = [];

function run(task, browser){

	// set sauce variables
	browser.username = process.env.SAUCE_USERNAME;
	browser.accessKey = process.env.SAUCE_ACCESS_KEY;

	// set task specific data
	browser.tags = task.options.tags;
	browser.name = task.options.name;

	var driver = new webdriver.Builder()
		.usingServer(options.serverUrl)
		.withCapabilities(browser)
		.build();

	driver.manage().timeouts().setScriptTimeout(10000);

	var promise = task(driver);
	promiseArr.push(promise);

	return promise;
}

/*
 *	Run several tasks in paralel
 */
function runParalel(task, browsers){
	// create an array of webdriver promises
	var flows = browsers.map(function(browser) {
		return webdriver.promise.createFlow(function() {
			run(task, browser);
		});
	});

	return webdriver.promise.fullyResolved(flows);
}

function runSeries(task, browsers){
	// create a fulfilled promise in case we don't push any browsers into the stack

	var promise = webdriver.promise.fulfilled();

	browsers.forEach(function(browser){
		// set the new test as the returned promise
		promise = run(task, browser);
	});

	// return the promise from the last task
	return promise;
}

// export the control object
module.exports = {
	run:run,
	runSeries: runSeries,
	runParalel: runParalel,

	setServerUrl: function setServerUrl(url){
		if (typeof url != 'undefined') {
			options.serverUrl = url;
		}
	},

	done: function done(){
		return webdriver.promise.fullyResolved(promiseArr);
	}

};