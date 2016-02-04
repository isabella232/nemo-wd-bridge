'use strict';

var wd = require('wd');
var UrlLib = require('url');
//it was my desire to use the module below, but its broken. Submitted a PR, if accepted, will revert to using wd-bridge
//var WDB = require('wd-bridge');

module.exports = {
    'setup': function (nemo, callback) {
        var wdb = WDB(nemo.wd, wd);
        var builder = new nemo.wd.Builder();
        var builders = nemo._config.get('driver:builders');
        if (builders !== undefined) {
            Object.keys(builders).forEach(function (bldr) {
                builder = builder[bldr].apply(builder, builders[bldr]);
            });
        }
        wdb(builder, nemo.driver)
            .then(function (wdDriver) {
                nemo.wdb = wdDriver;
                callback(null);
            });

    }
};
var WDB = function (externalLib, wd) {
    var Q = wd.Q;
    return function (builder, driver) {
        var seleniumWebdriver = externalLib;
        var deferred = Q.defer();
        var url = UrlLib.parse(builder.getServerUrl() ||
            'http://localhost:4444/wd/hub');
        var caps = builder.getCapabilities();
        if (caps && caps.get('username') && caps.get('accessKey')) {
            url.auth = caps.get('username') + ':' + caps.get('accessKey');
        }
        var wdDriver = wd.promiseChainRemote(url);
        wdDriver.wdEl = function (el) {
            // converting from selenium-webdriver to wd
            return wdDriver.chain().then(function() {
                return el.getId().then(function (id) {
                    return wdDriver.newElement(id.ELEMENT);
                });
            });
        };
        wdDriver.swEl = function (el) {
            // converting from wd to selenium-webdriver
            return wdDriver.chain()
                .then(function () {
                    return el.toWireValue().then(function (wireValue) {
                        return new seleniumWebdriver.WebElement(driver, {ELEMENT: wireValue.ELEMENT});
                    });
                });
        };
        driver.getSession().then(function (session) {
            wdDriver.attach(session.getId(), function (err, caps) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(wdDriver);
            });

        });
        return deferred.promise;
    };
};
