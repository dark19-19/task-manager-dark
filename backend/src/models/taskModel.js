const { db } = require('../db');

function buildFilterQuery(filters) {
    const conditions = [];
    const params = [];

    if (filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
    }

    if (filters.created_after) {
        conditions.push('created_at >= ?');
        params.push(filters.created_after);
    }

    if (filters.created_before) {
        conditions.push('created_at <= ?');
        params.push(filters.created_before);
    }

    if (filters.created_at) {
        conditions.push('created_at = ?');
        params.push(filters.created_at);
    }

    let query = 'SELECT * FROM tasks';
    if (conditions.length) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ' ORDER BY created_at DESC';

    return { query, params };
}

function findAllTasks(filters = {}) {
    const { query, params } = buildFilterQuery(filters);
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

function findTaskById(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row || null);
        });
    });
}

function createTask({ title, description, status, priority, created_at }) {
    return new Promise((resolve, reject) => {
        const sql = `
      INSERT INTO tasks (title, description, status, priority, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
        db.run(sql, [title, description, status, priority, created_at], function (err) {
            if (err) {
                return reject(err);
            }
            findTaskById(this.lastID)
                .then(resolve)
                .catch(reject);
        });
    });
}

function updateTask(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) {
        return Promise.resolve(null);
    }

    const assignments = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => fields[key]);
    params.push(id);

    const sql = `UPDATE tasks SET ${assignments} WHERE id = ?`;

    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                return reject(err);
            }
            if (this.changes === 0) {
                return resolve(null);
            }
            findTaskById(id)
                .then(resolve)
                .catch(reject);
        });
    });
}

function deleteTask(id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes > 0);
        });
    });
}

module.exports = {
    findAllTasks,
    findTaskById,
    createTask,
    updateTask,
    deleteTask,
};
