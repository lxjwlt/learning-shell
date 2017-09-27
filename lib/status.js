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
        if (!this.task) {
            return '';
        }
        return this.getStatusColor(this.task)(`TASK-${this.task.id}`);
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

    _pushTaskToHistory () {
        if (this.task) {
            this.task.done();
            this.history.push(this.task.getData());
        }
    }

}

module.exports = new Status();
