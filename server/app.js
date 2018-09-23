import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

import models from './models';
import { refreshTokens } from './auth';

const SECRET = process.env.TOKEN_SECRET;
const SECRET2 = process.env.TOKEN_SECRET_2;

const app = express();
app.use(cors());
app.use(bodyParser.json());
// jwt auth
app.use(async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
            console.log('user', req.user);
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens({
                token, refreshToken, models, SECRET, SECRET2,
            });
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
        }
    }
    next();
});

export default app;