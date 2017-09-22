'use strict';

let util = {

    nicePath: function () {
        return __dirname.replace(new RegExp('^' + process.env.HOME), '~');
    }

};

module.exports = util;
