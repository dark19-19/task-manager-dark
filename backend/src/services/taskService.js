const {
    findAllTasks,
    findTaskById,
    createTask: insertTask,
    updateTask: updateTaskModel,
    deleteTask: deleteTaskById,
} = require('../models/taskModel');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function createHttpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function normalizeDate(value) {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw createHttpError(400, `Invalid date value: ${value}`);
    }

    return date.toISOString();
}

function validateStatus(value) {
    if (!value) {
        return null;
    }

    if (!VALID_STATUSES.includes(value)) {
        throw createHttpError(400, `Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    return value;
}

function validatePriority(value) {
    if (!value) {
        return null;
    }

    if (!VALID_PRIORITIES.includes(value)) {
        throw createHttpError(400, `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }

    return value;
}

async function listTasks(filters = {}) {
    const queryFilters = {
        status: validateStatus(filters.status),
        created_after: normalizeDate(filters.created_after),
        created_before: normalizeDate(filters.created_before),
        created_at: normalizeDate(filters.created_at),
    };

    return findAllTasks(queryFilters);
}

async function getTaskById(id) {
    const task = await findTaskById(id);
    if (!task) {
        throw createHttpError(404, 'Task not found');
    }
    return task;
}

async function createTask(data) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
        throw createHttpError(400, 'Title is required');
    }

    const taskPayload = {
        title: data.title.trim(),
        description: typeof data.description === 'string' ? data.description.trim() : '',
        status: validateStatus(data.status) || 'pending',
        priority: validatePriority(data.priority) || 'medium',
        created_at: new Date().toISOString(),
    };

    return insertTask(taskPayload);
}

async function updateTask(id, data) {
    const fields = {};

    if (data.title !== undefined) {
        if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
            throw createHttpError(400, 'Title must be a non-empty string');
        }
        fields.title = data.title.trim();
    }

    if (data.description !== undefined) {
        fields.description = data.description === null ? '' : String(data.description).trim();
    }

    if (data.status !== undefined) {
        fields.status = validateStatus(data.status);
    }

    if (data.priority !== undefined) {
        fields.priority = validatePriority(data.priority);
    }

    if (Object.keys(fields).length === 0) {
        throw createHttpError(400, 'No valid task fields provided for update');
    }

    const updated = await updateTaskModel(id, fields);
    if (!updated) {
        throw createHttpError(404, 'Task not found');
    }
    return updated;
}

async function deleteTask(id) {
    const deleted = await deleteTaskById(id);
    if (!deleted) {
        throw createHttpError(404, 'Task not found');
    }
    return deleted;
}

module.exports = {
    listTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    VALID_STATUSES,
    VALID_PRIORITIES,
};
