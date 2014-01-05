/* global describe, it, before, after */

var expect = require('chai').expect,
    webdriver = require('selenium-webdriver'),
    driver = new webdriver.Builder()
        .usingServer('http://ondemand.saucelabs.com:80/wd/hub')
        .withCapabilities({
          'username': 'project_implicit'
          , 'accessKey': 'a6aa63fe-29fa-464b-b273-303cae01f461'
          , browserName: 'iphone'
          , version: '5.0'
          , platform: 'Mac 10.6'
          , tags: ["examples"]
          , name: "This is an example test"
        })
        .build();

driver.get('http://saucelabs.com/test/guinea-pig');
driver.getTitle().then(function(title){
    expect(title).to.have.string('I am a page title');
});
driver.findElement({id:'submit'}).click();
driver.quit();