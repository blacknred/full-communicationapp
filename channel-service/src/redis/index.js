import redis from 'redis';
import bluebird from 'bluebird';

import conf from '../../config';

const client = redis.createClient({
    port: conf.redis.port,
    host: conf.redis.host,
    retry_strategy: options => Math.max(options.attempt * 100, 3000),
});

client.auth(conf.redis.password);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default client;
