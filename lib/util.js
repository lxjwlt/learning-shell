'use strict';

let util = {

    nicePath (path) {
        return path.replace(new RegExp('^' + process.env.HOME), '~');
    },

    splitLines (str) {
        return str.split(/[\r\n]+/);
    },

    addQueryCommand (command, config) {
        Object.keys(config).forEach(function (key) {
            command += ` && echo "\\nsheller:start:${key}:\\n$(${config[key]})\\nsheller:end:${key}\\n"`
        });

        return command;
    },

    parseQueryCommand (output) {
        let lines = util.splitLines(output);
        let map = {};
        let currentMatchKey;
        let clearLines = [];

        lines.forEach(function (line) {
            let startMatch = line.match(/^sheller:start:(\S+):/);

            if (startMatch) {
                currentMatchKey = startMatch[1];
                map[currentMatchKey] = [];
                return;
            }

            let endMatch = line.match(/^sheller:end:(\S+)/);

            if (endMatch) {
                currentMatchKey = null;
                return;
            }

            if (currentMatchKey) {
                map[currentMatchKey].push(line);
            } else {
                clearLines.push(line);
            }
        });

        return {
            map: map,
            clearLines: clearLines
        };
    },

    centerBanner: function (frontTail, centerText, endTail, len) {
        let spaceLen = (len - frontTail.length - centerText.length - endTail.length) / 2;

        return frontTail +
            ' '.repeat(Math.ceil(spaceLen)) + centerText +
            ' '.repeat(Math.floor(spaceLen)) + endTail;
    }

};

module.exports = util;
