const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require('./middlewares/errorHandler');
const config = require('./config');

const app = express();

app.use(cors(config.cors));
app.use(express.json());
app.use('/api', apiRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Resource not found' });
});

app.use(errorHandler);

module.exports = app;
