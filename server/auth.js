import _ from 'lodash';
import jwt from 'jsonwebtoken';

import redisClient from './redis';

const ONLINE_TIMESPAN = process.env.ONLINE_TIMESPAN || 60 * 5;
const SECRET = process.env.TOKEN_SECRET || 'insecure-secret';
export const SECRET2 = process.env.TOKEN_SECRET_2 || 'insecure-secret2';

export const createTokens = async ({ user, refreshTokenSecret }) => {
    const createToken = jwt.sign(
        { user: _.pick(user, ['id', 'username']) },
        SECRET,
        { expiresIn: '1h' },
    );

    const createRefreshToken = jwt.sign(
        { user: _.pick(user, 'id', 'username') },
        refreshTokenSecret,
        { expiresIn: '7d' },
    );

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async ({ refreshToken, models }) => {
    let userId = 0;
    try {
        const { user: { id } } = jwt.decode(refreshToken);
        userId = id;
    } catch (err) {
        return {};
    }
    console.log('authenticated user id: ', userId);

    if (!userId) return {};

    const user = await models.User.findOne({
        where: { id: userId }, raw: true,
    });

    if (!user) return {};

    const refreshSecret = user.password + SECRET2;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens({
        user, refreshTokenSecret: refreshSecret,
    });
    return {
        token: newToken,
        refreshToken: newRefreshToken,
        user,
    };
};

export const checkAuth = async (models, req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
            /*
            in case of successful authentication set up online status
            of current user id with date and ONLINE_TIMESPAN
            */
            const onlineStatus = `user_${user.id}_online`;
            redisClient.set(onlineStatus, (new Date()).getTime());
            // Math.floor((new Date()).getTime() / 1000)
            redisClient.expire(onlineStatus, ONLINE_TIMESPAN);
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens({ refreshToken, models });
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
        }
    }
    next();
};

export const checkAuth2 = async (models, token, refreshToken) => {
    let curUser = null;
    if (token && refreshToken) {
        try {
            const { user } = jwt.verify(token, SECRET);
            curUser = user;
        } catch (err) {
            const { user } = await refreshTokens({
                token, refreshToken, models,
            });
            curUser = user;
        }
    }
    return curUser;
};
