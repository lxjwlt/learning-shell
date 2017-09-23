'use strict';

let util = {

    nicePath () {
        return __dirname.replace(new RegExp('^' + process.env.HOME), '~');
    }

};

module.exports = util;
