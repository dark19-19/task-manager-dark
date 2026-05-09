const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dataDir = path.resolve(__dirname, '../../data');
const dbPath = path.join(dataDir, 'tasks.db');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error('Unable to open SQLite database:', err.message);
        process.exit(1);
    }
});

function init() {
    const createTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      created_at TEXT NOT NULL
    );
  `;

    return new Promise((resolve, reject) => {
        db.run(createTable, error => {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

module.exports = {
    db,
    init,
};
