/* eslint-env node */
let opts = process.argv.slice(2);
const BINPATH = './node_modules/nightwatch/bin/';

if (opts.indexOf('--config') === -1) opts = opts.concat(['--config', 'e2e/nightwatch.conf.js']);

if (opts.indexOf('--env') === -1) {
    /**
     * If no environment is provided - environment meaning a combination of OS and Browser as
     * defined in the nightwatch.conf.js file - the tests will run on all environments unless
     * one is specified
     */
    const config = require('./nightwatch.conf');
    const envs = Object.keys(config.test_settings).filter(key => key !== 'default').join(',');
    opts = opts.concat(['--env', envs]);
}

function start(){
    const spawn = require('cross-spawn');
    const runner = spawn('node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

    runner.on('exit', function (code) {
        process.exit(code);
    });

    runner.on('error', function (err) {
        throw err;
    });
}


/**
 * selenium-download does exactly what it's name suggests;
 * downloads (or updates) the version of Selenium (& chromedriver)
 * on your localhost where it will be used by Nightwatch.
 /the following code checks for the existence of `selenium.jar` before trying to run our tests.
 */

require('fs').stat(BINPATH + 'selenium.jar', function (err, stat) { // got it?
    if (err || !stat || stat.size < 1) {
        require('selenium-download').ensure(BINPATH, function(error) {
            if (error) throw new Error(error); // no point continuing so exit!
            // eslint-disable-next-line no-console
            console.log('✔ Selenium & Chromedriver downloaded to:', BINPATH);
            start();
        });
    } else start();
});
