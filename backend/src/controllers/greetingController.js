const { buildGreeting } = require('../services/greetingService');

function getGreeting(req, res, next) {
    try {
        const message = buildGreeting();
        res.json({
            message,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getGreeting,
};
