#!/usr/bin/env node

'use strict';

const program = require('commander');


function help () {
    program.parse(process.argv);
    console.log(program.args);
}

help();

console.log('start to check:', program.args);
