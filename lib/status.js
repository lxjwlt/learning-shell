'use strict';

const store = require('./store');
const TaskStatus = require('./task-status');
const chalk = require('chalk');

class Status {

    constructor () {
        let oldStatus = store.get('status') || {};

        this.task = oldStatus.task ? TaskStatus.clone(oldStatus.task) : null;

        this.history = oldStatus.history || [];
    }

    save () {
        return store.set('status', {
            task: this.task && this.task.getData(),
            history: this.history
        });
    }

    newTask (taskId) {
        this._pushTaskToHistory();

        this.task = new TaskStatus(taskId);
    }

    getStatusText () {
        if (!this.task || this.task.isQuit()) {
            return '';
        }

        if (this.task.isRun()) {
            return chalk.yellow('running');
        }

        if (this.task.isSuccess()) {
            return chalk.green('success');
        }

        if (this.task.isFail()) {
            return chalk.red('error');
        }
    }

    getTaskName () {
        if (!this.task) {
            return '';
        }
        return `TASK-${this.task.id}`;
    }

    _pushTaskToHistory () {
        if (this.task) {
            this.task.done();
            this.history.push(this.task.getData());
        }
    }

}

module.exports = new Status();
