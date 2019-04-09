import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import RedisStore from 'rate-limit-redis';
import RateLimit from 'express-rate-limit';

import {
    checkAuth,
} from './auth';
import conf from '../config';
import models from './models';
import redisClient from './redis';

const limiter = new RateLimit({
    store: new RedisStore({
        client: redisClient,
    }),
    max: conf.limit.max_requests,
    windowMs: conf.limit.interval,
    timeWait: 3 * 1000,
    // skip: () => {}, check api plan token
    message: 'Too many requests, please try again after',
});

const app = express();

app.use(conf.cors.allow ? cors(conf.cors.client_host) : cors());

app.use(limiter);

app.use(bodyParser.json());

app.use((req, res, next) => checkAuth(models, req, res, next));

export default app;
