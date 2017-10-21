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
        }
    ];
};
