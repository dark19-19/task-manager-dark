const config = {
    port: process.env.PORT || 3000,
    cors: {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
};

module.exports = config;
