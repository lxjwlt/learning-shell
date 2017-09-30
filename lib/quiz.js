'use strict';

const fs = require('fs');
const path = require('path');
const quizPath = path.resolve(__dirname, '../quiz/');
let id = 0;

let quizList = [];
let quizMap = {};

fs.readdirSync(quizPath).forEach((name) => {
    let info = path.parse(name);

    if (info.ext === '.js') {
        let func = require(path.resolve(quizPath, name));
        quizList = quizList.concat(func());
    }
});

quizList.forEach((quiz) => quiz.id = id++);

quizList.reduce((map, quiz) => {
    quizMap[quiz.id] = quiz;
    return quizMap;
}, quizMap);

module.exports = {
    quizList, quizMap
};
