'use strict';

class TaskStatus {

    constructor (taskId) {
        this.status = null;
        this.startTime = 0;
        this.endTime = 0;
        this.taskId = taskId;
    }

    getData () {
        return Object.assign({}, this);
    }

    start () {
        this.status = TaskStatus.RUNNING_STATUS;
        this.startTime = Date.now();
    }

    isBegin () {
        return Boolean(this.status);
    }

    isRun () {
        return TaskStatus.isRun(this);
    }

    isFinish () {
        return TaskStatus.isFinish(this);
    }

    isSuccess () {
        return TaskStatus.isSuccess(this);
    }

    isFail () {
        return TaskStatus.isFail(this);
    }

    isQuit () {
        return TaskStatus.isQuit(this);
    }

    done (success) {
        if (typeof success === 'undefined') {
            this.status = TaskStatus.QUIT_STATUS;
            return;
        }

        this.status = success ? TaskStatus.SUCCESS_STATUS : TaskStatus.FAIL_STATUS;
    }

    clone (oldTask) {
        Object.assign(this, oldTask);
    }

}

TaskStatus.clone = function (oldTask) {
    let task = new TaskStatus();
    task.clone(oldTask);
    return task;
};

TaskStatus.isRun = function (task) {
    return task && task.status === TaskStatus.RUNNING_STATUS;
};

TaskStatus.isFinish = function (task) {
    return TaskStatus.isSuccess() || TaskStatus.isFail(task) || TaskStatus.isQuit(task);
};

TaskStatus.isSuccess = function (task) {
    return task && task.status === TaskStatus.SUCCESS_STATUS;
};

TaskStatus.isFail = function (task) {
    return task && task.status === TaskStatus.FAIL_STATUS;
};

TaskStatus.isQuit = function (task) {
    return task && task.status === TaskStatus.QUIT_STATUS;
};

TaskStatus.RUNNING_STATUS = 'running';

TaskStatus.SUCCESS_STATUS = 'success';

TaskStatus.FAIL_STATUS = 'failed';

TaskStatus.QUIT_STATUS = 'quited';

module.exports = TaskStatus;
