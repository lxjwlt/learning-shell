#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const vorpal = require('vorpal')();
const util = require('../lib/util');
const chalk = require('chalk');
const version = require('../package.json').version;
const cachePath = path.resolve(process.env.HOME, '.sheller');
const {exec} = require('child_process');
const status = require('../lib/status');
const {quizList} = require('../lib/quiz');

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
            chalk.blue(util.nicePath(cwd)) +
            ` - [${chalk.cyanBright('sheller')} ${status.getTaskName()}]`,
            `$ `
        ].join('\n')
    );
}

updateDelimiter();

vorpal.history('sheller');

vorpal
    .command('list', 'list all quiz to select')
    .action(function (args, cb) {
        return this.prompt({
            type: 'list',
            name: 'quizId',
            message: 'Which quiz do you want to practice？',
            choices: quizList.map((quiz, i) => {

                return {
                    name: `${i + 1}.${quiz.title}`,
                    value: quiz.id
                };
            })
        }, function(result){
            vorpal.log(result.quizId); // todo pick quiz
            cb();
        });
    });

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
