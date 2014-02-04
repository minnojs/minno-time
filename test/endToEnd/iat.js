
// give one response
function action(driver){
	// get stimulus
	return driver.executeScript(function(){
		var trial = require('app/trial/current_trial')();
		return (!trial)?
			false
			: {
				stim: trial._stimulus_collection.first().attributes.data,
				id: trial._id
			};
	})
	// make sure stimulus exists and if so respond appropriately
	.then(function(data){
		if (!data){
			return false;
		}

		var key = false;
		var stimData = data.stim;

		if (stimData.handle == 'instructions') {
			key = ' ';
			console.log(stimData);
		} else {
			if (!stimData.side){
				return false;
			}
			key = stimData.side == 'left' ? 'e' : 'i';
		}

		// press correct key
		driver.findElement({tagName:'body'}).sendKeys(key);

		// wait for the next trial (wait for trial_id change...)
		driver.wait(function(){
			return driver.executeScript(function(trial_id){
				return require('app/trial/current_trial')()._id !== trial_id;
			}, data.id);
		});

		return true;
	});
}

// give one response and either progress or end the recursion
function progress(driver){
	action(driver).then(function(ok){
		if (ok){
			progress(driver);
		} else {
			driver.executeScript(function(){
				return window.jsErrors;
			}).then(function(jsErrors){
				console.log(jsErrors);
				if (jsErrors.length){
					//throw new Error('js Errors encountered');
				}
			});

			driver.quit();
		}
	});
}

/*
 *	Run an iat test
 *	@param driver: a selenium driver
 *	@returns : a selenium promise
 */
module.exports = function(driver){
	driver.manage().timeouts().setScriptTimeout(10000);

	// navigate to page
	driver.get('http://localhost/pip/dist/index.html?url=../resources/examples/iat.js')
		.then(function(){
			driver.executeAsyncScript(function(){
				var callback = arguments[arguments.length -1];
				window.jsErrors = [];
				window.onerror = function(errorMessage) {
					window.jsErrors[window.jsErrors.length] = errorMessage;
				};

				// @TODO: move to a "wait" statement, this isn't stable
				require(['js/config'],function(){
					require(['jquery'],function($){
						$( document ).ajaxError(function( event, request, settings ) {
							throw new Error ("Error requesting page: " + settings.url );
						});
					});
					callback.call(null, "jsErrors activated");
				});
			});
		});

	// return a selenium promise
	return driver
		// wait for first trial to be ready
		.wait(function(){
			return driver.executeScript(function(){
				return require.defined('app/trial/current_trial') && typeof require('app/trial/current_trial')() == 'object';
			});
		})
		// start running the test
		.then(function(){
			progress(driver);
		});
};

module.exports.options = {
	tags: ['iat','e2e','test'],
	name: 'IAT end to end test'
};