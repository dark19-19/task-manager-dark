const express = require('express');
const { getGreeting } = require('../controllers/greetingController');
const taskRoutes = require('./taskRoutes');

const router = express.Router();

router.use('/tasks', taskRoutes);
router.get('/greeting', getGreeting);

module.exports = router;
