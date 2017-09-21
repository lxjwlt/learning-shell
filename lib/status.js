'use strict';

const store = require('./store');
const TaskStatus = require('./task-status');

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
        if (!taskId && taskId !== 0) {
            throw(new TypeError(`${taskId} is unexpected`));
        }

        this._pushTaskToHistory();

        this.task = new TaskStatus();
    }

    _pushTaskToHistory () {
        if (this.task && this.task.isBegin()) {
            this.history.push(this.task.getData());
        }
    }

}

module.exports = new Status();
