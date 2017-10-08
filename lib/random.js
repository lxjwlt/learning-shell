'use strict';

const {util:{random}, seed} = require('data-seed');
const fs = require('fs');
const path = require('path');

let util = Object.assign({
    randomPath: function () {
        return process.env.HOME + random.arr(random.int(1, 3), seed.word(3, 5)).join('/');
    },
    randomExistPath: function (deep=3) {
        let i = 0;
        let currentDir = process.env.HOME;

        debugger;

        while (i < deep) {
            let dirs = fs.readdirSync(currentDir).filter((dir) => {
                return fs.statSync(path.join(currentDir, dir)).isDirectory();
            });

            currentDir = path.join(currentDir, random.array(dirs));

            if (random.chance({ 0.4: true, 0.6: false })) {
                return currentDir;
            }

            i = i + 1;
        }

        return currentDir;
    }
}, random);

module.exports = util;
