# nemo-wd-bridge

Nemo plugin to add [wd driver](https://github.com/admc/wd) capability to nemo

## Installation

`$ npm install --save nemo-wd-bridge`

## Registration

In `config.json` or inline config object:

```js
"plugins": {
  "wdb": {
    "module": "nemo-wd-bridge"
  }
},
```

Results in a `wdb` namespace on the nemo object

## Driver Configuration

Because wd requires a webdriver server URL to function, you will need to use one.

Furthermore, you will need to configure the "driver" via the "builders" property as described here:
https://github.com/paypal/nemo/blob/master/README.md#builders-optional

A couple examples of driver configurations follow:

### externally started standalone

```js
{
  "driver": {
    "builders": {
      "withCapabilities": [{
        "browserName": "firefox"
      }],
      "usingServer": ["http://localhost:4444/wd/hub"]
    }
  },
  "plugins": {
    "wdb": {
      "module": "nemo-wd-bridge"
    }
  }
}
```

### Nemo-managed standalone

```js
{
  "driver": {
    "jar": "/Users/medelman/bin/selenium-server-standalone-2.47.1.jar",
    "browser": "firefox",
    "server": "localhost",
    "local": true
  },
  "plugins": {
    "wdb": {
      "module": "nemo-wd-bridge"
    }
  }
}
```

## API

### nemo.wdb

The wd driver object. Will have all methods documented here: https://github.com/admc/wd/blob/master/doc/api.md

### nemo.wdb.swEl

Convert a wd Element to Selenium WebElement

* `@argument el {wd Element}`
* `@returns Promise` resolves to Selenium WebElement: http://selenium.googlecode.com/git/docs/api/javascript/class_webdriver_WebElement.html

### nemo.wdb.wdEl

Convert a Selenium WebElement to wd Element

* `@argument el {selenium WebElement}`
* `@returns Promise` resolves to wd Element



