import { RedisPubSub } from 'graphql-redis-subscriptions';

import redis from 'redis';

const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

const options = {
    port: 6379,
    host: 'redis',
    retry_strategy: opts => Math.max(opts.attempt * 100, 3000),
};

const publisher = redis.createClient(options);
publisher.auth(REDIS_PASSWORD);

const subscriber = redis.createClient(options);
subscriber.auth(REDIS_PASSWORD);

export default new RedisPubSub({ publisher, subscriber });
