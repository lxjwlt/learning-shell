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
        let map = {
            directories: [],
            files: []
        };

        while (i < deep) {
            let dirs = fs.readdirSync(currentDir).filter((dir) => {
                let dirPath = path.join(currentDir, dir);
                let stat = fs.statSync(dirPath);

                if (stat.isFile()) {
                    map.files.push(dirPath)
                }

                if (stat.isDirectory()) {
                    map.directories.push(dirPath);
                }

                return stat.isDirectory();
            });

            if (dirs.length) {
                currentDir = path.join(currentDir, random.array(dirs));

                if (random.one(true, false)) {
                    return map;
                }
            }

            i = i + 1;
        }

        return map;
    },
    rearrange (arr) {
        return arr.sort(() => random.chance({
            6: 1,
            4: 0
        }));
    },
    pick (arr, num = 1) {
        if (num >= arr.length) {
            return arr;
        }

        if (!num) {
            return [];
        }

        let numbers = Array.from(Array(arr.length)).map((v, i) => i);

        for (let i = numbers.length - num; i; i--) {
            numbers.splice(random.int(0, numbers.length - 1), 1);
        }

        return numbers.map((index) => arr[index]);
    }

}, random);

module.exports = util;
