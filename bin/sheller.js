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

let currentCommand;
let cwd = process.cwd();
let env = '';

function updateDelimiter () {
    let info = status.quiz ?
        `${chalk.cyanBright('sheller')} [${status.getTaskName()}] ${status.quiz.info}` : '';

    vorpal.delimiter(
        [
            info,
            chalk.blue(util.nicePath(cwd)),
            `$ `
        ].join('\n')
    );
}

updateDelimiter();

vorpal.history('sheller');

vorpal
    .command('list', 'list all quiz to select')
    .action(function (args, cb) {
        let commandInstance = this;
        commandInstance.prompt({
            type: 'list',
            name: 'quizId',
            message: 'Which quiz do you want to practice？',
            choices: quizList.map((quiz, i) => {

                return {
                    name: `${i + 1}.${quiz.title}`,
                    value: quiz.id
                };
            })
        }, function (result) {
            status.startQuiz(result.quizId);

            if (status.quiz.prompt) {
                commandInstance.prompt(status.quiz.prompt, function (result) {
                    validateQuiz({
                        prompt: result
                    });
                    cb();
                });
            } else {
                cb();
            }
        });
    });

vorpal
    .command('quit', 'quit current quiz')
    .action(function (args, cb) {

        status.quitQuiz();

        cb();
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
            let info;

            if (stdout) {
                info = util.parseQueryCommand(stdout);

                cwd = info.map.cwd[0];

                env = info.map.env.join('&&') + '&&';

                vorpal.log(info.clearLines.join('\n'));
            }

            if (stderr) {
                vorpal.log(stderr);
            }

            validateQuiz({
                logs: info && info.clearLines,
                args: args
            });

            cb();
        });
    });

vorpal.on('client_command_executed', () => {
    console.log('');
    updateDelimiter();
});

process.on('exit', () => status.save());

function validateQuiz (data) {
    if (status.quiz) {
        let valid = status.validate(Object.assign({
            cmd: currentCommand,
            cwd: cwd
        }, data));

        if (valid.length) {
            vorpal.log([].concat(valid).join('\n'));
        }

        if (valid === true) {
            vorpal.log(chalk.green('quiz passed!'));
        } else {
            vorpal.log(chalk.red('wrong, please try again!'));
        }
    }
}

vorpal.show();
