'use strict';

const random = require('../lib/random');

module.exports = function () {
    return [
        {
            title: 'working directory',
            info: 'print name of current working directory',
            tips: 'man pwd',
            validate (command) {
                return command === 'pwd';
            }
        },
        {
            title: 'change directory',
            data: function () {
                return {
                    path: random.one(
                        random.randomExistPath(),
                        'last path',
                        'your home directory'
                    )
                };
            },
            info: function (data) {
                return `Change your directory to ${data.path}`;
            },
            validate: function (command, cwd, data) {
                let targetPath = data.path;

                if (targetPath === 'your home directory') {
                    return cwd === process.env.HOME;
                }

                if (targetPath === 'last path') {
                    return command === 'cd -';
                }

                return cwd === targetPath;
            }
        }
    ];
};
