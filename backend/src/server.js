const app = require('./app');
const config = require('./config');
const { init } = require('./db');

init()
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Backend server is running on http://localhost:${config.port}`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize database:', error.message);
        process.exit(1);
    });
