#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const vorpal = require('vorpal')();
const util = require('../lib/util');
const version = require('../package.json').version;
const cachePath = path.resolve(process.env.HOME, '.sheller');
const {exec} = require('child_process');
const status = require('../lib/status');

if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
}

console.clear();

[
    '#'.repeat(80),
    util.centerBanner('#', `sheller v${version}`, '#', 80),
    '#'.repeat(80)
].forEach((text) => console.log(text));

status.newTask(1);

let currentCommand;
let cwd = process.cwd();
let env = '';

function updateDelimiter () {
    vorpal.delimiter(
        [
            `Sheller ${status.getTaskName()}<${status.getStatusText()}>`,
            `${util.nicePath(cwd)} $ `
        ].join('\n')
    );
}

updateDelimiter();

vorpal.history('sheller');

vorpal
    .catch('[words...]')
    .allowUnknownOptions()
    .parse(function (command) {
        currentCommand = command;
        return command;
    })
    .action((args, cb) => {

        var command = util.addQueryCommand(currentCommand, {
            cwd: 'PWD',
            env: 'env'
        });

        exec(env + command, {cwd: cwd}, (err, stdout, stderr) => {

            if (stdout) {
                let info = util.parseQueryCommand(stdout);

                cwd = info.map.cwd[0];

                env = info.map.env.join('&&') + '&&';

                vorpal.log(info.clearLines.join('\n'));
            }

            if (stderr) {
                vorpal.log(stderr);
            }

            updateDelimiter();

            cb();
        });
    });

process.on('exit', () => status.save());

vorpal.show();
