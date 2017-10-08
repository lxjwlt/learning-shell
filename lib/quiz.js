'use strict';

const fs = require('fs');
const path = require('path');
const quizPath = path.resolve(__dirname, '../quiz/');
let id = 0;

let quizList = [];
let quizMap = {};

class Quiz {

    constructor (config) {
        this.config = config = Object.assign(config);

        Object.keys(config).forEach((name) => {
            if (typeof config[name] !== 'function') {
                let oldValue = config[name];
                config[name] = function () {
                    return oldValue;
                };
            }
        });

        this.title = this.config.title();

        this.data = {};
    }

    start () {
        if (this.config.data) {
            this.data = this.config.data() || {};
        }

        this.info = this.config.info(this.data);
    }

    validate (cmd, cwd) {
        return this.config.validate(cmd, cwd, this.data);
    }

}

fs.readdirSync(quizPath).forEach((name) => {
    let info = path.parse(name);

    if (info.ext === '.js') {
        let func = require(path.resolve(quizPath, name));
        quizList = quizList.concat(func());
    }
});

quizList.forEach((quiz, i) => {
    quiz = new Quiz(quiz);

    Object.defineProperty(quiz, 'id', {
        value: id++
    });

    quizList[i] = quiz;
});

quizList.reduce((map, quiz) => {
    quizMap[quiz.id] = quiz;
    return quizMap;
}, quizMap);

module.exports = {
    quizList, quizMap
};
