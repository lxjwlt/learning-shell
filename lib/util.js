'use strict';

const parse = require('yargs-parser');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const {execSync} = require('child_process');

let util = {

    nicePath (path) {
        return path.replace(new RegExp('^' + process.env.HOME), '~');
    },

    formNicePath (path) {
        if (path === '~') {
            return process.env.HOME;
        }

        return path.replace(/^~(?=\/)/, process.env.HOME);
    },

    splitLines (str) {
        return str.split(/[\r\n]+/);
    },

    addQueryCommand (command, config) {
        let cmd = [command];

        Object.keys(config).forEach(function (key) {
            cmd.push(`echo "\\nsheller:start:${key}:\\n$(${config[key]})\\nsheller:end:${key}\\n"`);
        });

        return cmd.join(';');
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
    },

    /**
     * parse command
     * @param {string} command
     * @returns {{words: [], options: {}, longOptions: {}, shortOptions: {}}}
     */
    parseCommand: function (command) {
        let baseConfig = {
            'camel-case-expansion': false,
            'duplicate-arguments-array': false,
            'boolean-negation': false,
            'dot-notation': false,
            'parse-numbers': true
        };

        let longOptions = parse(command, {
            configuration: Object.assign({}, baseConfig, {
                'short-option-groups': true
            })
        });

        let shortOptions = parse(command, {
            configuration: Object.assign({}, baseConfig, {
                'short-option-groups': false
            })
        });

        return {
            words: longOptions._,
            options: Object.assign({}, shortOptions, longOptions),
            longOptions: longOptions,
            shortOptions: shortOptions
        };
    },

    canRead (filename) {
        let result = true;

        try {
            fs.accessSync(filename, fs.constants.R_OK);
        } catch (e) {
            result = false;
        }

        return result;
    },

    canWrite (filename) {
        let result = true;

        try {
            fs.accessSync(filename, fs.constants.W_OK);
        } catch (e) {
            result = false;
        }

        return result;
    },

    canExecute (filename) {
        let result = true;

        try {
            fs.accessSync(filename, fs.constants.X_OK);
        } catch (e) {
            result = false;
        }

        return result;
    },

    createTempFile (filename) {
        let tempDir = path.resolve(os.homedir(), '.sheller');

        if (!fs.existsSync(tempDir)) {
            fs.ensureDirSync(tempDir);
        }

        let filePath = path.resolve(tempDir, filename);

        fs.removeSync(filePath);

        fs.ensureFileSync(filePath);

        return filePath;
    },

    getAllUsers () {
        let logs = execSync('cut -d: -f1 -f3 /etc/passwd').toString().split(/\n/g);

        return logs.filter((line) => {
            return !line.match(/^(?:#|_)/) && !line.match(/\./) && line;
        }).reduce((map, line) => {
            let arr = line.trim().split(':');

            map[arr[1]] = arr[0];

            return map;
        }, {});
    },

    getAllGroups () {
        let logs = execSync('cut -d: -f1 -f3 /etc/group').toString().split(/\n/g);

        return logs.filter((line) => {
            return !line.match(/^(?:#|_)/) && !line.match(/\./) && line;
        }).reduce((map, line) => {
            let arr = line.trim().split(':');

            map[arr[1]] = arr[0];

            return map;
        }, {});
    },

    getUid (name) {
        try {
            return Number(execSync(`id -u ${name}`).toString());
        } catch (e) {}
    },

    getGid (name) {
        let arr = Object.entries(util.getAllGroups()).filter((item) => {
            return item[1] === name;
        })[0];

        return arr && Number(arr[0]);
    }

};

module.exports = util;
