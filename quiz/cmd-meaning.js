'use strict';

const random = require('../lib/random');

module.exports = function () {
    return [
        {
            title: 'meaning of command',
            data () {

                let map = {
                    'mkdir test && cd $_': 'make a directory named "test" and change working path to it.',
                    'cd ~root': 'change working directory to home directory of "root" user',
                    'id root': 'return identity of "root" user'
                };

                return {
                    map: map,
                    command: random.array(Object.keys(map))
                };
            },
            prompt (data) {
                let othersCommand = Object.keys(data.map)
                    .filter((command) => command !== data.command);

                othersCommand = random.pick(othersCommand, 4);

                let finalCommand = [data.command].concat(othersCommand);

                random.rearrange(finalCommand);

                return {
                    type: 'list',
                    name: 'meaning',
                    message: [
                        'what\'s meaning of follow command?',
                        `> ${data.command}`
                    ].join('\n'),
                    choices: finalCommand.map((command) => {
                        return {
                            name: data.map[command],
                            value: data.map[command]
                        };
                    })
                }
            },
            info (data) {
                return `what\'s meaning of this command: ${data.command}`;
            },
            validate ({prompt, data}) {
                return prompt.meaning === data.map[data.command];
            }
        }
    ];
};
