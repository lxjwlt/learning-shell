'use strict';

const packageName = require('../package.json').name;
const vorpal = require('vorpal')();
const localStorage = vorpal.localStorage;

vorpal.localStorage(packageName);

module.exports = {

    get (key) {
        return localStorage.getItem(key);
    },

    set (key, value) {
        return localStorage.setItem(key, value);
    }

};
