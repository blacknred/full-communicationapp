import {
    pick,
} from 'lodash';
import Debug from 'debug';
import jwt from 'jsonwebtoken';

import conf from '../config';
import redisClient from './redis';

const debug = Debug('corporate-messenger:auth');

export const SECRET2 = conf.secrets.secret2;

export const createTokens = async (user, refreshTokenSecret = conf.secrets.secret2) => {
    const createToken = jwt.sign({
        user: pick(user, ['id', 'username']),
    }, conf.secrets.secret, {
        expiresIn: '1h',
    });

    const createRefreshToken = jwt.sign({
        user: pick(user, ['id', 'username']),
    }, // ?[]
    refreshTokenSecret, {
        expiresIn: '7d',
    });

    return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (refreshToken, models) => {
    let userId = 0;

    try {
        const {
            user: {
                id,
            },
        } = jwt.decode(refreshToken);

        userId = id;
    } catch (err) {
        return {};
    }
    if (!userId) return {};

    const user = await models.User.findByPk(userId);

    if (!user) return {};

    /* TODO: it is safer to add user.password to the secret, but in this case
    we need to log out after changing the password on the client */
    const refreshSecret = conf.secrets.secret2;

    try {
        jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
        return {};
    }

    const [newToken, newRefreshToken] = await createTokens(user, refreshSecret);

    debug('tokens refreshed for user id: ', userId);

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
            const {
                user,
            } = jwt.verify(token, conf.secrets.secret);

            req.user = user;
            /*
            in case of successful authentication set up online status
            of current user id with date and ONLINE_TIMESPAN
            */
            const onlineStatus = `user_${user.id}_online`;

            redisClient.set(onlineStatus, (new Date()).getTime(), 'EX', conf.onlineTimespan);
            // Math.floor((new Date()).getTime() / 1000)
            // redisClient.expire(onlineStatus, ONLINE_TIMESPAN);
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];

            const newTokens = await refreshTokens(refreshToken, models);

            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }

            return next();
        }
    }

    return next();
};

export const checkSubscriptionAuth = async (models, token, refreshToken) => {
    let curUser = null;

    if (token && refreshToken) {
        try {
            const {
                user,
            } = jwt.verify(token, token, conf.secrets.secret);

            curUser = user;
        } catch (err) {
            const {
                user,
            } = await refreshTokens(refreshToken, models);

            curUser = user;
        }
    }

    return curUser;
};

export const createInviteToken = (credentials, hours = 24) => jwt.sign({
    credentials,
}, conf.secrets.secret, {
    expiresIn: `${hours}h`,
});

export const checkInviteToken = (token) => {
    try {
        const {
            credentials,
        } = jwt.verify(token, conf.secrets.secret);

        return credentials;
    } catch (e) {
        return {};
    }
};
