'use strict';

let util = {

    nicePath (path) {
        return path.replace(new RegExp('^' + process.env.HOME), '~');
    },

    splitLines (str) {
        return str.split(/[\r\n]+/);
    }

};

module.exports = util;
