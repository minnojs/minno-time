/* eslint-env node */
let opts = process.argv.slice(2);
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

const spawn = require('cross-spawn');
const runner = spawn('node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

runner.on('exit', function (code) {
    process.exit(code);
});

runner.on('error', function (err) {
    throw err;
});
