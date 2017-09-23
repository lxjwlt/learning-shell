#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const vorpal = require('vorpal')();
const util = require('../lib/util');
// const version = require('../package.json').version;
const cachePath = path.resolve(process.env.HOME, '.sheller');
const {exec} = require('child_process');
const status = require('../lib/status');

if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
}

console.clear();

[
    '#'.repeat(80),
    '#' + ' '.repeat(35) + 'sheller' + ' '.repeat(36) + '#',
    '#'.repeat(80)
].forEach((text) => console.log(text));

status.newTask(1);

let currentCommand;
let cwd = process.cwd();

vorpal.delimiter(
    [
        `Sheller ${status.getTaskName()}<${status.getStatusText()}>`,
        `${util.nicePath(cwd)} $ `
    ].join('\n')
);

function updateDelimiter () {
    vorpal.delimiter(
        [
            `Sheller ${status.getTaskName()}<${status.getStatusText()}>`,
            `${util.nicePath(cwd)} $ `
        ].join('\n')
    );
}

updateDelimiter();

vorpal
    .catch('[words...]')
    .allowUnknownOptions()
    .parse(function (command) {
        currentCommand = command;
        return command;
    })
    .action((args, cb) => {
        exec(currentCommand + ' && echo "sheller-cwd:$PWD"', {cwd: cwd}, (err, stdout, stderr) => {

            if (stdout) {
                stdout = util.splitLines(stdout).filter((line) => {
                    if (line.indexOf('sheller-cwd:') === 0) {
                        cwd = line.replace('sheller-cwd:', '');
                        return false;
                    }
                    return true;
                }).join('\n');

                vorpal.log(stdout);
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
