'use strict';

const packageName = require('../package.json').name;
const vorpal = require('vorpal')();
const localStorage = vorpal.localStorage;

vorpal.localStorage(packageName);

module.exports = {

    get (key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            return;
        }
    },

    set (key, value) {
        if (typeof value === 'undefined') {
            throw(new TypeError('unexpected "value" to be undefined'));
        }
        return localStorage.setItem(key, JSON.stringify(value));
    }

};
