import { RedisPubSub } from 'graphql-redis-subscriptions';

import redis from 'redis';

const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

const client = redis.createClient({
    port: 6379,
    host: 'redis',
    retry_strategy: options => Math.max(options.attempt * 100, 3000),
});
client.auth(REDIS_PASSWORD);

export default new RedisPubSub({
    publisher: client,
    subscriber: client,
});
