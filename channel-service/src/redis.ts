import { RedisClient, ClientOpts } from "redis";
import { stores } from "koa-session";
import { promisify } from "util";

/** Redis instance */

export class Redis extends RedisClient {
  public get: any;
  public set: any;
  public del: any;

  constructor(opts: ClientOpts) {
    opts.retry_strategy = (opt) => Math.max(opt.attempt * 100, 3000);
    super(opts);

    this.get = promisify(this.get).bind(this);
    this.set = promisify(this.set).bind(this);
    this.del = promisify(this.del).bind(this);
  }
}

/** Session instance */

export class RedisSession implements stores {
  constructor(private redis: any) {}

  async get(key: any, maxAge: any, { rolling }: any) {
    console.log(key, maxAge, rolling);
    const res = await this.redis.get(key);
    if (!res) return null;
    return JSON.parse(res);
  }

  async set(key: any, sess: any, maxAge: any, { rolling, changed }: any) {
    console.log(key, sess, maxAge, rolling, changed);
    await this.redis.set(key, JSON.stringify(sess), "PX", maxAge); //EX
    // await redis.hset(key, "views", sess.views);
    // return key;
  }

  async destroy(key: any) {
    await this.redis.del(key);
  }
}
