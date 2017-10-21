'use strict';

const random = require('../lib/random');
const util = require('../lib/util');
const fs = require('fs-extra');

module.exports = function () {
    return [
        {
            title: 'your permission',
            data: function () {
                let randomMap = random.randomExistPath();

                return {
                    type: random.one('read', 'execute', 'write'),
                    path: random.array(
                        randomMap.directories.concat(randomMap.files)
                    )
                };
            },
            info: function (data) {
                return `can you ${data.type} ${data.path}?`;
            },
            prompt (data, info) {
                return {
                    type: 'confirm',
                    name: 'confirm',
                    message: info
                };
            },
            validate: function ({data, prompt}) {
                if (data.type === 'read') {
                    return util.canRead(data.path) === prompt.confirm;
                }

                if (data.type === 'execute') {
                    return util.canExecute(data.path) === prompt.confirm;
                }

                if (data.type === 'write') {
                    return util.canWrite(data.path) === prompt.confirm;
                }
            }
        },
        {
            title: 'Change file mode',
            data: function () {
                let tempFile = util.createTempFile('test');
                let isAdd = random.one(true, false);

                fs.chmodSync(tempFile, isAdd ? 0 : '777');

                return {
                    file: tempFile,
                    type: random.pick(['write', 'read', 'execute'], random.int(1, 3)),
                    add: isAdd,
                    role: random.pick(['owner', 'group', 'others'], random.int(1, 3))
                };
            },
            info: function (data) {
                let operator = data.add ? 'adding' : 'removing';
                let operatorJoiner = data.add ? 'for' : 'from';

                let type = data.type.length < 3 ? data.type.join(' and ') : 'all';

                let role = data.role.length < 3 ? data.role.join(' and ') : 'everyone';

                return `set file mode of "${data.file}" by ${operator} ${type} permission ${operatorJoiner} ${role}`;
            },
            validate: function ({data}) {

                let map = {
                    owner: {
                        read: fs.constants.S_IRUSR,
                        write: fs.constants.S_IWUSR,
                        execute: fs.constants.S_IXUSR
                    },
                    group: {
                        read: fs.constants.S_IRGRP,
                        write: fs.constants.S_IWGRP,
                        execute: fs.constants.S_IXGRP
                    },
                    others: {
                        read: fs.constants.S_IROTH,
                        write: fs.constants.S_IWOTH,
                        execute: fs.constants.S_IXOTH
                    }
                };

                let stats = fs.statSync(data.file);

                for (let role of data.role) {
                    for (let type of data.type) {
                        let checkMode = stats.mode | map[role][type];
                        if ((checkMode === stats.mode) !== data.add) {
                            return false;
                        }
                    }
                }

                return true;
            },
            destroy (data) {
                if (data.file) {
                    fs.removeSync(data.file);
                }
            }
        },
        {
            title: 'calculate permission',
            data: function () {

                function createFileMode () {
                    return 'rwx'.repeat(3).split('').map((value) => random.one(value, '-')).join('');
                }

                function parseFileModeToDigit (mode) {
                    return parseInt(
                        mode.split('').map((value) => value !== '-' ? 1 : 0).join(''),
                        2
                    ).toString(8)
                }

                let mode = createFileMode();

                let digit = parseFileModeToDigit(mode);

                let isChooseDigit = random.one(true, false);

                let choices, answer, target;

                if (isChooseDigit) {
                    target = mode;
                    answer = digit;
                    choices = Array.from(Array(2)).map(() =>
                        random.int(0, parseInt('777', 8)).toString(8));
                } else {
                    target = digit;
                    answer = mode;
                    choices = [createFileMode(), createFileMode()];
                }

                choices.push(answer);

                choices.sort(() => random.one(1, -1));

                return {
                    isChooseDigit,
                    target,
                    answer,
                    choices
                };
            },
            info: function (data) {
                let targetName = data.isChooseDigit ? 'file mode' : 'Octal digits';
                let chooseName = data.isChooseDigit ? 'Octal digits' : 'file mode';

                return `choose the right ${chooseName} of ${targetName} ${data.target}`;
            },
            prompt (data, info) {
                return {
                    type: 'list',
                    name: 'answer',
                    message: info,
                    choices: data.choices.map((value) => ({
                        name: value,
                        value: value
                    }))
                };
            },
            validate: function ({data, prompt}) {
                return prompt.answer === data.answer;
            }
        }
    ];
};
