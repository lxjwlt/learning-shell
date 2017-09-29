'use strict';

const randomUtil = require('../lib/random');
const {random} = require('data-seed');

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
            info: function () {
                random.one();

                return [
                    'Change your directory to {{path}}',
                    {
                        path: random.one(
                            randomUtil.randomExistPath(),
                            'last path',
                            'your home directory'
                        )
                    }
                ];
            },
            validate: function (command, log, info) {
                let infoPath = info[1].path;

                if (infoPath === 'your home directory') {
                    return process.cwd() === process.env.HOME;
                }

                if (infoPath === 'last path') {
                    return command === 'cd -';
                }

                return process.cwd() === info[1].path;
            }
        }
    ];
};
