'use strict';

const random = require('../lib/random');
const util = require('../lib/util');

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
        }
    ];
};
