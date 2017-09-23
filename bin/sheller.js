#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const vorpal = require('vorpal')();
const util = require('../lib/util');
// const version = require('../package.json').version;
const cachePath = path.resolve(process.env.HOME, '.sheller');
const {execSync} = require('child_process');
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

vorpal.delimiter(
    [
        `Sheller ${status.getTaskName()}<${status.getStatusText()}>`,
        `${util.nicePath()} $ `
    ].join('\n')
);

vorpal
    .catch('[words...]')
    .allowUnknownOptions()
    .parse(function (command) {
        try {
            execSync(command, {stdio: 'inherit'});
        } catch (e) {}

        return command;
    })
    .action((args, cd) => {
        cd();
    });

vorpal.show();
