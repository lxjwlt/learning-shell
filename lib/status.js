'use strict';

const store = require('./store');
const TaskStatus = require('./task-status');
const chalk = require('chalk');
const {quizMap} = require('../lib/quiz');

class Status {

    constructor () {
        let oldStatus = store.get('status') || {};

        this.task = oldStatus.task ? TaskStatus.clone(oldStatus.task) : null;

        if (typeof oldStatus.quizId !== 'undefined') {
            this.startQuiz(oldStatus.quizId);
        }

        this.history = oldStatus.history || [];
    }

    save () {
        return store.set('status', {
            task: this.task && this.task.getData(),
            quizId: this.quiz && this.quiz.id,
            history: this.history
        });
    }

    startQuiz (quiz) {
        this.quitQuiz();

        if (typeof quiz !== 'object') {
            quiz = quizMap[quiz];
        }

        if (!quiz) {
            return;
        }

        quiz.start();

        this.task = new TaskStatus(quiz.id);

        this.quiz = quiz;
    }

    quitQuiz () {
        if (this.task && this.quiz) {
            this.task.done();
            this.history.push(Object.assign(this.task.getData(), {
                quizId: this.quiz.id
            }));

            this.quiz.destroy();

            this.task = null;
            this.quiz = null;
        }
    }

    getStatusText (task) {
        let color = this.getStatusColor(task);
        let text = '';

        if (task.isRun()) {
            text = 'running';
        }

        if (task.isSuccess()) {
            text = 'success';
        }

        if (task.isFail()) {
            text = 'error';
        }

        return color(text);
    }

    getTaskName () {
        if (!this.quiz) {
            return '';
        }
        return this.getStatusColor(this.task)(this.quiz.title);
    }

    getStatusColor (task) {
        if (!task || task.isQuit()) {
            return chalk.grey;
        }

        if (task.isRun()) {
            return chalk.yellow;
        }

        if (task.isSuccess()) {
            return chalk.green;
        }

        if (task.isFail()) {
            return chalk.red;
        }
    }

    validate () {
        if (!this.quiz) {
            return false;
        }

        let valid = this.quiz.validate.apply(this.quiz, arguments);

        if (valid === true) {
            this.quitQuiz();
        }

        return valid;
    }

}

module.exports = new Status();
