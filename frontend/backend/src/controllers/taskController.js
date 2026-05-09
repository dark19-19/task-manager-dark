const taskService = require('../services/taskService');

async function listTasks(req, res, next) {
    try {
        const tasks = await taskService.listTasks(req.query);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
}

async function getTask(req, res, next) {
    try {
        const task = await taskService.getTaskById(Number(req.params.id));
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function createTask(req, res, next) {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}

async function updateTask(req, res, next) {
    try {
        const task = await taskService.updateTask(Number(req.params.id), req.body);
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function deleteTask(req, res, next) {
    try {
        await taskService.deleteTask(Number(req.params.id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
};
