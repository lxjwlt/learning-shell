'use strict';

const random = require('../lib/random');
const util = require('../lib/util');

module.exports = function () {
    return [
        {
            title: 'list files or directory',
            data: function () {
                return {
                    includeHiddenFile: random.one(true, false),
                    paths: random.pick([
                        random.randomExistPath(),
                        random.randomExistPath(),
                        'current directory'
                    ], random.chance({
                        3: 2,
                        7: 1
                    }))
                };
            },
            info: function (data) {
                let hiddenTail = (data.includeHiddenFile ? 'include' : 'exclude') + ' hidden files';

                if (data.includeHiddenFile === null) {
                    hiddenTail = '';
                }

                return `List all files under ${data.paths.join(' and ')} directory ${hiddenTail}`;
            },
            validate: function ({cmd, data, args}) {
                if (args.words[0] !== 'ls') {
                    return false;
                }

                if (data.includeHiddenFile === true && !args.options.a) {
                    return false;
                }

                if (data.includeHiddenFile === false && args.options.a) {
                    return false;
                }

                let cmds = cmd.split(/\s+/g).map(util.nicePath);

                if (data.paths.some((p) => p !== 'current directory' && cmds.indexOf(util.nicePath(p)) < 0)) {
                    return false;
                }

                return true;
            }
        }
    ];
};
