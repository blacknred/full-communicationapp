import { RedisPubSub } from 'graphql-redis-subscriptions';

import redisClient from './redis';

export default new RedisPubSub({
    publisher: redisClient,
    subscriber: redisClient,
});
