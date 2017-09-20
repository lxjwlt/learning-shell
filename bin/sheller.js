#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const program = require('commander');
const version = require('../package.json').version;
const cachePath = path.resolve(process.env.HOME, '.sheller');

if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
}

if (!process.argv.slice(2).length) {
    [
        '#'.repeat(80),
        '#' + ' '.repeat(35) + 'sheller' + ' '.repeat(36) + '#',
        '#'.repeat(80)
    ].forEach((text) => console.log(text));

    process.exit(0);
}

program
    .version(version)
    .command('check', 'check your work')
    .command('replay', 'replay your current task')
    .command('reset', 'reset all work progress')
    .parse(process.argv);
