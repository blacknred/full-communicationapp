const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
    path: path.join(__dirname, '../', `.env.${process.env.NODE_ENV || 'development'}`),
});

module.exports = {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    is_db_drop: process.env.NODE_ENV === 'test',
    is_logging: process.env.NODE_ENV === 'test',
    logs_path: path.join(__dirname, '../', 'logs'),
    onlineTimespan: process.env.ONLINE_TIMESPAN || 60 * 5,
    cors: {
        allow: process.env.NODE_ENV === 'production',
        client_host: process.env.CLIENT_HOST,
    },
    email: {
        service: 'Gmail',
        user: process.env.GMAIL_USER,
        password: process.env.GMAIL_PASSWORD,
    },
    redis: {
        port: 6379,
        host: 'redis',
        password: process.env.REDIS_PASSWORD || '',
    },
    dbUrls: {
        development: process.env.DATABASE_URL,
        test: process.env.DATABASE_TEST_URL,
    },
    secrets: {
        secret: process.env.TOKEN_SECRET || 'insecure-secret',
        secret2: process.env.TOKEN_SECRET_2 || 'insecure-secret2',
    },
    limit: {
        max_requests: process.env.RATE_LIMIT_MAX_REQUESTS || 33,
        interval: process.env.RATE_LIMIT_INTERVAL || 15 * 60 * 1000,
    },
    apollo: {
        engineKey: process.env.ENGINE_API_KEY,
        subscriptions_path: '/subscriptions',
        schemasPath: path.join(__dirname, '../', 'src', 'graphql', 'schemas'),
        resolversPath: path.join(__dirname, '../', 'src', 'graphql', 'resolvers'),
    },
};
