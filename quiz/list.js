'use strict';

const random = require('../lib/random');
const util = require('../lib/util');
const path = require('path');

module.exports = function () {
    return [
        {
            title: 'list files or directory',
            data: function () {
                let dirs = random.randomExistPath().directories;

                return {
                    includeHiddenFile: random.one(true, false, null),
                    includeInfo: random.one(true, false),
                    paths: random.pick(random.pick(dirs, 2).concat(
                        'current directory'
                    ), random.chance({
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

                let infoStr = '';

                if (data.includeInfo) {
                    infoStr = ' and their details';
                }

                return `List all files${infoStr} under ${data.paths.join(' and ')} directory ${hiddenTail}`;
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

                if (data.includeInfo && !args.options.l) {
                    return false;
                }

                let cmds = cmd.split(/\s+/g).map(util.nicePath);

                if (data.paths.some((p) => p !== 'current directory' && cmds.indexOf(util.nicePath(p)) < 0)) {
                    return false;
                }

                return true;
            }
        },
        {
            title: 'find out directories',
            data: function () {
                let dirs = random.randomExistPath().directories;

                return {
                    // todo list only hidden directories
                    path: random.one(
                        random.array(dirs), 'current'
                    )
                };
            },
            info: function (data) {
                return `List all directories under ${data.path} directory`;
            },
            validate: function ({cmd, data, args, cwd}) {

                let targetPath = data.path === 'current' ? cwd : data.path;

                if (args.words[0] === 'find') {
                    if (args.options.maxdepth !== 1) {
                        return false;
                    }

                    if (args.options.type !== 'd') {
                        return false;
                    }

                    let cmdPath = path.resolve(cwd, util.formNicePath(args.words[1]));

                    return cmdPath === targetPath;
                } else if (args.words[0] === 'ls') {
                    if (!args.options.d) {
                        return false;
                    }

                    let isMatch = false;

                    for (let word of cmd.split(/\s+/g)) {
                        let relativePath = '.';
                        let match = word.match(/^([^*]+)?\.\*\/$/);

                        if (match) {
                            relativePath = match[1] || '.';
                            isMatch = path.resolve(util.formNicePath(relativePath)) === targetPath;

                            if (isMatch) {
                                break;
                            }
                        }

                        match = word.match(/^([^*]+)?\*\/$/);

                        if (match) {
                            relativePath = match[1] || '.';
                            isMatch = path.resolve(util.formNicePath(relativePath)) === targetPath;

                            if (isMatch) {
                                break;
                            }
                        }
                    }

                    return isMatch;
                }

                return false;
            }
        },
        {
            title: 'existence of file or directory',
            data () {
                let randomPathMap = random.randomExistPath();

                let file = random.array(randomPathMap.files);

                let pathInfo = path.parse(file);

                return {
                    realPath: pathInfo.dir,
                    path: random.array(random.pick(randomPathMap.directories, 2).concat(pathInfo.dir)),
                    fileName: pathInfo.base
                };
            },
            info (data) {
                return `is there ${data.fileName} inner ${data.path}?`;
            },
            prompt (data) {
                return {
                    type: 'confirm',
                    name: 'confirm',
                    message: `is there ${data.fileName} inner ${data.path}?`
                }
            },
            validate ({data, prompt}) {
                return (data.realPath === data.path) === prompt.confirm;
            }
        }
    ];
};
