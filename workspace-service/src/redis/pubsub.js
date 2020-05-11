import redis from 'redis';
import {
    RedisPubSub,
} from 'graphql-redis-subscriptions';

import conf from '../../config';

const options = {
    port: conf.redis.port,
    host: conf.redis.host,
    retry_strategy: opts => Math.max(opts.attempt * 100, 3000),
};

const publisher = redis.createClient(options);

publisher.auth(conf.redis.password);

const subscriber = redis.createClient(options);

subscriber.auth(conf.redis.password);

export default new RedisPubSub({
    publisher,
    subscriber,
});
